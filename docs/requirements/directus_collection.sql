-- Since you're using **Directus + PostgreSQL**, I would make two changes before creating the schema:

-- 1. Use Directus system users instead of a custom `users` table.
-- 2. Store large agent inputs/outputs as `jsonb`.

-- This schema is optimized for your hackathon MVP.


-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    description TEXT,

    business_requirements TEXT,
    target_users TEXT,
    technology_preferences TEXT,

    status VARCHAR(50) DEFAULT 'draft'
        CHECK (status IN (
            'draft',
            'running',
            'completed',
            'blocked'
        )),

    approval_status VARCHAR(50) DEFAULT 'pending'
        CHECK (approval_status IN (
            'pending',
            'approved',
            'rejected',
            'changes_requested'
        )),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_status
ON projects(status);

-- =====================================================
-- WORKFLOWS
-- =====================================================

CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    status VARCHAR(50) DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'running',
            'completed',
            'failed'
        )),

    current_agent VARCHAR(100),

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflows_project
ON workflows(project_id);

-- =====================================================
-- AGENTS
-- =====================================================

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(100) UNIQUE NOT NULL,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    icon VARCHAR(100),

    sort_order INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AGENT RUNS
-- =====================================================

CREATE TABLE agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_id UUID NOT NULL
        REFERENCES workflows(id)
        ON DELETE CASCADE,

    agent_id UUID NOT NULL
        REFERENCES agents(id),

    status VARCHAR(50) DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'running',
            'completed',
            'failed'
        )),

    progress INTEGER DEFAULT 0,

    input_context JSONB,

    output_summary TEXT,

    output_payload JSONB,

    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,

    execution_time_ms BIGINT DEFAULT 0,

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_runs_workflow
ON agent_runs(workflow_id);

CREATE INDEX idx_agent_runs_agent
ON agent_runs(agent_id);

-- =====================================================
-- BAND MESSAGES
-- =====================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_id UUID NOT NULL
        REFERENCES workflows(id)
        ON DELETE CASCADE,

    from_agent_id UUID
        REFERENCES agents(id),

    to_agent_id UUID
        REFERENCES agents(id),

    event_type VARCHAR(100),

    title VARCHAR(500),

    content TEXT,

    severity VARCHAR(50)
        CHECK (severity IN (
            'info',
            'success',
            'warning',
            'error'
        )),

    metadata JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_workflow
ON messages(workflow_id);

CREATE INDEX idx_messages_created
ON messages(created_at DESC);

-- =====================================================
-- REQUIREMENTS
-- =====================================================

CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    requirement_code VARCHAR(50),

    title TEXT NOT NULL,

    description TEXT,

    priority VARCHAR(20)
        CHECK (priority IN (
            'P0',
            'P1',
            'P2',
            'P3'
        )),

    status VARCHAR(50)
        CHECK (status IN (
            'accepted',
            'in_review',
            'deferred',
            'rejected'
        )),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requirements_project
ON requirements(project_id);

-- =====================================================
-- FINDINGS
-- =====================================================

CREATE TABLE findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_id UUID NOT NULL
        REFERENCES workflows(id)
        ON DELETE CASCADE,

    agent_id UUID
        REFERENCES agents(id),

    type VARCHAR(50)
        CHECK (type IN (
            'qa',
            'security'
        )),

    severity VARCHAR(50)
        CHECK (severity IN (
            'critical',
            'high',
            'medium',
            'low',
            'warning'
        )),

    title TEXT NOT NULL,

    description TEXT,

    status VARCHAR(50)
        CHECK (status IN (
            'open',
            'resolved',
            'ignored'
        )),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_findings_workflow
ON findings(workflow_id);

-- =====================================================
-- REPORTS
-- =====================================================

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_id UUID NOT NULL
        REFERENCES workflows(id)
        ON DELETE CASCADE,

    summary TEXT,

    architecture_summary TEXT,

    implementation_summary TEXT,

    qa_summary TEXT,

    security_summary TEXT,

    approval_decision VARCHAR(50)
        CHECK (approval_decision IN (
            'approved',
            'rejected',
            'changes_requested'
        )),

    report_json JSONB,

    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_reports_workflow
ON reports(workflow_id);


--Immediately after importing, seed the agents:


INSERT INTO agents
(code,name,description,sort_order)
VALUES
('pm','PM Agent','Requirements and planning',1),
('architect','Architect Agent','System architecture',2),
('engineer','Engineer Agent','Implementation planning',3),
('qa','QA Agent','Quality assurance',4),
('security','Security Agent','Security review',5),
('reviewer','Reviewer Agent','Final approval',6);


--One thing I would add for the hackathon: a ninth table called `artifacts`.


CREATE TABLE artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,

    agent_id UUID REFERENCES agents(id),

    artifact_type VARCHAR(100),

    title VARCHAR(500),

    content TEXT,

    metadata JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
