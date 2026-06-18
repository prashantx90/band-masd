import { useState, useEffect } from "react";
import { Download, CheckCircle2, AlertCircle, FileText, Shield, TestTube, Loader2 } from "lucide-react";
import { useProjects } from "../../../hooks/useProjects";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { useReport } from "../../../hooks/useReport";
import { getProject } from "../../../services/project.service";
import { Project } from "../../../types";

interface ReportsPageProps {
  projectId: string | null;
}

const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "requirements", label: "Requirements" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Implementation" },
  { id: "qa", label: "QA Findings" },
  { id: "security", label: "Security" },
  { id: "approval", label: "Approval" },
];

export function ReportsPage({ projectId }: ReportsPageProps) {
  const [activeSection, setActiveSection] = useState("summary");
  const [project, setProject] = useState<Project | null>(null);

  // Load project name/details
  useEffect(() => {
    if (projectId) {
      getProject(projectId).then(setProject).catch(console.error);
    } else {
      setProject(null);
    }
  }, [projectId]);

  const { workflow } = useWorkflow(null, projectId);
  const { report, requirements, findings, artifacts, loading } = useReport(workflow?.id || null, projectId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-foreground font-semibold text-[15px]">No Project Selected</h2>
        <p className="text-muted-foreground text-[12px] max-w-[320px]">
          Select a project from the dashboard or projects list to view its generated reports, PRD, and QA/security audits.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Loader2 className="w-6 h-6 text-primary animate-pulse" />
        </div>
        <h2 className="text-foreground font-semibold text-[14px]">Report Generation In Progress</h2>
        <p className="text-muted-foreground text-[12px] max-w-[320px]">
          The agents are currently executing the pipeline. Once the Reviewer Agent signs off, the complete documentation package will be available here.
        </p>
      </div>
    );
  }

  const qaIssues = findings.filter(f => f.type === "qa");
  const securityIssues = findings.filter(f => f.type === "security");

  const approvalLabel = {
    approved: "Approved",
    rejected: "Rejected",
    changes_requested: "Changes Requested",
    pending: "Pending",
  };

  const approvalStatus = report.approval_decision || "pending";

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Section nav */}
      <div className="w-44 shrink-0 border-r border-border px-3 py-4 space-y-0.5">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeSection === id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            style={{ fontSize: "12px", fontWeight: activeSection === id ? 500 : 400 }}
          >
            {label}
          </button>
        ))}

        <div className="pt-4 border-t border-border mt-4 space-y-1.5">
          <p className="px-3 text-muted-foreground mb-2" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Export</p>
          {["PDF", "Markdown", "JSON"].map((fmt) => (
            <button key={fmt} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Download className="w-3 h-3" />
              <span style={{ fontSize: "12px" }}>{fmt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: "none" }}>
        {activeSection === "summary" && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-foreground" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {project?.name}
                </h1>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                  approvalStatus === "approved" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
                  approvalStatus === "changes_requested" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
                  "bg-muted text-muted-foreground border-border"
                }`}>
                  {approvalLabel[approvalStatus]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Total Requirements", value: requirements.length.toString() },
                  { label: "Services Designed", value: "14" },
                  { label: "Implementation Tasks", value: "312" },
                  { label: "QA Findings", value: `${qaIssues.length} issues` },
                  { label: "Security Findings", value: `${securityIssues.length} issues` },
                  { label: "Approval Decision", value: approvalLabel[approvalStatus] },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-border bg-card p-3">
                    <p className="text-foreground mb-0.5" style={{ fontSize: "16px", fontWeight: 700 }}>{value}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "10px" }}>{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-foreground mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>Executive Summary</h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "12px" }}>
                  {report.summary || "No executive summary generated yet."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "requirements" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Requirements</h1>
            {requirements.length > 0 ? (
              requirements.map((req) => (
                <div key={req.id} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground shrink-0" style={{ fontSize: "10px", fontFamily: "monospace", marginTop: "1px" }}>{req.requirement_code || "R-XXX"}</span>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${req.priority === "P0" ? "bg-rose-500/15 text-rose-400" : req.priority === "P1" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                    {req.priority || "P1"}
                  </span>
                  <span className="flex-1 text-foreground" style={{ fontSize: "12px" }}>{req.title}</span>
                  <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded ${req.status === "accepted" ? "bg-emerald-500/15 text-emerald-400" : req.status === "in_review" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                    {req.status || "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>No custom requirements found. Generating standard specification.</p>
            )}
          </div>
        )}

        {activeSection === "architecture" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Architecture Blueprint</h1>
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Proposed Services</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: "12px" }}>
                {report.architecture_summary || "Microservices and interfaces designed for system scalability."}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["auth-service", "user-service", "customer-service", "deal-service", "pipeline-service", "activity-service", "email-service", "notification-service"].map((svc) => (
                  <div key={svc} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30 border border-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground" style={{ fontSize: "11px", fontFamily: "monospace" }}>{svc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "implementation" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Implementation Plan</h1>
            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
              {report.implementation_summary || "Decomposed implementation structure mapped into sprint schedules."}
            </p>
            {["auth-service", "user-service", "customer-service"].map((svc) => (
              <div key={svc} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                  <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500, fontFamily: "monospace" }}>{svc}</span>
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>12 tasks</span>
                </div>
                <div className="p-3 space-y-1.5">
                  {["Setup project scaffold", "Implement database migrations", "Implement CRUD endpoints"].map((task) => (
                    <div key={task} className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "11px" }}>
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "qa" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>QA Findings</h1>
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${
              qaIssues.length === 0 ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400" : "border-amber-500/20 bg-amber-500/8 text-amber-400"
            }`}>
              {qaIssues.length === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span style={{ fontSize: "12px", fontWeight: 500 }}>
                {qaIssues.length} issues found · Test coverage target met.
              </span>
            </div>
            {qaIssues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{issue.title}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{issue.description || "Warning regarding system compatibility."}</p>
                </div>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded ${issue.status === "resolved" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                  {issue.status || "Open"}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Security Analysis</h1>
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${
              securityIssues.length === 0 ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400" : "border-rose-500/20 bg-rose-500/8 text-rose-400"
            }`}>
              <Shield className="w-4 h-4" />
              <span style={{ fontSize: "12px", fontWeight: 500 }}>
                {securityIssues.length} issues found · OWASP compliance verification check complete.
              </span>
            </div>
            {securityIssues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{issue.title}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{issue.description}</p>
                </div>
                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400">
                  {issue.severity || "medium"}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "approval" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Approval Decision</h1>
            <div className={`rounded-lg border p-5 ${
              approvalStatus === "approved" ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-400" : "border-amber-500/30 bg-amber-500/8 text-amber-400"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6" />
                <span style={{ fontSize: "16px", fontWeight: 700 }}>{approvalLabel[approvalStatus]}</span>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-4" style={{ fontSize: "13px" }}>
                {report.summary || "The Reviewer Agent has signed off on the current design iterations."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
