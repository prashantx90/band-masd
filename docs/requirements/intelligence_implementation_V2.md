# CodeBand AI

## Final Architecture & Implementation Blueprint

### Band Hackathon Submission Architecture (Final Version)

Version: 3.0

Status: Implementation Ready

---

# Executive Summary

CodeBand AI is a multi-agent software development platform that transforms a software idea into a complete implementation plan using specialized AI agents collaborating through Band.

The platform demonstrates:

- Multi-Agent Collaboration
- Agent Communication Through Band
- Structured AI Outputs
- Workflow Orchestration
- Real-Time Observability
- Human Review Workflow
- Enterprise Architecture Planning
- Software Delivery Planning

This architecture intentionally separates concerns:

| Layer            | Responsibility        |
| ---------------- | --------------------- |
| Next.js          | User Experience       |
| Directus         | Persistence           |
| Band             | Communication         |
| LangGraph        | Agent State & Routing |
| Prefect          | Workflow Execution    |
| PydanticAI       | Agent Intelligence    |
| Ollama           | LLM Runtime           |
| Custom Framework | Business Logic        |

---

# Final Technology Stack

## Frontend

```text
Next.js 15
TypeScript
Tailwind CSS
shadcn/ui
React Flow
TanStack Query
```

Purpose:

- Dashboard
- Workflow Visualization
- Activity Timeline
- Reports
- Project Management

---

## Backend

```text
FastAPI
Python 3.12
```

Purpose:

- Agent APIs
- Workflow APIs
- Directus Integration
- Band Integration

---

## Workflow Execution

```text
Prefect
```

Purpose:

- Scheduling
- Retries
- Monitoring
- Flow Execution
- Execution History

---

## Workflow State Engine

```text
LangGraph
```

Purpose:

- Agent Routing
- Shared State
- Conditional Logic
- Parallel Execution
- Human-in-the-Loop

---

## Agent Intelligence

```text
PydanticAI
```

Purpose:

- Structured Outputs
- Validation
- Type Safety
- Tool Calling

---

## Communication Layer

```text
Band
```

Purpose:

- Agent Collaboration
- Event Routing
- Shared Context
- Communication Bus

---

## Persistence

```text
Directus
PostgreSQL
```

Purpose:

- Workflow Storage
- Agent Runs
- Messages
- Artifacts
- Reports

---

## LLM Runtime

```text
Ollama

Primary:
Qwen3:8B

Alternative:
Gemma3:12B
```

Purpose:

- Local AI Execution
- Zero API Cost

---

# Final System Architecture

```text

                    User

                      │

                      ▼

                Next.js UI

                      │

                      ▼

                  FastAPI

                      │

                      ▼

                Prefect Flow

                      │

                      ▼

                  LangGraph

                      │

                      ▼

                Workflow State

                      │

      ┌───────────────┼───────────────┐

      ▼               ▼               ▼

 PM Agent      Architect Agent    Engineer Agent

      ▼               ▼               ▼

 QA Agent      Security Agent     Reviewer Agent

                      │

                      ▼

                    Band

                      │

                      ▼

                 Directus

                      │

                      ▼

                PostgreSQL

```

---

# Core Design Principle

## Prefect Owns

```text
Execution
Scheduling
Retries
Monitoring
```

---

## LangGraph Owns

```text
State
Routing
Graph Logic
Conditional Branches
Parallel Execution
```

---

## PydanticAI Owns

```text
Agent Intelligence
Structured Outputs
Validation
```

---

## Band Owns

```text
Communication
Shared Context
Events
Messages
```

---

## Directus Owns

```text
Persistence
History
Reports
Artifacts
Audit Trail
```

---

# Monorepo Structure

```text

band-masd/

├── apps/
│
│   ├── web/
│   │
│   ├── api/
│   │
│   └── directus/
│
├── agents/
│
│   ├── pm_agent/
│   │
│   ├── architect_agent/
│   │
│   ├── engineer_agent/
│   │
│   ├── qa_agent/
│   │
│   ├── security_agent/
│   │
│   └── reviewer_agent/
│
├── workflows/
│
│   ├── graphs/
│   ├── state/
│   └── flows/
│
├── packages/
│
│   ├── band_adapter/
│   ├── directus_client/
│   ├── shared_types/
│   └── workflow_sdk/
│
├── docs/
│
└── tasks/

```

---

