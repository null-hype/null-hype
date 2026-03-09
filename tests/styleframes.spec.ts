import { expect, test as base } from "@playwright/test";
import { saveAsset } from "./helpers/assets";
import { generateImage } from "./helpers/imagen";
import type { StyleframeFixture } from "./fixtures/styleframes.catalog";

type ProjectOptions = {
  styleframe: StyleframeFixture;
  expectToFail: boolean;
};

const test = base.extend<ProjectOptions>({
  styleframe: [
    {
      issueId: "RAN-UNKNOWN",
      beat: "unknown",
      title: "Missing styleframe fixture",
      prompt: "",
      negativePrompt: "",
      aspectRatio: "16:9",
    },
    { option: true },
  ],
  expectToFail: [true, { option: true }],
});

test("styleframe render", async ({ request, styleframe, expectToFail }, testInfo) => {
  test.fail(expectToFail, "Issue is still in iteration state");

  expect(styleframe.issueId).toMatch(/^RAN-\d+$/);
  expect(styleframe.prompt.length).toBeGreaterThan(40);

  const generated = await generateImage(request, {
    prompt: styleframe.prompt,
    negativePrompt: styleframe.negativePrompt,
    aspectRatio: styleframe.aspectRatio,
  });
  const imageBuffer = generated.imageBuffer;

  expect(imageBuffer.length).toBeGreaterThan(0);

  const assetPath = saveAsset(imageBuffer, `${styleframe.beat}/${styleframe.issueId}/styleframe-latest.png`);

  await testInfo.attach("styleframe", {
    path: assetPath,
    contentType: "image/png",
  });
  await testInfo.attach("imagen-debug", {
    body: Buffer.from(JSON.stringify(generated.debug, null, 2)),
    contentType: "application/json",
  });

  console.log(`[${styleframe.issueId}] ${styleframe.title}`);
  console.log(`[${styleframe.issueId}] Asset saved: ${assetPath}`);
});
