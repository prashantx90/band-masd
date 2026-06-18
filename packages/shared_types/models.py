from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    business_requirements: Optional[str] = None
    target_users: Optional[str] = None
    technology_preferences: Optional[str] = None
    status: Optional[str] = "draft"  # draft, running, completed, blocked
    approval_status: Optional[str] = "pending"  # pending, approved, rejected, changes_requested
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class Workflow(BaseModel):
    id: Optional[str] = None
    project_id: str
    status: Optional[str] = "pending"  # pending, running, completed, failed
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    current_agent: Optional[str] = None

class Agent(BaseModel):
    id: Optional[str] = None
    name: str
    code: str
    description: Optional[str] = None
    sort_order: Optional[int] = None

class AgentRun(BaseModel):
    id: Optional[str] = None
    workflow_id: str
    agent_id: str
    status: Optional[str] = "pending"  # pending, running, completed, failed
    progress: Optional[int] = 0
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    input_context: Optional[Dict[str, Any]] = None
    output_summary: Optional[str] = None
    tokens_in: Optional[int] = 0
    tokens_out: Optional[int] = 0
    execution_time_ms: Optional[int] = 0

class Message(BaseModel):
    id: Optional[str] = None
    workflow_id: str
    from_agent_id: Optional[str] = None
    to_agent_id: Optional[str] = None
    event_type: str  # log, completion, system
    title: str
    content: str
    severity: Optional[str] = "info"  # info, success, warning, error
    created_at: Optional[str] = None

class Requirement(BaseModel):
    id: Optional[str] = None
    project_id: str
    requirement_id: str
    title: str
    description: Optional[str] = None
    priority: str  # P0, P1, P2
    status: Optional[str] = "pending"  # pending, implemented, verified

class Finding(BaseModel):
    id: Optional[str] = None
    workflow_id: str
    agent_id: str
    type: str  # qa, security
    severity: str  # critical, high, medium, low
    title: str
    description: Optional[str] = None
    status: Optional[str] = "open"  # open, resolved, ignored

class Report(BaseModel):
    id: Optional[str] = None
    workflow_id: str
    summary: Optional[str] = None
    architecture_summary: Optional[str] = None
    implementation_summary: Optional[str] = None
    qa_summary: Optional[str] = None
    security_summary: Optional[str] = None
    approval_decision: str  # approved, rejected, changes_requested
    generated_at: Optional[str] = None

class Artifact(BaseModel):
    id: Optional[str] = None
    workflow_id: Optional[str] = None
    agent_id: Optional[str] = None
    artifact_type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None

