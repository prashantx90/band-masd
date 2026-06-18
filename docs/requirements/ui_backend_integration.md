# CodeBand AI

## Frontend → Directus Integration Blueprint

Version: 1.0

Purpose:

Convert all Figma-generated mock screens into a working application backed by Directus with minimal backend development.

---

# Architecture

```text
apps/web
      ↓
Domain Services
      ↓
Directus SDK
      ↓
Directus Collections
```

Frontend should NEVER query Directus directly from components.

All data access goes through service layer.

---

# Folder Structure

```text
apps/web/src

app/
components/
hooks/
services/
types/

services/
├── dashboard.service.ts
├── project.service.ts
├── workflow.service.ts
├── agent.service.ts
├── message.service.ts
├── report.service.ts

hooks/
├── useDashboard.ts
├── useProjects.ts
├── useWorkflow.ts
├── useMessages.ts
├── useReport.ts

types/
├── project.ts
├── workflow.ts
├── report.ts
├── agent.ts
```

---

# Directus Collections

```text
projects
workflows
agents
agent_runs
messages
requirements
findings
reports
artifacts
```

---

# Dashboard Page

Route

```text
/
```

Purpose

Executive overview of system.

---

## Statistics Cards

Mock Values

```text
Active Projects
Total Agent Runs
Tasks Completed
Approval Rate
```

Source Collections

```text
projects
agent_runs
reports
```

Implementation

```ts
getDashboardStats();
```

Returns

```ts
{
  activeProjects: number;
  totalAgentRuns: number;
  completedTasks: number;
  approvalRate: number;
}
```

Calculation

```text
Active Projects
= count(projects where status='running')

Total Agent Runs
= count(agent_runs)

Completed Tasks
= count(agent_runs where status='completed')

Approval Rate
= approved reports / total reports
```

DO NOT STORE THESE VALUES.

Always calculate.

---

## Active Workflow Widget

Mock

```text
CRM Platform v2
PM → Architect → Engineer → QA
```

Collections

```text
workflows
agent_runs
agents
```

API

```ts
getWorkflow(workflowId);
```

---

## Recent Projects Table

Collections

```text
projects
```

API

```ts
getProjects();
```

Directus Query

```ts
readItems("projects");
```

Fields

```text
name
status
approval_status
created_at
```

---

# New Project Page

Route

```text
/projects/new
```

Purpose

Create software project.

---

## Form Mapping

Field

```text
Project Name
```

Maps To

```text
projects.name
```

---

Field

```text
Project Description
```

Maps To

```text
projects.description
```

---

Field

```text
Business Requirements
```

Maps To

```text
projects.business_requirements
```

---

Field

```text
Target Users
```

Maps To

```text
projects.target_users
```

---

Field

```text
Technology Preferences
```

Maps To

```text
projects.technology_preferences
```

---

Generate Plan Button

Creates

```text
project
workflow
```

Workflow starts in

```text
pending
```

---

# Projects Page

Route

```text
/projects
```

Collections

```text
projects
```

API

```ts
getProjects();
```

Filters

```text
status
approval_status
```

Search

```text
name
description
```

---

# Workflow Page

Route

```text
/workflows/:id
```

Most Important Screen

---

## Workflow Nodes

Mock

```text
PM Agent
Architect Agent
Engineer Agent
QA Agent
Security Agent
Reviewer Agent
```

Source

```text
agent_runs
agents
```

API

```ts
getWorkflowRuns(workflowId);
```

Query

```ts
readItems("agent_runs");
```

Fields

```text
status
progress
started_at
completed_at
execution_time_ms
```

---

## Agent Details Drawer

Collections

```text
agent_runs
messages
artifacts
```

API

```ts
getAgentRun(agentRunId);
```

Returns

```json
{
  run,
  messages,
  artifacts
}
```

---

# Agent Console

Route

```text
/console
```

Purpose

Developer view.

Collections

```text
agent_runs
messages
```

Shows

```text
Execution Time
Token Usage
Status
Input
Output
Logs
```

Source

```text
agent_runs
```

Fields

```text
tokens_in
tokens_out
execution_time_ms
input_context
output_summary
```

---

# Band Activity Page

Route

```text
/activity
```

Purpose

Display agent communication.

Collections

```text
messages
```

API

```ts
getMessages(workflowId);
```

Query

```ts
readItems("messages");
```

Sort

```text
-created_at
```

Fields

```text
title
content
severity
created_at
```

---

## Timeline Example

```text
PM Agent created requirements

Architect Agent generated architecture

Engineer Agent created implementation plan

QA Agent reported issues

Reviewer Agent approved workflow
```

All records come from

```text
messages
```

---

# Reports Page

Route

```text
/reports/:workflowId
```

Collections

```text
reports
requirements
findings
artifacts
```

---

## Executive Summary

Collection

```text
reports
```

Fields

```text
summary
approval_decision
```

---

## Requirements Section

Collection

```text
requirements
```

Fields

```text
title
description
priority
status
```

---

## QA Findings

Collection

```text
findings
```

Filter

```text
type='qa'
```

---

## Security Findings

Collection

```text
findings
```

Filter

```text
type='security'
```

---

## Artifacts Section

Collection

```text
artifacts
```

Artifact Types

```text
PRD
Architecture
Implementation
QA Report
Security Report
Approval Report
```

---

# Service Layer

Dashboard

```ts
dashboard.service.ts;
```

Functions

```ts
getDashboardStats();
```

---

Projects

```ts
project.service.ts;
```

Functions

```ts
getProjects();
getProject(id);
createProject();
```

---

Workflows

```ts
workflow.service.ts;
```

Functions

```ts
getWorkflow(id);
getWorkflowRuns(id);
startWorkflow(id);
```

---

Messages

```ts
message.service.ts;
```

Functions

```ts
getMessages(workflowId);
createMessage();
```

---

Reports

```ts
report.service.ts;
```

Functions

```ts
getReport(workflowId);
```

---

# Hackathon Workflow Simulator

Do NOT build real agents first.

Create endpoint

```text
POST /api/workflows/start
```

Logic

```text
Create Workflow

Create PM Agent Run

Create Message

Wait 2 seconds

Create Architect Agent Run

Create Message

Wait 2 seconds

Create Engineer Agent Run

Create Message

Wait 2 seconds

Create QA Agent Run

Create Message

Wait 2 seconds

Create Security Agent Run

Create Message

Wait 2 seconds

Create Reviewer Agent Run

Create Report
```

This will make all pages appear live.

---

# Priority Order

Day 1

1. Directus Collections
2. Dashboard
3. Projects
4. New Project

Day 1 Afternoon

5. Workflow Page
6. Agent Drawer
7. Activity Timeline

Day 1 Evening

8. Reports Page
9. Workflow Simulator

Stretch

10. Real LLM Integration
11. Band Integration
12. Real Agent Execution

---

# Definition of Done

The application is demo-ready when:

✓ New Project creates project

✓ Workflow page displays agent progression

✓ Activity page displays messages

✓ Reports page displays generated report

✓ Dashboard statistics update automatically

✓ No hardcoded arrays remain in UI

✓ All screens load from Directus

✓ Workflow simulator generates realistic data

At that point the mock application becomes a fully functioning hackathon demo backed by Directus.
