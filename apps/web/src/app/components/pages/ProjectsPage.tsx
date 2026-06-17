import { useState } from "react";
import { Plus, Search, FolderOpen } from "lucide-react";

const PROJECTS = [
  { name: "CRM Platform v2", desc: "Customer relationship management system with pipeline, contacts, and reporting", status: "running", agents: 3, tasks: 312, created: "Jun 14, 2026", approval: "pending" },
  { name: "E-commerce MVP", desc: "Full-stack e-commerce with payments, inventory, and admin dashboard", status: "completed", agents: 6, tasks: 524, created: "Jun 10, 2026", approval: "approved" },
  { name: "Auth Microservice", desc: "Centralized authentication service with OAuth 2.0, RBAC, and audit logs", status: "completed", agents: 4, tasks: 118, created: "Jun 6, 2026", approval: "approved" },
  { name: "Analytics Dashboard", desc: "Real-time analytics for product metrics, funnels, and retention", status: "running", agents: 2, tasks: 87, created: "Jun 13, 2026", approval: "in-review" },
  { name: "Notification Service", desc: "Multi-channel notification system for email, push, SMS, and webhooks", status: "pending", agents: 1, tasks: 0, created: "Jun 16, 2026", approval: "pending" },
  { name: "Mobile API Gateway", desc: "API gateway for mobile clients with rate limiting, caching, and versioning", status: "blocked", agents: 3, tasks: 204, created: "Jun 9, 2026", approval: "changes-requested" },
];

const statusBg: Record<string, string> = {
  running: "bg-primary/15 text-primary",
  completed: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-muted text-muted-foreground",
  blocked: "bg-rose-500/15 text-rose-400",
};

const approvalBg: Record<string, string> = {
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

export function ProjectsPage() {
  const [search, setSearch] = useState("");

  const filtered = PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-foreground mb-1" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>Projects</h1>
          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{PROJECTS.length} projects · {PROJECTS.filter(p => p.status === "running").length} active</p>
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
            <Plus className="w-3.5 h-3.5" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map((project) => (
          <div key={project.name} className="rounded-lg border border-border bg-card p-4 hover:border-border/60 cursor-pointer transition-all hover:shadow-lg group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusBg[project.status]}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
            <h3 className="text-foreground mb-1.5 group-hover:text-primary transition-colors" style={{ fontSize: "13px", fontWeight: 600 }}>
              {project.name}
            </h3>
            <p className="text-muted-foreground leading-snug mb-4" style={{ fontSize: "11px" }}>
              {project.desc}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground" style={{ fontSize: "10px" }}>{project.agents} agents</span>
                <span className="text-muted-foreground" style={{ fontSize: "10px" }}>{project.tasks} tasks</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${approvalBg[project.approval]}`}>
                {approvalLabel[project.approval]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
