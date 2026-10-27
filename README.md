# Null Hype ($H_0$)

> *This profile is not a portfolio of promises; it is a log of evidence.*

I build tools that connect automated changes to checks, findings, and evidence people can inspect.

My current work spans verification findings in the editor, reproducible delivery worlds, agent capability governance, and interactive lessons that make policy failures and supervisor decisions reviewable.

### Current work

- **[witness](https://github.com/null-hype/witness)** — A small Go language server that puts verification findings on the source they describe. Findings link to evidence, and source hashes flag results that have become stale. Includes a Neovim example and editor integration tests.
- **[worlds](https://github.com/null-hype/worlds)** — An agentic delivery harness that plans, builds, and runs a delivery, freezes its output as a reproducible world, and evaluates a registered claim against that exact snapshot. Extracted from `agent-plugins` with its history preserved.
- **[agent-plugins](https://github.com/null-hype/agent-plugins)** — Research into agent capability checks, scoped supervisor exceptions, and evidence reconciliation. Start with the [two-minute demo](https://github.com/null-hype/agent-plugins/blob/main/docs/launch/demo.md) or the [claims and runnable checks](https://github.com/null-hype/agent-plugins/blob/main/docs/launch/claims-evidence.md).
- **[Agent governance walkthrough](https://github.com/null-hype/null-hype.github.io)** — Interactive lessons exploring clean merges that violate a shared policy, diagnostic provenance, and repairs that preserve earlier verdicts.

### What I am exploring

How can a developer inspect what was verified, which source it applies to, and the evidence behind the result? How can a supervisor grant a scoped exception while preserving the original failure?

`witness` extracts the editor-facing piece into a small, verifier-independent tool. `worlds` captures delivery outputs and judges registered claims against frozen evidence. The governance work explores the checks and evidence that can feed that kind of interface.

*Research and prototype tools. The governance scenarios use synthetic fixtures and CI-exported runs; walkthrough progression is scripted, merge and budget calculations are computed, and the approval boundary is simulated.*

### Get in touch

For collaboration, reproductions, or technical questions, open an issue on the relevant repository. For consulting or research enquiries: [public.rant@pm.me](mailto:public.rant@pm.me).
