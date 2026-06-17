# TASK-001: <Task Title>

## Metadata

| Field        | Value                                          |
| ------------ | ---------------------------------------------- |
| Task ID      | TASK-001 |
| Owner        |                                                |
| Team Member  |                                                |
| Date Started | 2026-06-17 |
| Last Updated | 2026-06-17 |
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
- [.agents/rules/graphify.md](../../.agents/rules/graphify.md)
- [.agents/rules/tasks.md](../../.agents/rules/tasks.md)
- [.agents/workflows/graphify.md](../../.agents/workflows/graphify.md)
- [.claudeprompt](../../.claudeprompt)
- [.codex/hooks.json](../../.codex/hooks.json)
- [.codexrules](../../.codexrules)
- [.copilotinstructions](../../.copilotinstructions)
- [.cursor/rules/graphify.mdc](../../.cursor/rules/graphify.mdc)
- [.cursor/rules/tasks.mdc](../../.cursor/rules/tasks.mdc)
- [.cursorrules](../../.cursorrules)
- [.gitignore](../../.gitignore)
- [.windsurfrules](../../.windsurfrules)
- [AGENTS.md](../../AGENTS.md)
- [apps/directus/datamodel/samples/002_stocker_import_collections.sql](../../apps/directus/datamodel/samples/002_stocker_import_collections.sql)
- [apps/directus/datamodel/samples/create_raw_ingestion_registry.sql](../../apps/directus/datamodel/samples/create_raw_ingestion_registry.sql)
- [apps/directus/datamodel/samples/stocker_data_model_update.sql](../../apps/directus/datamodel/samples/stocker_data_model_update.sql)
- [apps/web/ATTRIBUTIONS.md](../../apps/web/ATTRIBUTIONS.md)
- [apps/web/README.md](../../apps/web/README.md)
- [apps/web/default_shadcn_theme.css](../../apps/web/default_shadcn_theme.css)
- [apps/web/guidelines/Guidelines.md](../../apps/web/guidelines/Guidelines.md)
- [apps/web/index.html](../../apps/web/index.html)
- [apps/web/package-lock.json](../../apps/web/package-lock.json)
- [apps/web/package.json](../../apps/web/package.json)
- [apps/web/pnpm-workspace.yaml](../../apps/web/pnpm-workspace.yaml)
- [apps/web/postcss.config.mjs](../../apps/web/postcss.config.mjs)
- [apps/web/src/app/App.tsx](../../apps/web/src/app/App.tsx)
- [apps/web/src/app/components/ActivityPanel.tsx](../../apps/web/src/app/components/ActivityPanel.tsx)
- [apps/web/src/app/components/AgentDrawer.tsx](../../apps/web/src/app/components/AgentDrawer.tsx)
- [apps/web/src/app/components/Header.tsx](../../apps/web/src/app/components/Header.tsx)
- [apps/web/src/app/components/Sidebar.tsx](../../apps/web/src/app/components/Sidebar.tsx)
- [apps/web/src/app/components/WorkflowDiagram.tsx](../../apps/web/src/app/components/WorkflowDiagram.tsx)
- [apps/web/src/app/components/figma/ImageWithFallback.tsx](../../apps/web/src/app/components/figma/ImageWithFallback.tsx)
- [apps/web/src/app/components/pages/AgentConsolePage.tsx](../../apps/web/src/app/components/pages/AgentConsolePage.tsx)
- [apps/web/src/app/components/pages/AgentWorkflowPage.tsx](../../apps/web/src/app/components/pages/AgentWorkflowPage.tsx)
- [apps/web/src/app/components/pages/BandActivityPage.tsx](../../apps/web/src/app/components/pages/BandActivityPage.tsx)
- [apps/web/src/app/components/pages/DashboardPage.tsx](../../apps/web/src/app/components/pages/DashboardPage.tsx)
- [apps/web/src/app/components/pages/NewProjectPage.tsx](../../apps/web/src/app/components/pages/NewProjectPage.tsx)
- [apps/web/src/app/components/pages/ProjectsPage.tsx](../../apps/web/src/app/components/pages/ProjectsPage.tsx)
- [apps/web/src/app/components/pages/ReportsPage.tsx](../../apps/web/src/app/components/pages/ReportsPage.tsx)
- [apps/web/src/app/components/pages/SettingsPage.tsx](../../apps/web/src/app/components/pages/SettingsPage.tsx)
- [apps/web/src/app/components/ui/accordion.tsx](../../apps/web/src/app/components/ui/accordion.tsx)
- [apps/web/src/app/components/ui/alert-dialog.tsx](../../apps/web/src/app/components/ui/alert-dialog.tsx)
- [apps/web/src/app/components/ui/alert.tsx](../../apps/web/src/app/components/ui/alert.tsx)
- [apps/web/src/app/components/ui/aspect-ratio.tsx](../../apps/web/src/app/components/ui/aspect-ratio.tsx)
- [apps/web/src/app/components/ui/avatar.tsx](../../apps/web/src/app/components/ui/avatar.tsx)
- [apps/web/src/app/components/ui/badge.tsx](../../apps/web/src/app/components/ui/badge.tsx)
- [apps/web/src/app/components/ui/breadcrumb.tsx](../../apps/web/src/app/components/ui/breadcrumb.tsx)
- [apps/web/src/app/components/ui/button.tsx](../../apps/web/src/app/components/ui/button.tsx)
- [apps/web/src/app/components/ui/calendar.tsx](../../apps/web/src/app/components/ui/calendar.tsx)
- [apps/web/src/app/components/ui/card.tsx](../../apps/web/src/app/components/ui/card.tsx)
- [apps/web/src/app/components/ui/carousel.tsx](../../apps/web/src/app/components/ui/carousel.tsx)
- [apps/web/src/app/components/ui/chart.tsx](../../apps/web/src/app/components/ui/chart.tsx)
- [apps/web/src/app/components/ui/checkbox.tsx](../../apps/web/src/app/components/ui/checkbox.tsx)
- [apps/web/src/app/components/ui/collapsible.tsx](../../apps/web/src/app/components/ui/collapsible.tsx)
- [apps/web/src/app/components/ui/command.tsx](../../apps/web/src/app/components/ui/command.tsx)
- [apps/web/src/app/components/ui/context-menu.tsx](../../apps/web/src/app/components/ui/context-menu.tsx)
- [apps/web/src/app/components/ui/dialog.tsx](../../apps/web/src/app/components/ui/dialog.tsx)
- [apps/web/src/app/components/ui/drawer.tsx](../../apps/web/src/app/components/ui/drawer.tsx)
- [apps/web/src/app/components/ui/dropdown-menu.tsx](../../apps/web/src/app/components/ui/dropdown-menu.tsx)
- [apps/web/src/app/components/ui/form.tsx](../../apps/web/src/app/components/ui/form.tsx)
- [apps/web/src/app/components/ui/hover-card.tsx](../../apps/web/src/app/components/ui/hover-card.tsx)
- [apps/web/src/app/components/ui/input-otp.tsx](../../apps/web/src/app/components/ui/input-otp.tsx)
- [apps/web/src/app/components/ui/input.tsx](../../apps/web/src/app/components/ui/input.tsx)
- [apps/web/src/app/components/ui/label.tsx](../../apps/web/src/app/components/ui/label.tsx)
- [apps/web/src/app/components/ui/menubar.tsx](../../apps/web/src/app/components/ui/menubar.tsx)
- [apps/web/src/app/components/ui/navigation-menu.tsx](../../apps/web/src/app/components/ui/navigation-menu.tsx)
- [apps/web/src/app/components/ui/pagination.tsx](../../apps/web/src/app/components/ui/pagination.tsx)
- [apps/web/src/app/components/ui/popover.tsx](../../apps/web/src/app/components/ui/popover.tsx)
- [apps/web/src/app/components/ui/progress.tsx](../../apps/web/src/app/components/ui/progress.tsx)
- [apps/web/src/app/components/ui/radio-group.tsx](../../apps/web/src/app/components/ui/radio-group.tsx)
- [apps/web/src/app/components/ui/resizable.tsx](../../apps/web/src/app/components/ui/resizable.tsx)
- [apps/web/src/app/components/ui/scroll-area.tsx](../../apps/web/src/app/components/ui/scroll-area.tsx)
- [apps/web/src/app/components/ui/select.tsx](../../apps/web/src/app/components/ui/select.tsx)
- [apps/web/src/app/components/ui/separator.tsx](../../apps/web/src/app/components/ui/separator.tsx)
- [apps/web/src/app/components/ui/sheet.tsx](../../apps/web/src/app/components/ui/sheet.tsx)
- [apps/web/src/app/components/ui/sidebar.tsx](../../apps/web/src/app/components/ui/sidebar.tsx)
- [apps/web/src/app/components/ui/skeleton.tsx](../../apps/web/src/app/components/ui/skeleton.tsx)
- [apps/web/src/app/components/ui/slider.tsx](../../apps/web/src/app/components/ui/slider.tsx)
- [apps/web/src/app/components/ui/sonner.tsx](../../apps/web/src/app/components/ui/sonner.tsx)
- [apps/web/src/app/components/ui/switch.tsx](../../apps/web/src/app/components/ui/switch.tsx)
- [apps/web/src/app/components/ui/table.tsx](../../apps/web/src/app/components/ui/table.tsx)
- [apps/web/src/app/components/ui/tabs.tsx](../../apps/web/src/app/components/ui/tabs.tsx)
- [apps/web/src/app/components/ui/textarea.tsx](../../apps/web/src/app/components/ui/textarea.tsx)
- [apps/web/src/app/components/ui/toggle-group.tsx](../../apps/web/src/app/components/ui/toggle-group.tsx)
- [apps/web/src/app/components/ui/toggle.tsx](../../apps/web/src/app/components/ui/toggle.tsx)
- [apps/web/src/app/components/ui/tooltip.tsx](../../apps/web/src/app/components/ui/tooltip.tsx)
- [apps/web/src/app/components/ui/use-mobile.ts](../../apps/web/src/app/components/ui/use-mobile.ts)
- [apps/web/src/app/components/ui/utils.ts](../../apps/web/src/app/components/ui/utils.ts)
- [apps/web/src/main.tsx](../../apps/web/src/main.tsx)
- [apps/web/src/styles/fonts.css](../../apps/web/src/styles/fonts.css)
- [apps/web/src/styles/globals.css](../../apps/web/src/styles/globals.css)
- [apps/web/src/styles/index.css](../../apps/web/src/styles/index.css)
- [apps/web/src/styles/tailwind.css](../../apps/web/src/styles/tailwind.css)
- [apps/web/src/styles/theme.css](../../apps/web/src/styles/theme.css)
- [apps/web/vite.config.ts](../../apps/web/vite.config.ts)
- [docs/requirements/directus_collection.md](../../docs/requirements/directus_collection.md)
- [docs/requirements/directus_collection.sql](../../docs/requirements/directus_collection.sql)
- [docs/requirements/seed_data.md](../../docs/requirements/seed_data.md)
- [graphify-out/.graphify_labels.json](../../graphify-out/.graphify_labels.json)
- [graphify-out/.graphify_root](../../graphify-out/.graphify_root)
- [graphify-out/GRAPH_REPORT.md](../../graphify-out/GRAPH_REPORT.md)
- [graphify-out/cache/ast/02a10022db4416c89203d0bb199d5b2f48da01fb2962bb28adff3ca65ba10260.json](../../graphify-out/cache/ast/02a10022db4416c89203d0bb199d5b2f48da01fb2962bb28adff3ca65ba10260.json)
- [graphify-out/cache/ast/0b4a7035d0655e1cb29b7c7ab3b279e843114b2ced5ff3af9a6f11215d14c826.json](../../graphify-out/cache/ast/0b4a7035d0655e1cb29b7c7ab3b279e843114b2ced5ff3af9a6f11215d14c826.json)
- [graphify-out/cache/ast/16bc91c1128ff24593044affe00b65dd98b1a031922fe22f95e4ed3860f98f9c.json](../../graphify-out/cache/ast/16bc91c1128ff24593044affe00b65dd98b1a031922fe22f95e4ed3860f98f9c.json)
- [graphify-out/cache/ast/227628ada2d1fede40d18079b5c08f04f67aeb1dcc0fe75d23868b9e679dfe22.json](../../graphify-out/cache/ast/227628ada2d1fede40d18079b5c08f04f67aeb1dcc0fe75d23868b9e679dfe22.json)
- [graphify-out/cache/ast/501267a2e2bad31d6b413c65916af6041257063bf6818c752c7d09e83241b16c.json](../../graphify-out/cache/ast/501267a2e2bad31d6b413c65916af6041257063bf6818c752c7d09e83241b16c.json)
- [graphify-out/cache/ast/5a58f846ed850fa07258c95a5c8e4bc19f2d32f3280d2ee6bd8c9b2b59598934.json](../../graphify-out/cache/ast/5a58f846ed850fa07258c95a5c8e4bc19f2d32f3280d2ee6bd8c9b2b59598934.json)
- [graphify-out/cache/ast/6bc9772f61731a9b27a923a9a6e1e02c492f1951dbdb9d2baa621c67bbd3594f.json](../../graphify-out/cache/ast/6bc9772f61731a9b27a923a9a6e1e02c492f1951dbdb9d2baa621c67bbd3594f.json)
- [graphify-out/cache/ast/76b231c99787d35ae28c53dc49c6c32176f5ed70c7c6c4f20269f54c88e1c140.json](../../graphify-out/cache/ast/76b231c99787d35ae28c53dc49c6c32176f5ed70c7c6c4f20269f54c88e1c140.json)
- [graphify-out/cache/ast/76c5062f4e58eeec09d28072c0ed3721895e12dac46c666c26f61eb8ccac352b.json](../../graphify-out/cache/ast/76c5062f4e58eeec09d28072c0ed3721895e12dac46c666c26f61eb8ccac352b.json)
- [graphify-out/cache/ast/7eae974f406672bb4d48e301bb962280e2e886a1e7f9d3291af19d4b29b19022.json](../../graphify-out/cache/ast/7eae974f406672bb4d48e301bb962280e2e886a1e7f9d3291af19d4b29b19022.json)
- [graphify-out/cache/ast/8f4a8c280c31e1410a258eda393dd1813d082c4f5e3bedcfe7f97d0fd8f40f1d.json](../../graphify-out/cache/ast/8f4a8c280c31e1410a258eda393dd1813d082c4f5e3bedcfe7f97d0fd8f40f1d.json)
- [graphify-out/cache/ast/a38e0f7960d67df48e91d6bbbbf7f646d6ab88c45ece651e65ad8741bbc88841.json](../../graphify-out/cache/ast/a38e0f7960d67df48e91d6bbbbf7f646d6ab88c45ece651e65ad8741bbc88841.json)
- [graphify-out/cache/ast/a54e85026f379f23b4a4c37f491b33db150164f94a7a04722f1eee6cadeeee10.json](../../graphify-out/cache/ast/a54e85026f379f23b4a4c37f491b33db150164f94a7a04722f1eee6cadeeee10.json)
- [graphify-out/cache/ast/af9238b73645895a620eb0799ec66f71720e9a1f4e6b37815a8dcaa1cfc91931.json](../../graphify-out/cache/ast/af9238b73645895a620eb0799ec66f71720e9a1f4e6b37815a8dcaa1cfc91931.json)
- [graphify-out/cache/ast/b5169f51d76c5fbc322db1f6de36ef49f5b21e795c4c4ec77dc8b8c8ffb9d867.json](../../graphify-out/cache/ast/b5169f51d76c5fbc322db1f6de36ef49f5b21e795c4c4ec77dc8b8c8ffb9d867.json)
- [graphify-out/cache/ast/b78c5dc976f7264bf97a8949592ce2526af30b5da2216dd3cfdfb806a0f77626.json](../../graphify-out/cache/ast/b78c5dc976f7264bf97a8949592ce2526af30b5da2216dd3cfdfb806a0f77626.json)
- [graphify-out/cache/ast/c03f45138d5b8c2e24943a69a53051f88141ed0dc313e5c0c5a6f93f735ea7aa.json](../../graphify-out/cache/ast/c03f45138d5b8c2e24943a69a53051f88141ed0dc313e5c0c5a6f93f735ea7aa.json)
- [graphify-out/cache/ast/ca33c7602e730e36c2a51f165aa0ceb6491b4a37a5132991e111cc2b1d6d9a0a.json](../../graphify-out/cache/ast/ca33c7602e730e36c2a51f165aa0ceb6491b4a37a5132991e111cc2b1d6d9a0a.json)
- [graphify-out/cache/ast/da57cf34efdec417e86e41fbbcc003efc293da263f6d2edf277f72f2429bd7d4.json](../../graphify-out/cache/ast/da57cf34efdec417e86e41fbbcc003efc293da263f6d2edf277f72f2429bd7d4.json)
- [graphify-out/cache/ast/e1cfac056dfec857917ee2f13f4aac626d510d4050beb88279853f353168c9ad.json](../../graphify-out/cache/ast/e1cfac056dfec857917ee2f13f4aac626d510d4050beb88279853f353168c9ad.json)
- [graphify-out/cache/ast/f9ff791c6c95d9dace67f1dd389321f368be5e4f837d02d9b75cda2c9be5dd94.json](../../graphify-out/cache/ast/f9ff791c6c95d9dace67f1dd389321f368be5e4f837d02d9b75cda2c9be5dd94.json)
- [graphify-out/graph.html](../../graphify-out/graph.html)
- [graphify-out/graph.json](../../graphify-out/graph.json)
- [graphify-out/manifest.json](../../graphify-out/manifest.json)
- [scripts/manage_tasks.py](../../scripts/manage_tasks.py)
<!-- FILES_CHANGED_END -->

---

# Open Questions

Describe any unresolved questions or blockers.

---

# Next Steps

List the next tasks or steps.