# Workflow Lifecycle

## Step 1

User Creates Project

Input:

```json
{
  "name": "Expense Tracker",
  "description": "Build SaaS expense tracking system"
}
```

Stored In:

```text
projects
```

---

## Step 2

Workflow Created

Stored In:

```text
workflows
```

Status:

```text
pending
```

---

## Step 3

Workflow Started

Prefect launches flow.

```python
software_delivery_flow()
```

---

## Step 4

LangGraph Creates State

```python
WorkflowState
```

---

# Workflow State Model

```python
class WorkflowState(TypedDict):

    project_id: str

    workflow_id: str

    project_context: dict

    requirements: list

    architecture: dict

    implementation_plan: dict

    qa_findings: list

    security_findings: list

    approval_report: dict

    artifacts: list

    messages: list
```

---

# Agent Graph

```text

PM Agent

     │

     ▼

Architect Agent

     │

     ▼

 ┌─────────────┬─────────────┐

 ▼             ▼             ▼

Engineer      QA       Security

 └─────────────┴─────────────┘

               │

               ▼

         Reviewer Agent

```

---

# PM Agent

Purpose:

Requirements Discovery

Input:

```json
{
  "project_name": "...",
  "description": "..."
}
```

Output:

```python
class PMOutput(BaseModel):

    requirements: list

    assumptions: list

    acceptance_criteria: list
```

Stores:

```text
requirements
```

Publishes:

```python
requirements.generated
```

---

# Architect Agent

Purpose:

Architecture Design

Input:

```python
requirements
```

Output:

```python
class ArchitectureOutput(BaseModel):

    services: list

    database: str

    deployment: str

    integrations: list
```

Stores:

```text
artifacts
```

Publishes:

```python
architecture.generated
```

---

# Engineer Agent

Purpose:

Implementation Planning

Input:

```python
architecture
```

Output:

```python
class ImplementationOutput(BaseModel):

    modules: list

    milestones: list

    repositories: list

    stories: list
```

Stores:

```text
artifacts
```

Publishes:

```python
implementation.generated
```

---

# QA Agent

Purpose:

Quality Review

Input:

```python
implementation
```

Output:

```python
class QAOutput(BaseModel):

    findings: list
```

Stores:

```text
findings
```

Publishes:

```python
qa.completed
```

---

# Security Agent

Purpose:

Security Review

Input:

```python
implementation
```

Output:

```python
class SecurityOutput(BaseModel):

    vulnerabilities: list
```

Stores:

```text
findings
```

Publishes:

```python
security.completed
```

---

# Reviewer Agent

Purpose:

Final Approval

Input:

```python
qa_findings
security_findings
```

Output:

```python
class ReviewOutput(BaseModel):

    decision: str

    summary: str

    recommendations: list
```

Stores:

```text
reports
```

Publishes:

```python
workflow.completed
```

---

# LangGraph Design

## Graph Definition

```python
builder = StateGraph(WorkflowState)

builder.add_node("pm", pm_node)

builder.add_node("architect", architect_node)

builder.add_node("engineer", engineer_node)

builder.add_node("qa", qa_node)

builder.add_node("security", security_node)

builder.add_node("reviewer", reviewer_node)
```

---

## Graph Flow

```text

START

 ↓

PM

 ↓

ARCHITECT

 ↓

 ┌────────────┬────────────┐

 ▼            ▼            ▼

ENGINEER     QA      SECURITY

 └────────────┴────────────┘

             ▼

        REVIEWER

             ▼

            END

```

---

# Band Integration

Band acts as communication bus.

## Publish

```python
band.publish(
    event_name,
    payload
)
```

---

## Subscribe

```python
band.subscribe(
    event_name,
    callback
)
```

---

## Events

```text
project.created

requirements.generated

architecture.generated

implementation.generated

qa.completed

security.completed

workflow.completed
```

---

# Directus Mapping

## projects

Created By:

```text
UI
```

---

## workflows

Created By:

```text
Workflow Manager
```

---

## agent_runs

Created By:

```text
Workflow Execution Layer
```

Status:

```text
pending
running
completed
failed
```

---

## messages

Created By:

```text
Band
```

Every publish action creates:

```text
Message Record
```

---

## requirements

Created By:

```text
PM Agent
```

---

## findings

Created By:

```text
QA Agent
Security Agent
```

---

## reports

Created By:

```text
Reviewer Agent
```

