import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

type Outcome = "iteration" | "unexpected_pass" | "pass" | "fail";

function extractIssueId(projectName: string, title: string): string | null {
  const projectMatch = projectName.match(/^(RAN-\d+)$/);
  if (projectMatch) return projectMatch[1];

  const titleMatch = title.match(/\[(RAN-\d+)\]/);
  if (titleMatch) return titleMatch[1];

  return null;
}

async function linearApi<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    console.error(`[Linear Reporter] API error: ${res.status} ${res.statusText}`);
    return null;
  }

  const payload = (await res.json()) as { errors?: { message: string }[] } & T;
  if (payload.errors?.length) {
    console.error(`[Linear Reporter] GraphQL error: ${payload.errors.map((e) => e.message).join("; ")}`);
    return null;
  }

  return payload;
}

async function findIssueByIdentifier(identifier: string): Promise<string | null> {
  const [teamKey, numberRaw] = identifier.split("-");
  const issueNumber = Number(numberRaw);

  const result = await linearApi<{
    data?: { issues?: { nodes?: { id: string }[] } };
  }>(
    `
      query IssueByNumber($filter: IssueFilter) {
        issues(filter: $filter) {
          nodes {
            id
          }
        }
      }
    `,
    {
      filter: {
        team: { key: { eq: teamKey } },
        number: { eq: issueNumber },
      },
    }
  );

  return result?.data?.issues?.nodes?.[0]?.id ?? null;
}

async function addComment(issueId: string, body: string): Promise<void> {
  await linearApi(
    `
      mutation AddComment($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
        }
      }
    `,
    { input: { issueId, body } }
  );
}

async function getWorkflowStateIdByName(stateName: string): Promise<string | null> {
  const teamKey = process.env.LINEAR_TEAM_KEY;
  if (!teamKey) {
    console.warn("[Linear Reporter] LINEAR_TEAM_KEY not set, skipping workflow state changes");
    return null;
  }

  const result = await linearApi<{
    data?: { teams?: { nodes?: { states?: { nodes?: { id: string; name: string }[] } }[] } };
  }>(
    `
      query TeamStates($teamKey: String!) {
        teams(filter: { key: { eq: $teamKey } }) {
          nodes {
            states {
              nodes {
                id
                name
              }
            }
          }
        }
      }
    `,
    { teamKey }
  );

  const states = result?.data?.teams?.nodes?.[0]?.states?.nodes ?? [];
  return states.find((state) => state.name === stateName)?.id ?? null;
}

async function updateIssueState(issueId: string, stateName: string): Promise<void> {
  const stateId = await getWorkflowStateIdByName(stateName);
  if (!stateId) return;

  await linearApi(
    `
      mutation UpdateIssueState($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
        }
      }
    `,
    { id: issueId, input: { stateId } }
  );
}

function toOutcome(test: TestCase, result: TestResult): Outcome {
  const expectedToFail = test.expectedStatus === "failed";
  const passed = result.status === "passed";

  if (expectedToFail && passed) return "unexpected_pass";
  if (expectedToFail && !passed) return "iteration";
  if (!expectedToFail && passed) return "pass";
  return "fail";
}

class LinearReporter implements Reporter {
  onBegin(_config: FullConfig, _suite: Suite): void {
    if (!process.env.LINEAR_API_KEY) {
      console.warn("[Linear Reporter] LINEAR_API_KEY not set, skipping Linear sync");
    }
  }

  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    if (!process.env.LINEAR_API_KEY) return;

    const projectName = test.parent?.project()?.name ?? "";
    const identifier = extractIssueId(projectName, test.title);
    if (!identifier) return;

    const issueId = await findIssueByIdentifier(identifier);
    if (!issueId) {
      console.warn(`[Linear Reporter] Issue ${identifier} not found`);
      return;
    }

    const failState = process.env.LINEAR_STATE_FAIL || "In Progress";
    const passState = process.env.LINEAR_STATE_PASS || "Done";
    const outcome = toOutcome(test, result);
    const assetPaths = (result.attachments || [])
      .filter((attachment) => attachment.path)
      .map((attachment) => attachment.path)
      .join("\n");

    if (outcome === "iteration") {
      await addComment(
        issueId,
        [
          "**Iteration run** - expected failure via `test.fail(true)`.",
          `Status: \`${result.status}\``,
          `Duration: ${result.duration}ms`,
          assetPaths ? `\nAssets:\n\`\`\`\n${assetPaths}\n\`\`\`` : "",
        ]
          .filter(Boolean)
          .join("\n")
      );
      return;
    }

    if (outcome === "unexpected_pass") {
      await addComment(
        issueId,
        "**Unexpected pass** - test passed while marked with `test.fail(true)`. Review output and clear expected-fail when ready."
      );
      return;
    }

    if (outcome === "pass") {
      await updateIssueState(issueId, passState);
      await addComment(issueId, "**Accepted** - test passed and issue marked Done.");
      return;
    }

    await updateIssueState(issueId, failState);
    await addComment(
      issueId,
      [
        "**Failed** - test failed while not marked expected-fail.",
        `Status: \`${result.status}\``,
        `Error: \`${result.error?.message ?? "unknown"}\``,
      ].join("\n")
    );
  }

  onEnd(_result: FullResult): void {
    console.log("[Linear Reporter] Run complete");
  }
}

export default LinearReporter;
