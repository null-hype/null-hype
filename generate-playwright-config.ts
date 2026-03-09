import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { STYLEFRAME_FIXTURES } from "./tests/fixtures/styleframes.catalog";

dotenv.config();

type LinearIssueNode = {
  identifier: string;
  title: string;
  state: {
    name: string;
    type: string;
  };
};

const GENERATED_CONFIG_PATH = path.resolve(__dirname, "playwright.config.generated.ts");

async function linearGraphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error("LINEAR_API_KEY is required to generate project config from Linear issues");
  }

  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Linear API request failed: ${res.status} ${res.statusText} - ${body}`);
  }

  const payload = (await res.json()) as { errors?: { message: string }[] } & T;
  if (payload.errors?.length) {
    throw new Error(`Linear GraphQL error: ${payload.errors.map((e) => e.message).join("; ")}`);
  }

  return payload;
}

function renderConfig(projects: unknown[]): string {
  return `import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

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
  projects: ${JSON.stringify(projects, null, 2)},
} as any);
`;
}

async function main(): Promise<void> {
  const configuredTeamKey = process.env.LINEAR_TEAM_KEY;
  const fallbackTeamKey = STYLEFRAME_FIXTURES[0]?.issueId.split("-")[0];
  const teamKey = configuredTeamKey || fallbackTeamKey;

  if (!teamKey) {
    throw new Error("Could not determine LINEAR_TEAM_KEY");
  }

  const fixtureByIssueId = new Map(STYLEFRAME_FIXTURES.map((x) => [x.issueId, x]));

  const response = await linearGraphql<{
    data?: { issues?: { nodes?: LinearIssueNode[] } };
  }>(
    `
      query TeamIssues($teamKey: String!) {
        issues(
          first: 250
          filter: {
            team: { key: { eq: $teamKey } }
          }
        ) {
          nodes {
            identifier
            title
            state {
              name
              type
            }
          }
        }
      }
    `,
    { teamKey }
  );

  const linearIssues = response.data?.issues?.nodes ?? [];
  const active = linearIssues.filter((issue) => issue.state.type !== "completed" && issue.state.type !== "canceled");

  const projects = active
    .filter((issue) => fixtureByIssueId.has(issue.identifier))
    .map((issue) => ({
      name: issue.identifier,
      testMatch: ["tests/styleframes.spec.ts"],
      use: {
        styleframe: fixtureByIssueId.get(issue.identifier),
        expectToFail: issue.state.type !== "completed",
      },
      metadata: {
        linearStateName: issue.state.name,
        linearStateType: issue.state.type,
        linearTitle: issue.title,
      },
    }));

  if (projects.length === 0) {
    console.warn("[generate-playwright-config] No active matching Linear issues found. Falling back to all fixtures as expect-to-fail.");
    for (const styleframe of STYLEFRAME_FIXTURES) {
      projects.push({
        name: styleframe.issueId,
        testMatch: ["tests/styleframes.spec.ts"],
        use: {
          styleframe,
          expectToFail: true,
        },
      });
    }
  }

  fs.writeFileSync(GENERATED_CONFIG_PATH, renderConfig(projects));
  console.log(`[generate-playwright-config] wrote ${projects.length} projects to ${GENERATED_CONFIG_PATH}`);
}

main().catch((error) => {
  console.error(`[generate-playwright-config] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
