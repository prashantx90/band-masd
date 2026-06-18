import { useState, useEffect } from "react";
import {
  MessageSquare, Layout, Code2, TestTube, Shield, CheckSquare,
  Loader2, CheckCircle2, Clock, AlertCircle, Play, ChevronRight
} from "lucide-react";
import { AgentDrawer } from "../AgentDrawer";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { getAgents } from "../../../services/agent.service";
import { mapRunsToAgentNodes, type AgentNode } from "../../../lib/agent-mapper";
import { getProject } from "../../../services/project.service";
import { Project } from "../../../types";

interface AgentWorkflowPageProps {
  projectId: string | null;
  onNavigate: (page: any) => void;
}

const statusIcons: Record<string, any> = {
  completed: { icon: CheckCircle2, color: "text-emerald-400" },
  running: { icon: Loader2, color: "text-primary", spin: true },
  pending: { icon: Clock, color: "text-muted-foreground" },
  blocked: { icon: AlertCircle, color: "text-rose-400" },
  failed: { icon: AlertCircle, color: "text-rose-500" },
};

export function AgentWorkflowPage({ projectId, onNavigate }: AgentWorkflowPageProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);

  // Load project name/details
  useEffect(() => {
    if (projectId) {
      getProject(projectId).then(setProject).catch(console.error);
    } else {
      setProject(null);
    }
  }, [projectId]);

  // Load agents lookup list
  useEffect(() => {
    getAgents().then(setAgentsList).catch(console.error);
  }, []);

  const { workflow, runs, loading, startSimulation } = useWorkflow(null, projectId);

  const dynamicAgents = mapRunsToAgentNodes(runs, agentsList);

  const handleStartWorkflow = async () => {
    if (projectId) {
      try {
        await startSimulation(projectId);
      } catch (err) {
        console.error("Failed to start workflow:", err);
      }
    }
  };

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
          <Play className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-foreground font-semibold text-[15px]">No Project Selected</h2>
        <p className="text-muted-foreground text-[12px] max-w-[320px]">
          Select an active project from the dashboard or projects tab to view and run its agent workflow pipeline.
        </p>
        <button
          onClick={() => onNavigate("projects")}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-[13px] font-medium"
        >
          Browse Projects
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="mb-5 flex justify-between items-start">
        <div>
          <h1 className="text-foreground mb-1" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>
            Agent Workflow — {project?.name || "Loading..."}
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
            {workflow
              ? "Click any agent card to inspect its real-time input contexts, logs, and outputs."
              : "No active workflow runs. Trigger a simulation run to begin code development."}
          </p>
        </div>

        {!workflow && (
          <button
            onClick={handleStartWorkflow}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-[13px] font-medium"
          >
            <Play className="w-4 h-4" />
            Start Agent Workflow
          </button>
        )}
      </div>

      {workflow ? (
        <>
          {/* Pipeline visual */}
          <div className="relative mb-6">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 pointer-events-none" style={{ top: "72px" }} />

            <div className="grid grid-cols-6 gap-3">
              {dynamicAgents.map((agent, idx) => {
                const Icon = agent.icon;
                const statusInfo = statusIcons[agent.status] || statusIcons.pending;
                const StatusIcon = statusInfo.icon;
                const isRunning = agent.status === "running";

                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${agent.bgColor} ${isRunning ? "ring-2 ring-primary/30" : ""}`}
                  >
                    {/* Status dot */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.bgColor}`}>
                        <Icon className={`w-4 h-4 ${agent.color}`} />
                      </div>
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color} ${statusInfo.spin ? "animate-spin" : ""}`} />
                    </div>

                    <p className="text-foreground mb-0.5" style={{ fontSize: "12px", fontWeight: 600 }}>
                      {agent.name}
                    </p>
                    <p className="text-muted-foreground mb-3" style={{ fontSize: "10px", lineHeight: 1.4 }}>
                      {agent.role}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1 rounded-full bg-muted/50 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${agent.progress}%`,
                          background: isRunning
                            ? "linear-gradient(90deg, oklch(0.60 0.22 264), oklch(0.62 0.22 290))"
                            : agent.status === "completed"
                            ? "oklch(0.65 0.18 160)"
                            : "oklch(0.25 0.01 264)",
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "9px" }}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                      <span className={`${agent.color}`} style={{ fontSize: "10px", fontWeight: 600 }}>
                        {agent.progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent activity table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="text-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>Agent Details</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Agent", "Current Task", "Status", "Completion", "Last Activity"].map((col) => (
                    <th key={col} className="px-5 py-2.5 text-left text-muted-foreground" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dynamicAgents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <tr key={agent.id} onClick={() => setSelectedAgent(agent)} className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${agent.bgColor}`}>
                            <Icon className={`w-3.5 h-3.5 ${agent.color}`} />
                          </div>
                          <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground" style={{ fontSize: "11px" }}>{agent.role}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          agent.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                          agent.status === "running" ? "bg-primary/15 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${agent.progress}%`,
                              background: agent.status === "completed" ? "oklch(0.65 0.18 160)" : agent.status === "running" ? "oklch(0.60 0.22 264)" : "oklch(0.25 0.01 264)",
                            }} />
                          </div>
                          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{agent.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground" style={{ fontSize: "11px" }}>
                        {agent.lastActivity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="border border-dashed border-border rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-4 bg-muted/5">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-foreground font-semibold text-[14px]">Ready to Run</h2>
          <p className="text-muted-foreground text-[12px] max-w-[320px]">
            This project has no active runs. Click the "Start Agent Workflow" button above to initiate the software execution sequence.
          </p>
        </div>
      )}

      <AgentDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
