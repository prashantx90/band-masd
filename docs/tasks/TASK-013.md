# TASK-013: Fix Directus package.json Syntax Error

## Metadata

| Field        | Value                                          |
| ------------ | ---------------------------------------------- |
| Task ID      | TASK-013 |
| Owner        | Antigravity                                    |
| Team Member  | Prashant                                       |
| Date Started | 2026-07-11                                     |
| Last Updated | 2026-07-11 |
| Status       | Complete                                       |
| Priority     | High                                           |

---

# Problem Statement

When starting/installing packages in `apps/directus`, npm throws a JSON parse error:
```
npm error code EJSONPARSE
npm error JSON.parse Invalid package.json: JSONParseError: Expected ',' or '}' after property value in JSON at position 145 (line 7 column 5)
```

---

# Objective

Fix the missing comma in the `scripts` object of `apps/directus/package.json` to allow Directus dependencies to install and start correctly.

---

# Context

This issue blocks running `npm install` and starting the Directus service locally when not using mock mode.

---

# AI Session Summary

## Tools Used

- Gemini (Antigravity)

---

## Prompts Summary

- Reported Directus package.json parsing error in the npm log output.

---

## AI Recommendations

### Recommendation 1

Add the missing comma in `apps/directus/package.json` after the `"test"` script command.

---

# Decisions Made

✓ Add missing comma on line 6 of `apps/directus/package.json`.

---

# Technical Design

Correct script JSON format:
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "directus start",
    "snapshot": "directus schema snapshot ./snapshot/schema.yaml",
    "apply": "directus schema apply ./snapshot/schema.yaml --yes"
  }
```

---

# Files Changed

<!-- FILES_CHANGED_START -->
- [apps/directus/package.json](../../apps/directus/package.json)
- [graphify-out/.graphify_labels.json](../../graphify-out/.graphify_labels.json)
- [graphify-out/GRAPH_REPORT.md](../../graphify-out/GRAPH_REPORT.md)
- [graphify-out/cache/ast/705ebe20298ec8bb72a8b5c0ab9087deea6bc719feb57d9c5f21c98b19b66401.json](../../graphify-out/cache/ast/705ebe20298ec8bb72a8b5c0ab9087deea6bc719feb57d9c5f21c98b19b66401.json)
- [graphify-out/cache/ast/b5c73aab23aec23ebac7fa4e72e8f88a3c9154f2a3ecdef949aa55ae4ded549d.json](../../graphify-out/cache/ast/b5c73aab23aec23ebac7fa4e72e8f88a3c9154f2a3ecdef949aa55ae4ded549d.json)
- [graphify-out/cache/ast/cfa2682502c530ee86db255e1fe13d14e85345f6cc05cbe8b9126702c4f6ca86.json](../../graphify-out/cache/ast/cfa2682502c530ee86db255e1fe13d14e85345f6cc05cbe8b9126702c4f6ca86.json)
- [graphify-out/graph.html](../../graphify-out/graph.html)
- [graphify-out/graph.json](../../graphify-out/graph.json)
- [graphify-out/manifest.json](../../graphify-out/manifest.json)
<!-- FILES_CHANGED_END -->

---

# Open Questions

- None

---

# Next Steps

1. Verify package.json syntax is valid.
2. Run `graphify update .` to update the codebase graph with the new changes.
