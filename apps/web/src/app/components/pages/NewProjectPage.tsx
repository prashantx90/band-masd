import { useState } from "react";
import { MessageSquare, Layout, Code2, TestTube, Shield, CheckSquare, ChevronRight, Sparkles, Loader2, Play } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";

const WORKFLOW_STEPS = [
  { icon: MessageSquare, name: "PM Agent", color: "text-blue-400", bg: "bg-blue-500/12" },
  { icon: Layout, name: "Architect Agent", color: "text-violet-400", bg: "bg-violet-500/12" },
  { icon: Code2, name: "Engineer Agent", color: "text-indigo-400", bg: "bg-indigo-500/12" },
  { icon: TestTube, name: "QA Agent", color: "text-amber-400", bg: "bg-amber-500/12" },
  { icon: Shield, name: "Security Agent", color: "text-rose-400", bg: "bg-rose-500/12" },
  { icon: CheckSquare, name: "Reviewer Agent", color: "text-emerald-400", bg: "bg-emerald-500/12" },
];

interface NewProjectPageProps {
  onNavigate: (page: any) => void;
  onProjectCreated: (projectId: string) => void;
}

export function NewProjectPage({ onNavigate, onProjectCreated }: NewProjectPageProps) {
  const { addProject } = useProjects();
  const [form, setForm] = useState({
    name: "",
    description: "",
    requirements: "",
    users: "",
    techPrefs: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any>(null);

  const handleGenerate = async () => {
    if (!form.name) return;
    setGenerating(true);
    try {
      const proj = await addProject({
        name: form.name,
        description: form.description,
        business_requirements: form.requirements,
        target_users: form.users,
        technology_preferences: form.techPrefs,
        status: "draft",
        approval_status: "pending",
      });
      setGeneratedProject(proj);
    } catch (err) {
      console.error("Failed to generate project:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartWorkflow = async () => {
    let proj = generatedProject;
    setGenerating(true);
    try {
      if (!proj) {
        proj = await addProject({
          name: form.name,
          description: form.description,
          business_requirements: form.requirements,
          target_users: form.users,
          technology_preferences: form.techPrefs,
          status: "running",
          approval_status: "pending",
        });
      } else {
        // Update status to running
        const { updateProject } = await import("../../../services/project.service");
        // Wait, did we export updateProject? We can write to it or write directus.request(updateItem)
        const directus = (await import("../../../lib/directus")).default;
        const { updateItem } = await import("@directus/sdk");
        await directus.request(updateItem("projects", proj.id, { status: "running" }));
      }
      onProjectCreated(proj.id);
    } catch (err) {
      console.error("Failed to start workflow:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-foreground mb-1" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Start New Project
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            Describe your software idea and let the AI team generate a complete plan.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Customer Support Portal"
              className="w-full px-3 py-2.5 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              style={{ fontSize: "13px" }}
            />
          </div>

          <div>
            <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
              Project Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe what this software does and its core purpose..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
              style={{ fontSize: "13px" }}
            />
          </div>

          <div>
            <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
              Business Requirements
            </label>
            <textarea
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder="List key business requirements, compliance needs, SLAs, integration points..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
              style={{ fontSize: "13px" }}
            />
          </div>

          <div>
            <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
              Target Users
            </label>
            <input
              type="text"
              value={form.users}
              onChange={(e) => setForm((f) => ({ ...f, users: e.target.value }))}
              placeholder="e.g. B2B enterprise customers, internal engineering teams, end consumers"
              className="w-full px-3 py-2.5 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              style={{ fontSize: "13px" }}
            />
          </div>

          <div>
            <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
              Technology Preferences
            </label>
            <input
              type="text"
              value={form.techPrefs}
              onChange={(e) => setForm((f) => ({ ...f, techPrefs: e.target.value }))}
              placeholder="e.g. TypeScript, React, PostgreSQL, AWS, Docker, Kubernetes"
              className="w-full px-3 py-2.5 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              style={{ fontSize: "13px" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleGenerate}
            disabled={generating || !form.name || !!generatedProject}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-card border border-border hover:border-border/80 text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            {generating && !generatedProject ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            {generating && !generatedProject ? "Generating Plan..." : generatedProject ? "Plan Generated" : "Generate Plan"}
          </button>
          <button
            onClick={handleStartWorkflow}
            disabled={generating || !form.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            {generating && generatedProject ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Start Workflow
          </button>
        </div>

        {/* Workflow Preview */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-foreground mb-1" style={{ fontSize: "12px", fontWeight: 600 }}>
            Workflow Preview
          </h2>
          <p className="text-muted-foreground mb-4" style={{ fontSize: "11px" }}>
            Your project will be processed through these agents in sequence
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {WORKFLOW_STEPS.map(({ icon: Icon, name, color, bg }, idx) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-md border border-border ${bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-foreground" style={{ fontSize: "11px", fontWeight: 500 }}>{name}</span>
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                )}
              </div>
            ))}
          </div>

          {generatedProject && (
            <div className="mt-4 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400" style={{ fontSize: "12px", fontWeight: 500 }}>
                ✓ Plan generated — 6 agents configured, estimated 12 min to complete full analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
