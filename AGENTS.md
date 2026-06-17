## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## tasks

This project uses an Engineering Memory System (AI Development Journal) to track tasks.

Rules:
- When working on a task, check `docs/tasks/` for the latest task file (e.g. `TASK-001.md`).
- If starting a new task, create a new task file `docs/tasks/TASK-XXX.md` using the template `docs/tasks/tasks-template.md`.
- Populate details including the problem statement, goal/objective, AI conversation summary, decisions made, open questions, and next steps.
- Note that a Git pre-commit hook automatically stages a new task file pre-populated with your changes if no task file is staged, or updates the staged task file's changed files list and updated date.
