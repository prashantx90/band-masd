import { useState } from "react";
import { Download, CheckCircle2, AlertCircle, FileText, Shield, TestTube } from "lucide-react";

const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "requirements", label: "Requirements" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Implementation" },
  { id: "qa", label: "QA Findings" },
  { id: "security", label: "Security" },
  { id: "approval", label: "Approval" },
];

export function ReportsPage() {
  const [activeSection, setActiveSection] = useState("summary");

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
                  CRM Platform v2
                </h1>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" style={{ fontSize: "11px", fontWeight: 500 }}>
                  Approved
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Total Requirements", value: "42" },
                  { label: "Services Designed", value: "14" },
                  { label: "Implementation Tasks", value: "312" },
                  { label: "Test Coverage Target", value: "85%" },
                  { label: "Security Issues Found", value: "0 critical" },
                  { label: "Approval Decision", value: "✓ Proceed" },
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
                  The CRM Platform v2 has been analyzed by all 6 AI agents. The PM Agent identified 42 requirements across 8 epics. The Architect Agent designed a scalable microservices architecture with 14 services. The Engineer Agent created 312 implementation tasks with full API contracts. QA found no blocking issues. Security scan passed with 0 critical vulnerabilities. The Reviewer Agent recommends proceeding to sprint planning.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "requirements" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Requirements</h1>
            {[
              { id: "R-001", priority: "P0", title: "User authentication with OAuth 2.0", status: "accepted" },
              { id: "R-002", priority: "P0", title: "Role-based access control (RBAC) with 5 roles", status: "accepted" },
              { id: "R-003", priority: "P0", title: "Customer data import from CSV/Excel (up to 100k rows)", status: "accepted" },
              { id: "R-004", priority: "P1", title: "Real-time activity feed for sales pipeline", status: "accepted" },
              { id: "R-005", priority: "P1", title: "Email integration with Gmail, Outlook", status: "in-review" },
              { id: "R-006", priority: "P1", title: "Reporting dashboard with custom date ranges", status: "accepted" },
              { id: "R-007", priority: "P2", title: "Mobile-responsive design for field sales", status: "accepted" },
              { id: "R-008", priority: "P2", title: "Webhook support for 3rd party integrations", status: "deferred" },
            ].map((req) => (
              <div key={req.id} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                <span className="text-muted-foreground shrink-0" style={{ fontSize: "10px", fontFamily: "monospace", marginTop: "1px" }}>{req.id}</span>
                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${req.priority === "P0" ? "bg-rose-500/15 text-rose-400" : req.priority === "P1" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                  {req.priority}
                </span>
                <span className="flex-1 text-foreground" style={{ fontSize: "12px" }}>{req.title}</span>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded ${req.status === "accepted" ? "bg-emerald-500/15 text-emerald-400" : req.status === "in-review" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "architecture" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Architecture</h1>
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>Services</h3>
              <div className="grid grid-cols-2 gap-2">
                {["auth-service", "user-service", "customer-service", "contact-service", "deal-service", "pipeline-service", "activity-service", "email-service", "notification-service", "report-service", "import-service", "webhook-service", "api-gateway", "admin-service"].map((svc) => (
                  <div key={svc} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30 border border-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground" style={{ fontSize: "11px", fontFamily: "monospace" }}>{svc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "PostgreSQL", role: "Primary DB", detail: "Users, CRM data" },
                { name: "Redis", role: "Cache + Sessions", detail: "Auth tokens, rate limit" },
                { name: "S3", role: "Object Storage", detail: "File uploads, exports" },
              ].map(({ name, role, detail }) => (
                <div key={name} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-foreground mb-0.5" style={{ fontSize: "13px", fontWeight: 600 }}>{name}</p>
                  <p className="text-primary" style={{ fontSize: "11px" }}>{role}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "10px" }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "qa" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>QA Findings</h1>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/8">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400" style={{ fontSize: "12px", fontWeight: 500 }}>0 blocking issues · 3 warnings · Target: 85% coverage</span>
            </div>
            {[
              { id: "QA-001", severity: "warning", title: "Missing pagination on /api/v1/users endpoint", status: "open" },
              { id: "QA-002", severity: "warning", title: "Undefined error codes in /api/v1/payments/refund", status: "open" },
              { id: "QA-003", severity: "warning", title: "Inconsistent ISO-8601 date format in /api/v1/events", status: "resolved" },
            ].map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${issue.severity === "warning" ? "text-amber-400" : "text-rose-400"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground" style={{ fontSize: "10px", fontFamily: "monospace" }}>{issue.id}</span>
                    <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{issue.title}</span>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded ${issue.status === "resolved" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Security Analysis</h1>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/8">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400" style={{ fontSize: "12px", fontWeight: 500 }}>OWASP Top 10 scan passed · 0 critical · 0 high · 2 medium</span>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-foreground mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>OWASP Top 10 Checklist</h3>
              <div className="space-y-2">
                {[
                  "A01 Broken Access Control", "A02 Cryptographic Failures", "A03 Injection",
                  "A04 Insecure Design", "A05 Security Misconfiguration", "A06 Vulnerable Components",
                  "A07 Auth Failures", "A08 Software Integrity Failures", "A09 Logging Failures", "A10 SSRF",
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 py-1.5 border-b border-border/50 last:border-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-foreground" style={{ fontSize: "11px" }}>{item}</span>
                    <span className="ml-auto text-emerald-400" style={{ fontSize: "10px" }}>Pass</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "approval" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Approval Decision</h1>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/8 p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400" style={{ fontSize: "16px", fontWeight: 700 }}>Approved — Proceed to Development</span>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-4" style={{ fontSize: "13px" }}>
                The Reviewer Agent has evaluated all outputs from PM, Architect, Engineer, QA, and Security agents. All requirements are met, architecture is sound, implementation plan is comprehensive, and no critical issues were found.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["PM Agent ✓", "Architect Agent ✓", "Engineer Agent ✓", "QA Agent ✓", "Security Agent ✓", "Reviewer Agent ✓"].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-emerald-400" style={{ fontSize: "12px" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "implementation" && (
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-foreground" style={{ fontSize: "18px", fontWeight: 700 }}>Implementation Plan</h1>
            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>312 tasks across 14 services · Estimated 8 weeks for a team of 6</p>
            {["auth-service", "user-service", "customer-service", "deal-service"].map((svc) => (
              <div key={svc} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                  <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500, fontFamily: "monospace" }}>{svc}</span>
                  <span className="text-muted-foreground" style={{ fontSize: "10px" }}>{Math.floor(Math.random() * 30) + 15} tasks</span>
                </div>
                <div className="p-3 space-y-1.5">
                  {["Setup project scaffold", "Implement data models", "Create API endpoints", "Write unit tests", "Add integration tests"].slice(0, 3).map((task) => (
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
      </div>
    </div>
  );
}
