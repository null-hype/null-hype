import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const HAR_PATH = path.join(__dirname, "fixtures", "veo-generate.har");
const MODEL = "veo-3.1-fast-generate-001";
const POLL_INTERVAL_MS = 10_000;
const MAX_POLLS = 60;
const DRY_RUN = process.env.VEO_DRY_RUN !== "false"; // dry-run by default

function getAccessToken(): string {
    if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN;
    return execSync("gcloud auth print-access-token", {
        encoding: "utf-8",
    }).trim();
}

function vertexBaseUrl(project: string, location: string): string {
    return `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}`;
}

test("generate video with Veo 3.1 Fast", async ({ page }) => {
    const project = process.env.GOOGLE_CLOUD_PROJECT || "my-project";
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    const harExists = fs.existsSync(HAR_PATH);

    let token = "dry-run-token";
    if (!DRY_RUN && !harExists) {
        expect(
            process.env.GOOGLE_CLOUD_PROJECT,
            "GOOGLE_CLOUD_PROJECT must be set in .env"
        ).toBeTruthy();
        token = getAccessToken();
    }

    const baseUrl = vertexBaseUrl(project, location);

    if (DRY_RUN) {
        // Intercept all Vertex AI requests — log them and return mock responses.
        await page.route("**/*aiplatform.googleapis.com/**", async (route) => {
            const request = route.request();
            console.log(
                `[DRY RUN] request would have been made: ${request.method()} ${request.url()}`
            );
            const postData = request.postData();
            if (postData) {
                console.log(`[DRY RUN] request body: ${postData}`);
            }

            if (request.url().includes("predictLongRunning")) {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({
                        name: `projects/${project}/locations/${location}/publishers/google/models/${MODEL}/operations/mock-op-12345`,
                    }),
                });
                return;
            }

            // Mock fetchPredictOperation — immediately done with inline video
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    name: `projects/${project}/locations/${location}/publishers/google/models/${MODEL}/operations/mock-op-12345`,
                    done: true,
                    response: {
                        "@type": "type.googleapis.com/cloud.ai.large_models.vision.GenerateVideoResponse",
                        raiMediaFilteredCount: 0,
                        videos: [
                            {
                                bytesBase64Encoded: Buffer.from(
                                    "mock-video-content"
                                ).toString("base64"),
                            },
                        ],
                    },
                }),
            });
        });
    } else if (harExists) {
        await page.routeFromHAR(HAR_PATH, {
            url: "**/*aiplatform.googleapis.com/**",
            update: false,
        });
    } else {
        await page.routeFromHAR(HAR_PATH, {
            url: "**/*aiplatform.googleapis.com/**",
            update: true,
        });
    }

    // --- Step 1: Kick off the long-running video generation ---
    const initResult = await page.evaluate(
        async ({ baseUrl, model, token }) => {
            const res = await fetch(
                `${baseUrl}/publishers/google/models/${model}:predictLongRunning`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        instances: [
                            {
                                prompt: "A cinematic drone shot over a misty mountain range at sunrise, golden light breaking through clouds",
                            },
                        ],
                        parameters: {
                            aspectRatio: "16:9",
                            durationSeconds: 4,
                            numberOfVideos: 1,
                        },
                    }),
                }
            );
            if (!res.ok) {
                const text = await res.text();
                throw new Error(
                    `predictLongRunning failed (${res.status}): ${text}`
                );
            }
            return res.json();
        },
        { baseUrl, model: MODEL, token }
    );

    const operationName: string = initResult.name;
    expect(operationName, "operation name returned").toBeTruthy();
    console.log(`[Veo] Operation started: ${operationName}`);

    // --- Step 2: Poll via fetchPredictOperation until done ---
    const fetchOpUrl = `${baseUrl}/publishers/google/models/${MODEL}:fetchPredictOperation`;
    let videoBytes: string | undefined;

    for (let i = 0; i < MAX_POLLS; i++) {
        const poll = await page.evaluate(
            async ({ fetchOpUrl, operationName, token }) => {
                const res = await fetch(fetchOpUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ operationName }),
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`poll failed (${res.status}): ${text}`);
                }
                return res.json();
            },
            { fetchOpUrl, operationName, token }
        );

        if (poll.done) {
            videoBytes = poll.response?.videos?.[0]?.bytesBase64Encoded;
            console.log(`[Veo] Operation complete after ${i + 1} poll(s)`);
            break;
        }

        if (!DRY_RUN && !harExists) {
            console.log(`[Veo] Poll ${i + 1}/${MAX_POLLS} – still running…`);
            await page.waitForTimeout(POLL_INTERVAL_MS);
        }
    }

    expect(
        videoBytes,
        "video bytes should be present in completed operation"
    ).toBeTruthy();

    // --- Step 3: Save the video file ---
    const outputDir = path.resolve(__dirname, "..", "test-results", "veo");
    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

    const videoBuffer = Buffer.from(videoBytes!, "base64");
    const videoPath = path.join(outputDir, "generated.mp4");
    fs.writeFileSync(videoPath, videoBuffer);
    console.log(
        `[Veo] Saved video: ${videoPath} (${videoBuffer.length} bytes)`
    );

    fs.writeFileSync(
        path.join(outputDir, "result.json"),
        JSON.stringify(
            {
                operationName,
                videoFile: videoPath,
                videoSizeBytes: videoBuffer.length,
                model: MODEL,
                dryRun: DRY_RUN,
                harCached: !DRY_RUN && harExists,
            },
            null,
            2
        )
    );
});
