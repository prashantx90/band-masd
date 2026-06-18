import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Layout,
  Code2,
  TestTube,
  Shield,
  CheckSquare,
  ChevronRight,
} from "lucide-react";

interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: "pending" | "running" | "completed" | "blocked";
  progress: number;
  lastActivity: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const AGENTS: AgentNode[] = [
  {
    id: "pm",
    name: "PM Agent",
    role: "Requirements & Planning",
    status: "completed",
    progress: 100,
    lastActivity: "Finalized PRD with 42 requirements",
    icon: MessageSquare,
    color: "text-blue-400",
    bgColor: "bg-blue-500/12 border-blue-500/25",
  },
  {
    id: "architect",
    name: "Architect Agent",
    role: "System Architecture",
    status: "completed",
    progress: 100,
    lastActivity: "Generated microservices blueprint",
    icon: Layout,
    color: "text-violet-400",
    bgColor: "bg-violet-500/12 border-violet-500/25",
  },
  {
    id: "engineer",
    name: "Engineer Agent",
    role: "Implementation Planning",
    status: "running",
    progress: 67,
    lastActivity: "Writing API contracts (214/312 tasks)",
    icon: Code2,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/12 border-indigo-500/30",
  },
  {
    id: "qa",
    name: "QA Agent",
    role: "Quality Assurance",
    status: "pending",
    progress: 0,
    lastActivity: "Awaiting engineer output",
    icon: TestTube,
    color: "text-amber-400",
    bgColor: "bg-amber-500/8 border-amber-500/15",
  },
  {
    id: "security",
    name: "Security Agent",
    role: "Security Analysis",
    status: "pending",
    progress: 0,
    lastActivity: "Awaiting QA clearance",
    icon: Shield,
    color: "text-rose-400",
    bgColor: "bg-rose-500/8 border-rose-500/15",
  },
  {
    id: "reviewer",
    name: "Reviewer Agent",
    role: "Final Approval",
    status: "pending",
    progress: 0,
    lastActivity: "Pending upstream results",
    icon: CheckSquare,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/8 border-emerald-500/15",
  },
];

const statusConfig = {
  pending: { label: "Pending", className: "bg-muted/60 text-muted-foreground" },
  running: { label: "Running", className: "bg-primary/15 text-primary" },
  completed: { label: "Completed", className: "bg-emerald-500/15 text-emerald-400" },
  blocked: { label: "Blocked", className: "bg-rose-500/15 text-rose-400" },
};

interface WorkflowDiagramProps {
  agents?: AgentNode[];
  onAgentClick?: (agent: AgentNode) => void;
}

export function WorkflowDiagram({ agents, onAgentClick }: WorkflowDiagramProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const nodes = agents || AGENTS;

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
      {nodes.map((agent, idx) => {
        const Icon = agent.icon;
        const status = statusConfig[agent.status];
        const isRunning = agent.status === "running";

        return (
          <div key={agent.id} className="flex items-center shrink-0">
            {/* Node */}
            <div
              className={`w-44 rounded-lg border p-3.5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary/40 ${agent.bgColor} ${isRunning ? "ring-1 ring-primary/30" : ""}`}
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.4s ease ${idx * 0.07}s, transform 0.4s ease ${idx * 0.07}s`,
              }}
              onClick={() => onAgentClick?.(agent)}
            >
              {/* Icon + Status */}
              <div className="flex items-start justify-between mb-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${agent.bgColor}`}>
                  <Icon className={`w-4 h-4 ${agent.color}`} />
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${status.className}`}>
                  {status.label}
                </span>
              </div>

              {/* Name */}
              <p className="text-foreground mb-0.5" style={{ fontSize: "12px", fontWeight: 600 }}>
                {agent.name}
              </p>
              <p className="text-muted-foreground mb-2.5" style={{ fontSize: "10px" }}>
                {agent.role}
              </p>

              {/* Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>Progress</span>
                  <span className={`${agent.color}`} style={{ fontSize: "10px", fontWeight: 600 }}>
                    {agent.progress}%
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: animated ? `${agent.progress}%` : "0%",
                      background: isRunning
                        ? "linear-gradient(90deg, oklch(0.60 0.22 264), oklch(0.62 0.22 290))"
                        : agent.status === "completed"
                        ? "oklch(0.65 0.18 160)"
                        : "oklch(0.30 0.01 264)",
                    }}
                  />
                </div>
              </div>

              {/* Last activity */}
              <p className="text-muted-foreground leading-snug" style={{ fontSize: "10px" }}>
                {agent.lastActivity}
              </p>
            </div>

            {/* Connector */}
            {idx < AGENTS.length - 1 && (
              <div className="flex items-center px-1">
                <div className="w-4 h-px bg-border" />
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { AGENTS };
export type { AgentNode };
