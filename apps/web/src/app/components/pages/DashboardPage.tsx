import { useState, useEffect } from "react";
import { FolderOpen, Zap, CheckCircle2, TrendingUp, ExternalLink, Loader2 } from "lucide-react";
import { WorkflowDiagram } from "../WorkflowDiagram";
import { AgentDrawer } from "../AgentDrawer";
import { useDashboard } from "../../../hooks/useDashboard";
import { useProjects } from "../../../hooks/useProjects";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { getAgents } from "../../../services/agent.service";
import { mapRunsToAgentNodes, type AgentNode } from "../../../lib/agent-mapper";

interface DashboardPageProps {
  onNavigate: (page: any) => void;
  onSelectProject: (projectId: string) => void;
}

const statusBadge: Record<string, string> = {
  running: "bg-primary/15 text-primary",
  completed: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-muted text-muted-foreground",
  blocked: "bg-rose-500/15 text-rose-400",
  draft: "bg-gray-500/15 text-gray-400",
};

const approvalBadge: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-muted text-muted-foreground",
  "in-review": "bg-amber-500/15 text-amber-400",
  "changes-requested": "bg-rose-500/15 text-rose-400",
  rejected: "bg-rose-600/15 text-rose-500",
};

const approvalLabel: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  "in-review": "In Review",
  "changes-requested": "Changes Requested",
  rejected: "Rejected",
};

const getAgentsForStatus = (status: string) => {
  switch (status) {
    case 'completed': return ["PM", "Arch", "Eng", "QA", "Sec", "Rev"];
    case 'running': return ["PM", "Arch", "Eng"];
    case 'pending': return ["PM"];
    case 'blocked': return ["PM", "Arch"];
    default: return ["PM"];
  }
};

export function DashboardPage({ onNavigate, onSelectProject }: DashboardPageProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
  const { stats } = useDashboard();
  const { projects, loading: projectsLoading } = useProjects();

  // Find active running project, or fallback to the first project
  const activeProject = projects.find(p => p.status === 'running') || projects[0];
  const { runs } = useWorkflow(null, activeProject?.id || null);

  const [agentsList, setAgentsList] = useState<any[]>([]);
  useEffect(() => {
    getAgents().then(setAgentsList).catch(console.error);
  }, []);

  const dynamicAgents = mapRunsToAgentNodes(runs, agentsList);

  const STATS = [
    { label: "Active Projects", value: stats?.activeProjects ?? 0, delta: "+2 this week", icon: FolderOpen, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Agent Runs", value: stats?.totalAgentRuns ?? 0, delta: "+143 today", icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Tasks Completed", value: stats?.completedTasks ?? 0, delta: "+512 this week", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Approval Rate", value: `${stats?.approvalRate ?? 0}%`, delta: "+1.4% vs last week", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  if (projectsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

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
              {stats?.activeProjects ?? 0} projects active
            </span>
          </div>
          <h1 className="text-foreground mb-1.5" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            AI Software Development Team
          </h1>
          <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>
            Multi-Agent Software Development powered by Band
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate("new-project")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors" 
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              New Project
            </button>
            <button 
              onClick={() => {
                if (activeProject) {
                  onSelectProject(activeProject.id);
                } else {
                  onNavigate("projects");
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 cursor-pointer transition-colors" 
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
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
      {activeProject && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-foreground mb-0.5" style={{ fontSize: "13px", fontWeight: 600 }}>
                Active Workflow — {activeProject.name}
              </h2>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                Click an agent node to inspect its state
              </p>
            </div>
            <button 
              onClick={() => onSelectProject(activeProject.id)}
              className="flex items-center gap-1 text-primary hover:text-primary/80 cursor-pointer transition-colors" 
              style={{ fontSize: "11px" }}
            >
              <ExternalLink className="w-3 h-3" />
              Full view
            </button>
          </div>
          <WorkflowDiagram agents={dynamicAgents} onAgentClick={setSelectedAgent} />
        </div>
      )}

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
            {projects.slice(0, 5).map((project) => {
              const agents = getAgentsForStatus(project.status);
              const createdDate = new Date(project.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <tr 
                  key={project.id} 
                  onClick={() => onSelectProject(project.id)} 
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{project.name}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusBadge[project.status] || statusBadge.draft}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {agents.map((a) => (
                        <span key={a} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground" style={{ fontSize: "10px" }}>{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground" style={{ fontSize: "12px" }}>{createdDate}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${approvalBadge[project.approval_status] || approvalBadge.pending}`}>
                      {approvalLabel[project.approval_status] || "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AgentDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
