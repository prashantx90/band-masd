import { useState } from "react";
import { FolderOpen, Zap, CheckCircle2, TrendingUp, ExternalLink } from "lucide-react";
import { WorkflowDiagram, type AgentNode } from "../WorkflowDiagram";
import { AgentDrawer } from "../AgentDrawer";

const STATS = [
  { label: "Active Projects", value: "7", delta: "+2 this week", icon: FolderOpen, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Agent Runs", value: "1,284", delta: "+143 today", icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Tasks Completed", value: "4,891", delta: "+512 this week", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Approval Rate", value: "94.2%", delta: "+1.4% vs last week", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const PROJECTS = [
  { name: "CRM Platform v2", status: "running", agents: ["PM", "Arch", "Eng"], created: "Jun 14, 2026", approval: "pending" },
  { name: "E-commerce MVP", status: "completed", agents: ["PM", "Arch", "Eng", "QA", "Sec", "Rev"], created: "Jun 10, 2026", approval: "approved" },
  { name: "Auth Microservice", status: "completed", agents: ["PM", "Arch", "Eng", "QA"], created: "Jun 6, 2026", approval: "approved" },
  { name: "Analytics Dashboard", status: "running", agents: ["PM", "Arch"], created: "Jun 13, 2026", approval: "in-review" },
  { name: "Notification Service", status: "pending", agents: ["PM"], created: "Jun 16, 2026", approval: "pending" },
  { name: "Mobile API Gateway", status: "blocked", agents: ["PM", "Arch", "Eng"], created: "Jun 9, 2026", approval: "changes-requested" },
];

const statusBadge: Record<string, string> = {
  running: "bg-primary/15 text-primary",
  completed: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-muted text-muted-foreground",
  blocked: "bg-rose-500/15 text-rose-400",
};

const approvalBadge: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-muted text-muted-foreground",
  "in-review": "bg-amber-500/15 text-amber-400",
  "changes-requested": "bg-rose-500/15 text-rose-400",
};

const approvalLabel: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  "in-review": "In Review",
  "changes-requested": "Changes Requested",
};

export function DashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "none" }}>
      {/* Hero */}
      <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 80% 50%, oklch(0.60 0.22 264 / 0.08) 0%, transparent 60%)",
        }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary" style={{ fontSize: "11px", fontWeight: 500 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              7 agents active
            </span>
          </div>
          <h1 className="text-foreground mb-1.5" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            AI Software Development Team
          </h1>
          <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>
            Multi-Agent Software Development powered by Band
          </p>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
              New Project
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors" style={{ fontSize: "13px", fontWeight: 500 }}>
              Run Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map(({ label, value, delta, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-foreground mb-0.5" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {value}
            </p>
            <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>{label}</p>
            <p className="text-emerald-400" style={{ fontSize: "10px" }}>{delta}</p>
          </div>
        ))}
      </div>

      {/* Workflow Pipeline */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-foreground mb-0.5" style={{ fontSize: "13px", fontWeight: 600 }}>
              Active Workflow — CRM Platform v2
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
              Click an agent node to inspect its state
            </p>
          </div>
          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors" style={{ fontSize: "11px" }}>
            <ExternalLink className="w-3 h-3" />
            Full view
          </button>
        </div>
        <WorkflowDiagram onAgentClick={setSelectedAgent} />
      </div>

      {/* Recent Projects */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h2 className="text-foreground" style={{ fontSize: "13px", fontWeight: 600 }}>Recent Projects</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Project Name", "Status", "Agents Used", "Created", "Approval"].map((col) => (
                <th key={col} className="px-5 py-2.5 text-left text-muted-foreground" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((project, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                <td className="px-5 py-3">
                  <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{project.name}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusBadge[project.status]}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {project.agents.map((a) => (
                      <span key={a} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground" style={{ fontSize: "10px" }}>{a}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground" style={{ fontSize: "12px" }}>{project.created}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${approvalBadge[project.approval]}`}>
                    {approvalLabel[project.approval]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgentDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
