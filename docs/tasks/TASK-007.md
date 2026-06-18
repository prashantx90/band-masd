# TASK-007: <Task Title>

## Metadata

| Field        | Value                                          |
| ------------ | ---------------------------------------------- |
| Task ID      | TASK-007 |
| Owner        |                                                |
| Team Member  |                                                |
| Date Started | 2026-06-18 |
| Last Updated | 2026-06-18 |
| Status       | Not Started / In Progress / Blocked / Complete |
| Priority     | High / Medium / Low                            |

---

# Problem Statement

Describe the problem being solved.

Example:

Agents currently have no shared message contract which causes communication inconsistency.

---

# Objective

What should be achieved?

Example:

Create a shared Band message schema that all agents can use.

---

# Context

Why is this needed?

How does it fit into the overall architecture?

---

# AI Session Summary

## Tools Used

- ChatGPT
- Claude
- Cursor
- Gemini

---

## Prompts Summary

Summarize prompts used.

Example:

- Asked for Band message contract design
- Asked for event schema examples
- Asked for orchestration patterns

---

## AI Recommendations

### Recommendation 1

...

### Recommendation 2

...

---

# Decisions Made

Document final decisions.

Example:

✓ Use JSON message format

✓ Use event-driven architecture

✓ Use shared schema package

---

# Technical Design

Describe implementation approach.

```mermaid
flowchart LR

PM --> Band
Band --> Architect
Architect --> Engineer
```

---

# Files Changed

<!-- FILES_CHANGED_START -->
- [.env](../../.env)
- [.gitignore](../../.gitignore)
- [apps/api/src/bootstrap/seeder.py](../../apps/api/src/bootstrap/seeder.py)
- [apps/web/.env](../../apps/web/.env)
- [docs/startup_troubleshooting.md](../../docs/startup_troubleshooting.md)
- [graphify-out/.graphify_labels.json](../../graphify-out/.graphify_labels.json)
- [graphify-out/GRAPH_REPORT.md](../../graphify-out/GRAPH_REPORT.md)
- [graphify-out/cache/ast/75847a69f2cdadc3e3de1cf0a8522564c2eded65d4325adaf6e6c18c3622eecf.json](../../graphify-out/cache/ast/75847a69f2cdadc3e3de1cf0a8522564c2eded65d4325adaf6e6c18c3622eecf.json)
- [graphify-out/cache/ast/c189fc4ab8f957379f3ac2da59e5a103e28e2d227b775f692df9d3e4e08be875.json](../../graphify-out/cache/ast/c189fc4ab8f957379f3ac2da59e5a103e28e2d227b775f692df9d3e4e08be875.json)
- [graphify-out/cache/ast/dc45e48e95b71529e83f48f96e7d121f6ed61e992d2e34becc22c91b6f1ed9f3.json](../../graphify-out/cache/ast/dc45e48e95b71529e83f48f96e7d121f6ed61e992d2e34becc22c91b6f1ed9f3.json)
- [graphify-out/graph.html](../../graphify-out/graph.html)
- [graphify-out/graph.json](../../graphify-out/graph.json)
- [graphify-out/manifest.json](../../graphify-out/manifest.json)
<!-- FILES_CHANGED_END -->

---

# Open Questions

Describe any unresolved questions or blockers.

---

# Next Steps

List the next tasks or steps.
