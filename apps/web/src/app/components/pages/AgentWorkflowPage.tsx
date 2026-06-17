import { useState } from "react";
import {
  MessageSquare, Layout, Code2, TestTube, Shield, CheckSquare,
  Loader2, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { AgentDrawer } from "../AgentDrawer";
import type { AgentNode } from "../WorkflowDiagram";

const AGENTS: AgentNode[] = [
  {
    id: "pm",
    name: "PM Agent",
    role: "Requirements & Planning",
    status: "completed",
    progress: 100,
    lastActivity: "Finalized PRD with 42 requirements, 8 user personas",
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
    lastActivity: "Designed microservices with 14 services, 3 databases",
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
    lastActivity: "Writing API contracts — 214 of 312 tasks complete",
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
    lastActivity: "Waiting for Engineer Agent to complete",
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
    lastActivity: "Awaiting QA sign-off before OWASP scan",
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
    lastActivity: "Will evaluate all agent outputs before decision",
    icon: CheckSquare,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/8 border-emerald-500/15",
  },
];

const statusIcons = {
  completed: { icon: CheckCircle2, color: "text-emerald-400" },
  running: { icon: Loader2, color: "text-primary", spin: true },
  pending: { icon: Clock, color: "text-muted-foreground" },
  blocked: { icon: AlertCircle, color: "text-rose-400" },
};

export function AgentWorkflowPage() {
  const [selected, setSelected] = useState<AgentNode | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="mb-5">
        <h1 className="text-foreground mb-1" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Agent Workflow — CRM Platform v2
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
          Click any agent card to inspect its state, inputs, outputs, and decisions.
        </p>
      </div>

      {/* Pipeline visual */}
      <div className="relative mb-6">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 pointer-events-none" style={{ top: "72px" }} />

        <div className="grid grid-cols-6 gap-3">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const { icon: StatusIcon, color: statusColor, spin } = statusIcons[agent.status] as any;
            const isRunning = agent.status === "running";

            return (
              <div
                key={agent.id}
                onClick={() => setSelected(agent)}
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${agent.bgColor} ${isRunning ? "ring-2 ring-primary/30" : ""}`}
              >
                {/* Status dot */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.bgColor}`}>
                    <Icon className={`w-4 h-4 ${agent.color}`} />
                  </div>
                  <StatusIcon className={`w-4 h-4 ${statusColor} ${spin ? "animate-spin" : ""}`} />
                </div>

                <p className="text-foreground mb-0.5" style={{ fontSize: "12px", fontWeight: 600 }}>
                  {agent.name}
                </p>
                <p className="text-muted-foreground mb-3" style={{ fontSize: "10px", lineHeight: 1.4 }}>
                  {agent.role}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-muted/50 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${agent.progress}%`,
                      background: isRunning
                        ? "linear-gradient(90deg, oklch(0.60 0.22 264), oklch(0.62 0.22 290))"
                        : agent.status === "completed"
                        ? "oklch(0.65 0.18 160)"
                        : "oklch(0.25 0.01 264)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "9px" }}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                  <span className={`${agent.color}`} style={{ fontSize: "10px", fontWeight: 600 }}>
                    {agent.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent activity table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h2 className="text-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>Agent Details</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Agent", "Current Task", "Status", "Completion", "Last Activity"].map((col) => (
                <th key={col} className="px-5 py-2.5 text-left text-muted-foreground" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              return (
                <tr key={agent.id} onClick={() => setSelected(agent)} className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${agent.bgColor}`}>
                        <Icon className={`w-3.5 h-3.5 ${agent.color}`} />
                      </div>
                      <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground" style={{ fontSize: "11px" }}>{agent.role}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      agent.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                      agent.status === "running" ? "bg-primary/15 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${agent.progress}%`,
                          background: agent.status === "completed" ? "oklch(0.65 0.18 160)" : agent.status === "running" ? "oklch(0.60 0.22 264)" : "oklch(0.25 0.01 264)",
                        }} />
                      </div>
                      <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{agent.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground" style={{ fontSize: "11px" }}>
                    {agent.lastActivity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AgentDrawer agent={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
