# Graph Report - band-masd  (2026-06-17)

## Corpus Check
- 122 files · ~110,174 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 890 nodes · 1296 edges · 78 communities (70 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4ed5ded`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 224 edges
2. `dependencies` - 57 edges
3. `Form Mapping` - 13 edges
4. `useWorkflow()` - 11 edges
5. `Service Layer` - 11 edges
6. `buttonVariants` - 9 edges
7. `7. User Journey` - 9 edges
8. `Directus Collections` - 9 edges
9. `useProjects()` - 8 edges
10. `Team Structure` - 8 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `clsx`  [INFERRED]
  apps/web/src/app/components/ui/utils.ts → apps/web/package.json
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/accordion.tsx → apps/web/src/app/components/ui/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/accordion.tsx → apps/web/src/app/components/ui/utils.ts
- `AccordionContent()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/accordion.tsx → apps/web/src/app/components/ui/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/app/components/ui/alert-dialog.tsx → apps/web/src/app/components/ui/utils.ts

## Communities (78 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (30): Backend Lead & Band Integration Owner, CodeBand AI, Core Agent Developer, Day 1, Day 2, Day 3, Day 4, Day 5 (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (39): 10. Technical Architecture, 11. Success Metrics, 12. Future Roadmap, 13. Hackathon Judging Alignment, 1. Vision, 2. Problem Statement, 3. Product Overview, 4. Core Concept (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (57): dependencies, canvas-confetti, class-variance-authority, clsx, cmdk, date-fns, @directus/sdk, embla-carousel-react (+49 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (35): Input(), Separator(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (36): Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+28 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (40): agent_runs, agents, API Endpoints, code:yaml (projects), code:yaml (id), code:yaml (requirements), code:yaml (id), code:yaml (findings) (+32 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): AI Recommendations, AI Session Summary, code:mermaid (flowchart LR), Context, Decisions Made, Files Changed, Metadata, Next Steps (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (17): AI Recommendations, AI Session Summary, code:mermaid (flowchart LR), Context, Decisions Made, Files Changed, Metadata, Next Steps (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.07
Nodes (31): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+23 more)

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (13): App(), Page, PAGE_META, Header(), HeaderProps, navItems, Page, Sidebar() (+5 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (24): devDependencies, tailwindcss, @tailwindcss/vite, vite, @vitejs/plugin-react, vitest, name, vite (+16 more)

### Community 27 - "Community 27"
Cohesion: 0.14
Nodes (16): AgentDrawer(), AgentDrawerProps, AgentNode, AGENTS, statusConfig, WorkflowDiagram(), WorkflowDiagramProps, mapRunsToAgentNodes() (+8 more)

### Community 28 - "Community 28"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (14): Command(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut(), Dialog() (+6 more)

### Community 30 - "Community 30"
Cohesion: 0.1
Nodes (12): Artifacts, Band Messages, code:text (20 Projects), code:text (AI Engineering Team (Band Hackathon Demo)), code:text (40 workflows), code:text (20 projects), Create Workflows, Findings (+4 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (17): ActivityItem, ActivityPanel(), agentColors, typeConfig, useMessages(), useWorkflow(), AGENT_CONFIG, agentColor (+9 more)

### Community 32 - "Community 32"
Cohesion: 0.13
Nodes (24): useDashboard(), directus, DirectusSchema, getDashboardStats(), createMessage(), getMessages(), getArtifacts(), getFindings() (+16 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (17): AI Recommendations, AI Session Summary, code:mermaid (flowchart LR), Context, Decisions Made, Files Changed, Metadata, Next Steps (+9 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (18): Artifacts Section, code:text (/reports/:workflowId), code:text (reports), code:text (reports), code:text (summary), code:text (requirements), code:text (title), code:text (findings) (+10 more)

### Community 35 - "Community 35"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (17): Active Workflow Widget, code:text (CRM Platform v2), code:text (workflows), code:ts (getWorkflow(workflowId);), code:text (projects), code:ts (getProjects();), code:ts (readItems("projects");), code:text (name) (+9 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.2
Nodes (9): useProjects(), NewProjectPage(), NewProjectPageProps, WORKFLOW_STEPS, approvalBg, approvalLabel, ProjectsPage(), ProjectsPageProps (+1 more)

### Community 39 - "Community 39"
Cohesion: 0.13
Nodes (14): AI Session Summary, code:mermaid (flowchart TD), Context, Decisions Made, Files Changed, Metadata, Next Steps, Objective (+6 more)

### Community 40 - "Community 40"
Cohesion: 0.13
Nodes (15): code:text (/projects/new), code:text (Project Name), code:text (projects.name), code:text (Project Description), code:text (projects.description), code:text (Business Requirements), code:text (projects.business_requirements), code:text (Target Users) (+7 more)

### Community 41 - "Community 41"
Cohesion: 0.07
Nodes (18): Checkbox(), FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (10): Architecture, CodeBand AI, code:text (apps/web), code:text (apps/web/src), code:text (projects), Definition of Done, Directus Collections, Folder Structure (+2 more)

### Community 43 - "Community 43"
Cohesion: 0.33
Nodes (6): Agent Details Drawer, code:text (/workflows/:id), code:text (agent_runs), code:ts (getAgentRun(agentRunId);), code:json ({), Workflow Page

### Community 44 - "Community 44"
Cohesion: 0.31
Nodes (8): useReport(), ReportsPage(), ReportsPageProps, SECTIONS, createProject(), getProject(), getProjects(), Project

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 46 - "Community 46"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 47 - "Community 47"
Cohesion: 0.18
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (11): code:ts (dashboard.service.ts;), code:ts (getDashboardStats();), code:ts (project.service.ts;), code:ts (getProjects();), code:ts (workflow.service.ts;), code:ts (getWorkflow(id);), code:ts (message.service.ts;), code:ts (getMessages(workflowId);) (+3 more)

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 50 - "Community 50"
Cohesion: 0.2
Nodes (10): Band Activity Page, code:text (/activity), code:text (messages), code:ts (getMessages(workflowId);), code:ts (readItems("messages");), code:text (-created_at), code:text (title), code:text (PM Agent created requirements) (+2 more)

### Community 51 - "Community 51"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (6): archNode, engNode, mockAgentsList, mockRuns, nodes, pmNode

### Community 53 - "Community 53"
Cohesion: 0.33
Nodes (5): Button, Design system guidelines, General guidelines, Usage, Variants

### Community 54 - "Community 54"
Cohesion: 0.33
Nodes (6): Agent Console, code:text (/console), code:text (agent_runs), code:text (Execution Time), code:text (agent_runs), code:text (tokens_in)

### Community 55 - "Community 55"
Cohesion: 0.33
Nodes (6): code:text (/projects), code:text (projects), code:ts (getProjects();), code:text (status), code:text (name), Projects Page

### Community 56 - "Community 56"
Cohesion: 0.5
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 57 - "Community 57"
Cohesion: 0.29
Nodes (7): AuthContext, AuthContextValue, AuthUser, DirectusAuthProvider(), getCurrentUser(), loginWithDirectus(), logoutFromDirectus()

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (6): code:text (PM Agent), code:text (agent_runs), code:ts (getWorkflowRuns(workflowId);), code:ts (readItems("agent_runs");), code:text (status), Workflow Nodes

### Community 59 - "Community 59"
Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 74 - "Community 74"
Cohesion: 0.4
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 75 - "Community 75"
Cohesion: 0.4
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 77 - "Community 77"
Cohesion: 0.67
Nodes (3): code:text (POST /api/workflows/start), code:text (Create Workflow), Hackathon Workflow Simulator

## Knowledge Gaps
- **357 isolated node(s):** `PreToolUse`, `name`, `private`, `version`, `type` (+352 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 2`, `Community 3`, `Community 22`, `Community 28`, `Community 29`, `Community 35`, `Community 37`, `Community 41`, `Community 45`, `Community 46`, `Community 47`, `Community 49`, `Community 51`, `Community 56`, `Community 59`, `Community 61`, `Community 74`, `Community 75`, `Community 76`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 2` to `Community 26`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `clsx` connect `Community 2` to `Community 4`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `name`, `private` to the rest of the system?**
  _357 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._