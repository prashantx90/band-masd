export interface Project {
  id: string;
  name: string;
  description?: string;
  business_requirements?: string;
  target_users?: string;
  technology_preferences?: string;
  status: 'draft' | 'running' | 'completed' | 'blocked';
  approval_status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  project_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_agent?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Agent {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AgentRun {
  id: string;
  workflow_id: string;
  agent_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  input_context?: any;
  output_summary?: string;
  output_payload?: any;
  tokens_in: number;
  tokens_out: number;
  execution_time_ms: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Message {
  id: string;
  workflow_id: string;
  from_agent_id?: string;
  to_agent_id?: string;
  event_type?: string;
  title?: string;
  content?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  metadata?: any;
  created_at: string;
}

export interface Requirement {
  id: string;
  project_id: string;
  requirement_code?: string;
  title: string;
  description?: string;
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
  status?: 'accepted' | 'in_review' | 'deferred' | 'rejected';
  created_at: string;
}

export interface Finding {
  id: string;
  workflow_id: string;
  agent_id?: string;
  type?: 'qa' | 'security';
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'warning';
  title: string;
  description?: string;
  status?: 'open' | 'resolved' | 'ignored';
  created_at: string;
}

export interface Report {
  id: string;
  workflow_id: string;
  summary?: string;
  architecture_summary?: string;
  implementation_summary?: string;
  qa_summary?: string;
  security_summary?: string;
  approval_decision?: 'approved' | 'rejected' | 'changes_requested';
  report_json?: any;
  generated_at: string;
}

export interface Artifact {
  id: string;
  workflow_id?: string;
  agent_id?: string;
  artifact_type?: string;
  title?: string;
  content?: string;
  metadata?: any;
  created_at: string;
}

export interface DashboardStats {
  activeProjects: number;
  totalAgentRuns: number;
  completedTasks: number;
  approvalRate: number;
}
