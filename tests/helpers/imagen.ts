import { APIRequestContext } from "@playwright/test";
import { execSync } from "child_process";

const DRY_RUN = process.env.IMAGEN_DRY_RUN !== "false"; // dry-run by default

export interface ImagenOptions {
    prompt: string;
    negativePrompt?: string;
    aspectRatio?: string;
    sampleCount?: number;
}

interface ImagenAttemptDebug {
    attempt: number;
    promptPreview: string;
    status: number;
    ok: boolean;
    hasImage: boolean;
    responsePreview: string;
}

export interface ImagenResult {
    imageBuffer: Buffer;
    debug: {
        endpoint: string;
        attempts: ImagenAttemptDebug[];
    };
}

function getAccessToken(): string {
    if (process.env.GOOGLE_ACCESS_TOKEN) return process.env.GOOGLE_ACCESS_TOKEN;
    return execSync("gcloud auth print-access-token", {
        encoding: "utf-8",
    }).trim();
}

function vertexBaseUrl(project: string, location: string): string {
    return `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}`;
}

function sanitizePrompt(prompt: string): string {
    return prompt
        .replace(/\bchild\b/gi, "person")
        .replace(/\bchildren\b/gi, "people")
        .replace(/\bboy\b/gi, "person")
        .replace(/\bgirl\b/gi, "person");
}

function extractImageBytes(result: Record<string, any>): string | null {
    const first = result?.predictions?.[0] ?? result?.images?.[0] ?? {};
    return (
        first?.bytesBase64Encoded ||
        first?.image?.bytesBase64Encoded ||
        first?.images?.[0]?.bytesBase64Encoded ||
        null
    );
}

export async function generateImage(
    request: APIRequestContext,
    options: ImagenOptions
): Promise<ImagenResult> {
    const project = process.env.GOOGLE_CLOUD_PROJECT || "my-project";
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    const model = "imagen-3.0-generate-002";
    const baseUrl = vertexBaseUrl(project, location);

    if (!DRY_RUN && (!process.env.GOOGLE_CLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT === "my-project")) {
        throw new Error(
            "GOOGLE_CLOUD_PROJECT must be set to a real GCP project when IMAGEN_DRY_RUN=false"
        );
    }

    let token = "dry-run-token";
    if (!DRY_RUN) {
        token = getAccessToken();
    }

    const requestBody = {
        instances: [
            {
                prompt: options.prompt,
                ...(options.negativePrompt && {
                    negativePrompt: options.negativePrompt,
                }),
            },
        ],
        parameters: {
            sampleCount: options.sampleCount || 1,
            aspectRatio: options.aspectRatio || "16:9",
        },
    };

    const endpoint = `${baseUrl}/publishers/google/models/${model}:predict`;
    const attempts: ImagenAttemptDebug[] = [];

    if (DRY_RUN) {
        const mockPng = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "base64"
        );

        attempts.push({
            attempt: 1,
            promptPreview: options.prompt.slice(0, 160),
            status: 200,
            ok: true,
            hasImage: true,
            responsePreview: "{\"predictions\":[{\"bytesBase64Encoded\":\"...\"}]}",
        });

        return { imageBuffer: mockPng, debug: { endpoint, attempts } };
    }

    const tryRequest = async (attempt: number, prompt: string): Promise<string | null> => {
        const payload = {
            ...requestBody,
            instances: [
                {
                    prompt,
                    ...(options.negativePrompt && {
                        negativePrompt: options.negativePrompt,
                    }),
                },
            ],
        };

        const response = await request.post(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: payload,
            failOnStatusCode: false,
        });

        const status = response.status();
        const text = await response.text();
        let parsed: Record<string, any> = {};
        try {
            parsed = text ? JSON.parse(text) : {};
        } catch {
            parsed = {};
        }

        const base64 = extractImageBytes(parsed);
        attempts.push({
            attempt,
            promptPreview: prompt.slice(0, 160),
            status,
            ok: response.ok(),
            hasImage: Boolean(base64),
            responsePreview: text.slice(0, 1200),
        });

        if (!response.ok()) {
            throw new Error(`Imagen predict failed (${status}): ${text.slice(0, 2000)}`);
        }

        return base64;
    };

    const firstAttempt = await tryRequest(1, options.prompt);
    if (firstAttempt) {
        return {
            imageBuffer: Buffer.from(firstAttempt, "base64"),
            debug: { endpoint, attempts },
        };
    }

    const fallbackPrompt = sanitizePrompt(options.prompt);
    if (fallbackPrompt !== options.prompt) {
        const secondAttempt = await tryRequest(2, fallbackPrompt);
        if (secondAttempt) {
            return {
                imageBuffer: Buffer.from(secondAttempt, "base64"),
                debug: { endpoint, attempts },
            };
        }
    }

    throw new Error(
        `No image data in Imagen response after ${attempts.length} attempt(s): ${JSON.stringify(
            attempts
        ).slice(0, 3000)}`
    );
}
