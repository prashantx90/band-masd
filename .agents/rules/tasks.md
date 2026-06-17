---
trigger: always_on
description: Always ensure the Engineering Memory System (AI Development Journal) is maintained and task files are created or updated.
---

## tasks

This project uses an Engineering Memory System (AI Development Journal) to track tasks.

Rules:
- When working on a task, check `docs/tasks/` for the latest task file (e.g. `TASK-001.md`).
- If starting a new task, create a new task file `docs/tasks/TASK-XXX.md` using the template `docs/tasks/tasks-template.md`.
- Populate details including the problem statement, goal/objective, AI conversation summary, decisions made, open questions, and next steps.
- Note that a Git pre-commit hook automatically stages a new task file pre-populated with your changes if no task file is staged, or updates the staged task file's changed files list and updated date.
