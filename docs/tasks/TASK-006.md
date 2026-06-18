# TASK-006: <Task Title>

## Metadata

| Field        | Value                                          |
| ------------ | ---------------------------------------------- |
| Task ID      | TASK-006 |
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
- [agents/architect_agent/agent.py](../../agents/architect_agent/agent.py)
- [agents/engineer_agent/agent.py](../../agents/engineer_agent/agent.py)
- [agents/qa_agent/agent.py](../../agents/qa_agent/agent.py)
- [agents/reviewer_agent/agent.py](../../agents/reviewer_agent/agent.py)
- [agents/security_agent/agent.py](../../agents/security_agent/agent.py)
- [docs/startup_troubleshooting.md](../../docs/startup_troubleshooting.md)
- [graphify-out/.graphify_labels.json](../../graphify-out/.graphify_labels.json)
- [graphify-out/GRAPH_REPORT.md](../../graphify-out/GRAPH_REPORT.md)
- [graphify-out/cache/ast/133e7939d82ca12e587b40b57bb0a33fcf3f5b3e9f9a45f98aa4f98095d41185.json](../../graphify-out/cache/ast/133e7939d82ca12e587b40b57bb0a33fcf3f5b3e9f9a45f98aa4f98095d41185.json)
- [graphify-out/cache/ast/1fe9698b4fa1eff10ac40486e5a4262c75eaa03291a0067b3a7f88ba22176cb6.json](../../graphify-out/cache/ast/1fe9698b4fa1eff10ac40486e5a4262c75eaa03291a0067b3a7f88ba22176cb6.json)
- [graphify-out/cache/ast/41956528e5953a37f357d62a4d77ac22349f240caac17f116f531b12cada825a.json](../../graphify-out/cache/ast/41956528e5953a37f357d62a4d77ac22349f240caac17f116f531b12cada825a.json)
- [graphify-out/cache/ast/b28739059d23396ac6b5420b9bb65d7f0c9de583f3bf01b738a6e1c3557a965a.json](../../graphify-out/cache/ast/b28739059d23396ac6b5420b9bb65d7f0c9de583f3bf01b738a6e1c3557a965a.json)
- [graphify-out/cache/ast/bc9ce03e4755c0c76d767c2b6d8343a170588f785044526788a54b3a6de7c8ac.json](../../graphify-out/cache/ast/bc9ce03e4755c0c76d767c2b6d8343a170588f785044526788a54b3a6de7c8ac.json)
- [graphify-out/cache/ast/ccc843d3a3e5cbce9182ba3a106cc5a6509b929f5daa35882954610c023a66a9.json](../../graphify-out/cache/ast/ccc843d3a3e5cbce9182ba3a106cc5a6509b929f5daa35882954610c023a66a9.json)
- [graphify-out/cache/ast/e699109260016b02ff59624c346edc1fe5dd600a561b4df2ca97175e8b144634.json](../../graphify-out/cache/ast/e699109260016b02ff59624c346edc1fe5dd600a561b4df2ca97175e8b144634.json)
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
