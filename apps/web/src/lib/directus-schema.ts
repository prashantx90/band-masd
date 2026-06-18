import { Project, Workflow, Agent, AgentRun, Message, Requirement, Finding, Report, Artifact } from '../types';

export interface DirectusSchema {
  projects: Project[];
  workflows: Workflow[];
  agents: Agent[];
  agent_runs: AgentRun[];
  messages: Message[];
  requirements: Requirement[];
  findings: Finding[];
  reports: Report[];
  artifacts: Artifact[];
}