---

## artifacts

Created By:

```text
Architect Agent
Engineer Agent
```

---

# Prefect Flow

```python
@flow(
    retries=3,
    timeout_seconds=3600
)
def software_delivery_flow(
    project_id
):

    graph.invoke(
        initial_state
    )
```

---

# Dashboard Data Sources

## Dashboard Statistics

Derived From:

```text
projects
agent_runs
reports
```

---

## Workflow Visualization

Derived From:

```text
agent_runs
```

---

## Activity Timeline

Derived From:

```text
messages
```

---

## Reports

Derived From:

```text
reports
requirements
findings
artifacts
```

---

# PydanticAI Integration Pattern

Every agent follows:

```python
Agent
    ↓
Prompt
    ↓
LLM
    ↓
Pydantic Validation
    ↓
Structured Result
    ↓
Directus
```

Example:

```python
result = architect_agent.run_sync(
    prompt
)

architecture = result.data
```

No JSON parsing.

No regex.

No fragile output handling.

---

# Hackathon Implementation Order

## Phase 1

Infrastructure

```text
Directus
FastAPI
Next.js
Shared Types
```

---

## Phase 2

Workflow Engine

```text
LangGraph
Workflow State
Prefect
```

---

## Phase 3

Agents

```text
PM
Architect
Engineer
```

---

## Phase 4

Review Agents

```text
QA
Security
Reviewer
```

---

## Phase 5

Band Integration

```text
Band Adapter
Messages
Activity Feed
```

---

## Phase 6

Final Demo

```text
Workflow Visualization

Live Agent Progress

Activity Timeline

Generated Report

Approval Decision
```

---

# Demo Scenario

Input:

```text
Build a SaaS Expense Tracker
```

Execution:

```text
Project Created

↓

Workflow Started

↓

PM Agent Generates Requirements

↓

Architect Designs System

↓

Engineer Creates Plan

↓

QA Reviews

↓

Security Reviews

↓

Reviewer Approves

↓

Final Report Generated

↓

Dashboard Updated

↓

Activity Timeline Updated

↓

Workflow Completed
```

---

# Final Submission Narrative

CodeBand AI demonstrates how specialized software engineering agents can collaborate through Band while maintaining reliable structured outputs using PydanticAI, state-driven execution through LangGraph, enterprise-grade orchestration through Prefect, complete observability through Directus, and an intuitive user experience through Next.js.

The architecture intentionally separates:

Intelligence → PydanticAI

Communication → Band

State Management → LangGraph

Execution → Prefect

Persistence → Directus

Presentation → Next.js

This creates a scalable foundation for enterprise multi-agent software delivery and serves as a blueprint for autonomous software engineering teams.

# Repository Implementation Guide

This section explains exactly where every component should live.

---

# Repository Structure

```text

band-masd/

├── apps/
│
│   ├── web/
│   ├── api/
│   └── directus/
│
├── agents/
│
├── workflows/
│
├── packages/
│
├── docs/
│
└── tasks/

```

---

# apps/web

Purpose:

User Interface

Contains:

```text

apps/web/

src/

├── app/
│
├── components/
│
├── hooks/
│
├── services/
│
├── types/
│
└── lib/

```

---

## app/

Contains pages.

```text

app/

dashboard/

projects/

workflows/

activity/

reports/

console/

settings/

```

Examples:

```text

/dashboard

/projects

/projects/new

/workflows/[id]

/activity

/reports/[id]

```

---

## components/

UI Components

```text

components/

dashboard/

workflow/

activity/

reports/

projects/

layout/

shared/

```

---

### dashboard/

```text

stats-card.tsx

project-table.tsx

workflow-summary.tsx

```

---

### workflow/

```text

workflow-canvas.tsx

agent-node.tsx

agent-details.tsx

workflow-status.tsx

```

---

### activity/

```text

activity-timeline.tsx

activity-item.tsx

activity-filter.tsx

```

---

### reports/

```text

report-summary.tsx

qa-report.tsx

security-report.tsx

artifact-list.tsx

```

---

### layout/

```text

sidebar.tsx

header.tsx

activity-panel.tsx

app-shell.tsx

```

---

## hooks/

Frontend data hooks.

```text

useProjects.ts

useWorkflow.ts

useMessages.ts

useReports.ts

useDashboard.ts

```

---

## services/

Frontend API clients.

