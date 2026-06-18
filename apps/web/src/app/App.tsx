import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ActivityPanel } from "./components/ActivityPanel";
import { DashboardPage } from "./components/pages/DashboardPage";
import { NewProjectPage } from "./components/pages/NewProjectPage";
import { AgentWorkflowPage } from "./components/pages/AgentWorkflowPage";
import { BandActivityPage } from "./components/pages/BandActivityPage";
import { AgentConsolePage } from "./components/pages/AgentConsolePage";
import { ReportsPage } from "./components/pages/ReportsPage";
import { ProjectsPage } from "./components/pages/ProjectsPage";
import { SettingsPage } from "./components/pages/SettingsPage";

type Page = "dashboard" | "projects" | "workflows" | "console" | "band-activity" | "reports" | "settings" | "new-project";

const PAGE_META: Record<Page, { title: string; subtitle?: string; showActions?: boolean }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of all agent activities", showActions: true },
  projects: { title: "Projects", subtitle: "Manage your AI development workflows" },
  workflows: { title: "Agent Workflows", subtitle: "Visualize agent collaboration in real time" },
  console: { title: "Agent Console", subtitle: "Live execution logs and metrics" },
  "band-activity": { title: "Band Activity", subtitle: "Communication timeline between agents" },
  reports: { title: "Reports", subtitle: "Final project outputs and approvals" },
  settings: { title: "Settings", subtitle: "Workspace and agent configuration" },
  "new-project": { title: "New Project", subtitle: "Start a new AI software development workflow" },
};

import { useDirectusAuth } from "../context/DirectusAuthContext";
import { LoginPage } from "./components/pages/LoginPage";
import { Loader2 } from "lucide-react";

export default function App() {
  const { user, loading } = useDirectusAuth();
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const meta = PAGE_META[page];

  const navigate = (p: Page) => setPage(p);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#07070b]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="dark flex h-screen w-screen overflow-hidden bg-background text-foreground" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* MARKER-MAKE-KIT-INVOKED */}
      {/* Sidebar */}
      <Sidebar currentPage={page === "new-project" ? "projects" : page as any} onNavigate={(p) => navigate(p as Page)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          showActions={meta.showActions}
          onNewProject={() => setPage("new-project")}
          onRunWorkflow={() => setPage("workflows")}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Page content */}
          <div className="flex-1 flex overflow-hidden">
            {page === "dashboard" && (
              <DashboardPage
                onNavigate={navigate}
                onSelectProject={(projId) => {
                  setSelectedProjectId(projId);
                  navigate("workflows");
                }}
              />
            )}
            {page === "projects" && (
              <ProjectsPage
                onNavigate={navigate}
                onSelectProject={(projId) => {
                  setSelectedProjectId(projId);
                  navigate("workflows");
                }}
              />
            )}
            {page === "workflows" && (
              <AgentWorkflowPage
                projectId={selectedProjectId}
                onNavigate={navigate}
              />
            )}
            {page === "console" && (
              <AgentConsolePage
                projectId={selectedProjectId}
              />
            )}
            {page === "band-activity" && (
              <BandActivityPage
                projectId={selectedProjectId}
              />
            )}
            {page === "reports" && (
              <ReportsPage
                projectId={selectedProjectId}
              />
            )}
            {page === "settings" && <SettingsPage />}
            {page === "new-project" && (
              <NewProjectPage
                onNavigate={navigate}
                onProjectCreated={(projId) => {
                  setSelectedProjectId(projId);
                  navigate("workflows");
                }}
              />
            )}
          </div>

          {/* Right activity panel — hidden on console/reports to maximize space */}
          {page !== "console" && page !== "reports" && page !== "settings" && (
            <ActivityPanel />
          )}
        </div>
      </div>
    </div>
  );
}
