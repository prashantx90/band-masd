import { X, ArrowUpRight, ArrowDownLeft, FileText, Lightbulb } from "lucide-react";
import type { AgentNode } from "./WorkflowDiagram";

interface AgentDrawerProps {
  agent: AgentNode | null;
  onClose: () => void;
}

export function AgentDrawer({ agent, onClose }: AgentDrawerProps) {
  if (!agent) return null;

  const Icon = agent.icon;

  const artifacts = {
    pm: ["product-requirements.md", "user-stories.json", "sprint-backlog.csv"],
    architect: ["system-architecture.svg", "database-schema.sql", "api-contracts.yaml"],
    engineer: ["implementation-plan.md", "tech-stack.json", "dependency-graph.png"],
    qa: ["test-plan.md", "test-cases.json", "coverage-report.html"],
    security: ["threat-model.md", "owasp-checklist.json", "vuln-scan.pdf"],
    reviewer: ["approval-decision.md", "review-notes.json"],
  };

  const decisions = {
    pm: [
      "Prioritized MVP over full feature set given 8-week timeline",
      "Chose REST over GraphQL for simpler onboarding",
      "Included accessibility as P0 requirement",
    ],
    architect: [
      "Selected PostgreSQL for ACID compliance requirements",
      "Adopted event-driven microservices pattern",
      "Chose Kubernetes for container orchestration",
    ],
    engineer: [
      "TypeScript strict mode enabled across all services",
      "OpenAPI 3.1 specs generated before implementation",
      "Test-first approach mandated for all endpoints",
    ],
    qa: ["Coverage threshold set at 85%", "E2E tests required for all critical paths"],
    security: ["JWT with 15-min expiry + refresh tokens", "Input validation at controller layer"],
    reviewer: ["Awaiting QA and Security clearance before approval"],
  };

  const agentArtifacts = artifacts[agent.id as keyof typeof artifacts] || [];
  const agentDecisions = decisions[agent.id as keyof typeof decisions] || [];

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b border-border ${agent.bgColor}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${agent.bgColor}`}>
              <Icon className={`w-5 h-5 ${agent.color}`} />
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-foreground mb-0.5" style={{ fontSize: "15px", fontWeight: 600 }}>{agent.name}</h2>
          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{agent.role}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Sent", value: agent.status !== "pending" ? "47" : "0", icon: ArrowUpRight, color: "text-primary" },
              { label: "Received", value: agent.status !== "pending" ? "38" : "0", icon: ArrowDownLeft, color: "text-accent" },
              { label: "Progress", value: `${agent.progress}%`, color: "text-emerald-400" },
            ].map(({ label, value, icon: StatIcon, color }) => (
              <div key={label} className="bg-muted/40 rounded-md p-2.5 text-center">
                <p className={`${color} mb-0.5`} style={{ fontSize: "14px", fontWeight: 700 }}>{value}</p>
                <p className="text-muted-foreground" style={{ fontSize: "10px" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Input Context */}
          <div>
            <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Input Context
            </p>
            <div className="bg-muted/30 rounded-md p-3 border border-border">
              <p className="text-foreground leading-relaxed" style={{ fontSize: "12px" }}>
                {agent.id === "pm"
                  ? "Business requirements document, stakeholder interviews, market research data, competitive analysis"
                  : agent.id === "architect"
                  ? "PRD from PM Agent, technical constraints, infrastructure budget, scalability targets"
                  : agent.id === "engineer"
                  ? "Architecture specs, API contracts, database schema, tech stack decisions"
                  : "Upstream agent outputs and validation criteria"}
              </p>
            </div>
          </div>

          {/* Output Summary */}
          <div>
            <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Output Summary
            </p>
            <div className="bg-muted/30 rounded-md p-3 border border-border">
              <p className="text-foreground leading-relaxed" style={{ fontSize: "12px" }}>
                {agent.lastActivity}
              </p>
            </div>
          </div>

          {/* Artifacts */}
          {agentArtifacts.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Generated Artifacts
              </p>
              <div className="space-y-1.5">
                {agentArtifacts.map((artifact) => (
                  <div key={artifact} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30 border border-border hover:border-primary/30 cursor-pointer transition-colors group">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                    <span className="text-foreground" style={{ fontSize: "11px", fontFamily: "monospace" }}>{artifact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decisions */}
          {agentDecisions.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recent Decisions
              </p>
              <div className="space-y-1.5">
                {agentDecisions.map((decision, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-md bg-muted/20">
                    <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-foreground leading-snug" style={{ fontSize: "11px" }}>{decision}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
