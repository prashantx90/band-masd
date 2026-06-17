import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  GitBranch,
  Terminal,
  Activity,
  BarChart3,
  Settings,
  Zap,
  ChevronRight,
  Users,
} from "lucide-react";

type Page =
  | "dashboard"
  | "projects"
  | "workflows"
  | "console"
  | "band-activity"
  | "reports"
  | "settings";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "workflows", label: "Agent Workflows", icon: GitBranch },
  { id: "console", label: "Agent Console", icon: Terminal },
  { id: "band-activity", label: "Band Activity", icon: Activity },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="text-sidebar-foreground tracking-tight" style={{ fontSize: "13px", fontWeight: 600 }}>
              CodeBand AI
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors group ${
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
              style={{ fontSize: "13px", fontWeight: active ? 500 : 400 }}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"}`}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-sidebar-accent/60 cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary" style={{ fontSize: "10px", fontWeight: 600 }}>JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground truncate" style={{ fontSize: "12px", fontWeight: 500 }}>
              Jordan Davis
            </p>
            <p className="text-muted-foreground truncate" style={{ fontSize: "11px" }}>
              Engineering Lead
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5">
          <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Acme Corp · 8 members</span>
        </div>
      </div>
    </aside>
  );
}
