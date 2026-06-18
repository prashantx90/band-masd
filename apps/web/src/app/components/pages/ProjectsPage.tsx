import { useState } from "react";
import { Plus, Search, FolderOpen, Loader2 } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";

interface ProjectsPageProps {
  onNavigate: (page: any) => void;
  onSelectProject: (projectId: string) => void;
}

const statusBg: Record<string, string> = {
  running: "bg-primary/15 text-primary",
  completed: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-muted text-muted-foreground",
  blocked: "bg-rose-500/15 text-rose-400",
  draft: "bg-gray-500/15 text-gray-400",
};

const approvalBg: Record<string, string> = {
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

export function ProjectsPage({ onNavigate, onSelectProject }: ProjectsPageProps) {
  const { projects, loading } = useProjects();
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-foreground mb-1" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>Projects</h1>
          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
            {projects.length} projects · {projects.filter(p => p.status === "running").length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              style={{ fontSize: "12px", width: "160px" }}
            />
          </div>
          <button 
            onClick={() => onNavigate("new-project")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" 
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map((project) => {
          const agents = getAgentsForStatus(project.status);
          return (
            <div 
              key={project.id} 
              onClick={() => onSelectProject(project.id)}
              className="rounded-lg border border-border bg-card p-4 hover:border-border/60 cursor-pointer transition-all hover:shadow-lg group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusBg[project.status] || statusBg.draft}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>
              <h3 className="text-foreground mb-1.5 group-hover:text-primary transition-colors" style={{ fontSize: "13px", fontWeight: 600 }}>
                {project.name}
              </h3>
              <p className="text-muted-foreground leading-snug mb-4 h-12 overflow-hidden text-ellipsis" style={{ fontSize: "11px" }}>
                {project.description || "No description provided."}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>{agents.length} agents</span>
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>{project.status === 'completed' ? 312 : project.status === 'running' ? 142 : 0} tasks</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${approvalBg[project.approval_status] || approvalBg.pending}`}>
                  {approvalLabel[project.approval_status] || "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