```text

project.service.ts

workflow.service.ts

message.service.ts

report.service.ts

dashboard.service.ts

```

These call:

```text

apps/api

```

Never Directus directly.

---

# apps/api

Purpose:

Backend APIs

Workflow execution

Agent orchestration

Band integration

LangGraph execution

---

Structure

```text

apps/api/

src/

├── api/
│
├── services/
│
├── workflows/
│
├── integrations/
│
├── repositories/
│
├── schemas/
│
└── core/

```

---

## api/

FastAPI routes.

```text

routes/

projects.py

workflows.py

agents.py

reports.py

dashboard.py

```

---

## services/

Business services.

```text

ProjectService

WorkflowService

AgentService

ReportService

BandService

```

Purpose:

Application layer.

---

## repositories/

Directus access.

```text

ProjectRepository

WorkflowRepository

MessageRepository

ArtifactRepository

```

Only repository layer talks to Directus.

---

## integrations/

External systems.

```text

ollama/

band/

directus/

prefect/

```

---

# apps/directus

Purpose:

Persistence Layer

Contains:

```text

snapshot/

seed/

bootstrap/

```

---

## snapshot/

```text

schema.yaml

```

Single source of truth.

---

## seed/

```text

agents.json

projects.json

```

Demo data.

---

## bootstrap/

```text

main.py

seed.py

```

Initialize environment.

---

# agents

Purpose:

All AI Agents

One directory per agent.

```text

agents/

pm_agent/

architect_agent/

engineer_agent/

qa_agent/

security_agent/

reviewer_agent/

```

---

# Agent Structure

Example:

```text

pm_agent/

agent.py

models.py

prompts/

tools/

tests/

```

---

## agent.py

PydanticAI implementation.

```python

pm_agent = Agent(...)

```

---

## models.py

Output schemas.

```python

class PMOutput(BaseModel):
    ...
```

---

## prompts/

Prompt templates.

```text

system_prompt.md

requirements_prompt.md

```

---

## tools/

Agent tools.

```text

directus_tool.py

search_tool.py

```

---

# workflows

Purpose:

LangGraph + Prefect

---

Structure

```text

workflows/

graphs/

state/

flows/

nodes/

```

---

## graphs/

LangGraph definitions.

```text

software_delivery_graph.py

```

Contains:

```python

StateGraph

builder.add_node()

builder.add_edge()

```

---

## state/

Workflow state.

```text

workflow_state.py

```

Contains:

```python

class WorkflowState(...)
```

---

## nodes/

Each LangGraph node.

```text

pm_node.py

architect_node.py

engineer_node.py

qa_node.py

security_node.py

reviewer_node.py

```

Each node calls an agent.

---

Example:

```python

def pm_node(
    state
):
    ...
```

---

## flows/

Prefect flows.

```text

software_delivery_flow.py

```

Contains:

```python

@flow
def software_delivery_flow():
```

---

# packages

Purpose:

Reusable shared modules

---

Structure

```text

packages/

band_adapter/

directus_client/

shared_types/

workflow_sdk/

```

---

## band_adapter/

Most important package.

Provides:

```python

publish()

subscribe()

```

Implementations:

```text

DirectusBandClient

RealBandClient
```

---

## directus_client/

Directus SDK wrapper.

```python

create_project()

create_workflow()

create_message()

```

---

## shared_types/

Shared DTOs.

Used by:

```text

web
api
agents
workflows
```

---

## workflow_sdk/

Custom framework.

Contains:

```python

WorkflowManager

AgentExecutor

WorkflowContext

```

This is your business abstraction.

---

# docs

Architecture documents.

```text

architecture.md

api-spec.md

workflow-design.md

agent-design.md

```

---

# tasks

Team collaboration.

```text

TASK-001.md

TASK-002.md

TASK-003.md
```

Every task generated by AI gets stored here.

---

# Recommended Implementation Order

## Day 1

```text

Directus

Web UI

FastAPI

Shared Types

```

---

## Day 2

```text

Workflow State

LangGraph

Prefect

```

---

## Day 3

```text

PM Agent

Architect Agent

Engineer Agent

```

---

## Day 4

```text

QA Agent

Security Agent

Reviewer Agent

```

---

## Day 5

```text

Band Integration

Activity Timeline

Workflow Visualization

```

This structure keeps responsibilities clean and makes it easy to explain the architecture to hackathon judges.
