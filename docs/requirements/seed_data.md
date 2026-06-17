For tomorrow's demo, don't generate 100 random rows.

Generate **coherent data** so all screens tell a believable story:

```text
20 Projects
40 Workflows
6 Agents
250 Agent Runs
500 Messages
200 Requirements
120 Findings
40 Reports
300 Artifacts
```

That will look like a real platform.

## Seed Projects

```sql
INSERT INTO projects (
    id,
    name,
    description,
    business_requirements,
    target_users,
    technology_preferences,
    status,
    approval_status
)
SELECT
    gen_random_uuid(),
    project_name,
    project_desc,
    'Enterprise-grade implementation',
    'Business Users',
    'Next.js, PostgreSQL, Docker',
    status,
    approval_status
FROM (
VALUES
('CRM Platform v2','Customer relationship platform','running','pending'),
('E-commerce MVP','Online commerce platform','completed','approved'),
('Auth Microservice','Central auth platform','completed','approved'),
('Analytics Dashboard','Business analytics system','running','pending'),
('Notification Service','Multi-channel notification engine','pending','pending'),
('Mobile API Gateway','Mobile gateway platform','blocked','changes_requested'),
('HR Management','Employee lifecycle platform','completed','approved'),
('Inventory System','Warehouse inventory management','running','pending'),
('Healthcare Portal','Patient engagement platform','running','pending'),
('Loan Processing System','Banking loan workflow','completed','approved'),
('Project Tracker','Project management suite','completed','approved'),
('Contract Intelligence','AI contract review system','running','pending'),
('Sales Automation','Lead management platform','running','pending'),
('Helpdesk Portal','Customer support system','completed','approved'),
('Fraud Detection','Financial fraud monitoring','running','pending'),
('Knowledge Hub','Enterprise wiki','completed','approved'),
('Logistics Platform','Fleet management platform','running','pending'),
('Procurement Suite','Vendor management system','completed','approved'),
('IoT Monitoring','Industrial monitoring system','running','pending'),
('AI Engineering Team','Band Hackathon Demo','running','pending')
) AS t(project_name,project_desc,status,approval_status);
```

---

## Create Workflows

```sql
INSERT INTO workflows (
    id,
    project_id,
    status,
    current_agent,
    started_at
)
SELECT
    gen_random_uuid(),
    p.id,
    CASE
        WHEN p.status='completed' THEN 'completed'
        WHEN p.status='running' THEN 'running'
        ELSE 'pending'
    END,
    (
        ARRAY[
            'PM Agent',
            'Architect Agent',
            'Engineer Agent',
            'QA Agent',
            'Security Agent',
            'Reviewer Agent'
        ]
    )[floor(random()*6+1)],
    NOW() - (random()*interval '30 days')
FROM projects p;
```

---

## Massive Agent Runs

This is the most important table.

```sql
INSERT INTO agent_runs (
    id,
    workflow_id,
    agent_id,
    status,
    progress,
    tokens_in,
    tokens_out,
    execution_time_ms,
    started_at
)
SELECT
    gen_random_uuid(),
    w.id,
    a.id,
    (
        ARRAY[
            'pending',
            'running',
            'completed'
        ]
    )[floor(random()*3+1)],
    floor(random()*100),
    floor(random()*10000),
    floor(random()*5000),
    floor(random()*120000),
    NOW() - (random()*interval '14 days')
FROM workflows w
CROSS JOIN agents a;
```

This alone generates:

```text
40 workflows
x 6 agents

≈ 240 agent runs
```

---

## Band Messages

These drive:

- Activity Feed
- Timeline
- Communication Screen

```sql
INSERT INTO messages (
    id,
    workflow_id,
    from_agent_id,
    to_agent_id,
    event_type,
    title,
    content,
    severity,
    created_at
)
SELECT
    gen_random_uuid(),
    w.id,
    a1.id,
    a2.id,
    (
        ARRAY[
            'requirements',
            'architecture',
            'implementation',
            'review',
            'approval'
        ]
    )[floor(random()*5+1)],
    'Agent Communication',
    'Generated message exchanged through Band.',
    (
        ARRAY[
            'info',
            'success',
            'warning'
        ]
    )[floor(random()*3+1)],
    NOW() - (random()*interval '20 days')
FROM workflows w
CROSS JOIN agents a1
CROSS JOIN agents a2
LIMIT 500;
```

---

## Requirements

```sql
INSERT INTO requirements (
    id,
    project_id,
    requirement_code,
    title,
    priority,
    status
)
SELECT
    gen_random_uuid(),
    p.id,
    'REQ-' || row_number() OVER(),
    'Requirement #' || row_number() OVER(),
    (
        ARRAY['P0','P1','P2']
    )[floor(random()*3+1)],
    (
        ARRAY[
            'accepted',
            'in_review',
            'deferred'
        ]
    )[floor(random()*3+1)]
FROM projects p
CROSS JOIN generate_series(1,10);
```

Creates:

```text
20 projects
x 10 requirements

200 requirements
```

---

## Findings

```sql
INSERT INTO findings (
    id,
    workflow_id,
    agent_id,
    type,
    severity,
    title,
    description,
    status
)
SELECT
    gen_random_uuid(),
    w.id,
    a.id,
    (
        ARRAY['qa','security']
    )[floor(random()*2+1)],
    (
        ARRAY[
            'critical',
            'high',
            'medium',
            'low'
        ]
    )[floor(random()*4+1)],
    'Finding #' || gs,
    'Automatically generated issue.',
    (
        ARRAY[
            'open',
            'resolved'
        ]
    )[floor(random()*2+1)]
FROM workflows w
JOIN agents a ON TRUE
JOIN generate_series(1,5) gs ON TRUE
LIMIT 120;
```

---

## Reports

```sql
INSERT INTO reports (
    id,
    workflow_id,
    summary,
    architecture_summary,
    implementation_summary,
    qa_summary,
    security_summary,
    approval_decision
)
SELECT
    gen_random_uuid(),
    w.id,
    'Executive summary for workflow',
    'Architecture review completed',
    'Implementation plan generated',
    'QA completed',
    'Security completed',
    (
        ARRAY[
            'approved',
            'changes_requested'
        ]
    )[floor(random()*2+1)]
FROM workflows w;
```

---

## Artifacts

Most valuable table for demos.

```sql
INSERT INTO artifacts (
    id,
    workflow_id,
    agent_id,
    artifact_type,
    title,
    content
)
SELECT
    gen_random_uuid(),
    w.id,
    a.id,
    (
        ARRAY[
            'PRD',
            'Architecture',
            'Implementation',
            'QA Report',
            'Security Report',
            'Approval Report'
        ]
    )[floor(random()*6+1)],
    'Generated Artifact',
    repeat('Lorem ipsum generated artifact content. ',20)
FROM workflows w
CROSS JOIN agents a
LIMIT 300;
```

---

For the hackathon, I would go one step further:

Create **one hero project** called:

```text
AI Engineering Team (Band Hackathon Demo)
```

and manually seed:

- 42 requirements
- 312 tasks
- 47 messages
- 6 agent runs
- 1 final report

matching exactly what your mock screens show. Then let the other 19 projects use generated data. That way every screen looks internally consistent during the demo.
