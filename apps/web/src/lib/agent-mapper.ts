import { MessageSquare, Layout, Code2, TestTube, Shield, CheckSquare } from 'lucide-react';
import type { AgentNode } from '../app/components/WorkflowDiagram';

export const AGENT_CONFIG: Record<string, { name: string; role: string; icon: any; color: string; bgColor: string }> = {
  pm: {
    name: "PM Agent",
    role: "Requirements & Planning",
    icon: MessageSquare,
    color: "text-blue-400",
    bgColor: "bg-blue-500/12 border-blue-500/25",
  },
  architect: {
    name: "Architect Agent",
    role: "System Architecture",
    icon: Layout,
    color: "text-violet-400",
    bgColor: "bg-violet-500/12 border-violet-500/25",
  },
  engineer: {
    name: "Engineer Agent",
    role: "Implementation Planning",
    icon: Code2,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/12 border-indigo-500/30",
  },
  qa: {
    name: "QA Agent",
    role: "Quality Assurance",
    icon: TestTube,
    color: "text-amber-400",
    bgColor: "bg-amber-500/8 border-amber-500/15",
  },
  security: {
    name: "Security Agent",
    role: "Security Analysis",
    icon: Shield,
    color: "text-rose-400",
    bgColor: "bg-rose-500/8 border-rose-500/15",
  },
  reviewer: {
    name: "Reviewer Agent",
    role: "Final Approval",
    icon: CheckSquare,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/8 border-emerald-500/15",
  },
};

export function mapRunsToAgentNodes(runs: any[], agentsList: any[]): AgentNode[] {
  return Object.entries(AGENT_CONFIG).map(([code, config]) => {
    const dbAgent = agentsList.find(a => a.code === code);
    const run = dbAgent ? runs.find(r => r.agent_id === dbAgent.id) : null;

    return {
      id: code,
      name: config.name,
      role: config.role,
      status: run ? (run.status as any) : "pending",
      progress: run ? run.progress : 0,
      lastActivity: run ? (run.output_summary || "Executing task phases...") : "Pending upstream phases",
      icon: config.icon,
      color: config.color,
      bgColor: config.bgColor,
    };
  });
}
export type { AgentNode };
