import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import { STYLEFRAME_FIXTURES } from "./tests/fixtures/styleframes.catalog";

dotenv.config();

const defaultProjects = STYLEFRAME_FIXTURES.map((styleframe) => ({
  name: styleframe.issueId,
  testMatch: ["tests/styleframes.spec.ts"],
  use: {
    styleframe,
    expectToFail: true,
  },
}));

export default defineConfig({
  testDir: ".",
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["./reporters/linear-reporter.ts"],
  ],
  projects: defaultProjects,
} as any);
