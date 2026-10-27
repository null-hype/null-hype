# Null Hype ($H_0$)

> *This profile is not a portfolio of promises; it is a log of evidence.*

**I build verification infrastructure for agent-produced software.**

I treat agent behaviour as an experiment: capture the world, run the check, preserve the evidence, and put the finding back on the source it applies to.

```text
agent / CI → worlds → checks → findings → witness → editor
                                            ↑
                                   features installs
```

These are the system's boundaries: worlds preserves delivery evidence; checks produce findings; Witness presents findings that follow its input contract.

| Component | Role |
| --- | --- |
| [worlds](https://github.com/null-hype/worlds) | Plans, builds, and runs deliveries; freezes reproducible worlds and judges registered claims against exact snapshots. |
| [witness](https://github.com/null-hype/witness) | Presents durable, source-addressed findings in the editor, with evidence navigation and stale-source detection. |
| [features](https://github.com/null-hype/features) | Distributes Witness, its Neovim client, and a recorded example as a Dev Container feature. |

### Research / origin

[agent-plugins](https://github.com/null-hype/agent-plugins) is the research monorepo; stable boundaries graduate into smaller repos. Worlds, Witness, and Features emerged from that work.

The lab explores capability checks, scoped supervisor exceptions, and evidence reconciliation. Start with the [two-minute demo](https://github.com/null-hype/agent-plugins/blob/main/docs/launch/demo.md), the [claims and runnable checks](https://github.com/null-hype/agent-plugins/blob/main/docs/launch/claims-evidence.md), or the [interactive governance walkthrough](https://github.com/null-hype/null-hype.github.io).

*Research and prototype tools. Governance scenarios use synthetic fixtures and CI-exported runs; walkthrough progression is scripted, merge and budget calculations are computed, and approval is simulated.*

For collaboration or reproductions, open an issue on the relevant repository. For consulting or research enquiries: [public.rant@pm.me](mailto:public.rant@pm.me).
