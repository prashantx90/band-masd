import { useState, useRef, useEffect } from "react";
import { Terminal, Loader2, Play } from "lucide-react";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { useMessages } from "../../../hooks/useMessages";
import { getAgents } from "../../../services/agent.service";
import { getProject } from "../../../services/project.service";
import { Project } from "../../../types";

interface AgentConsolePageProps {
  projectId: string | null;
}

interface LogEntry {
  id: string;
  time: string;
  agent: string;
  level: "info" | "success" | "warn" | "error" | "debug";
  message: string;
}

const levelConfig = {
  info: { color: "text-blue-400", prefix: "INFO " },
  success: { color: "text-emerald-400", prefix: "OK   " },
  warn: { color: "text-amber-400", prefix: "WARN " },
  error: { color: "text-rose-400", prefix: "ERROR" },
  debug: { color: "text-muted-foreground", prefix: "DBG  " },
};

const agentColor: Record<string, string> = {
  "system": "text-violet-400",
  "PM Agent": "text-blue-400",
  "Architect Agent": "text-violet-400",
  "Engineer Agent": "text-indigo-400",
  "QA Agent": "text-amber-400",
  "Security Agent": "text-rose-400",
  "Reviewer Agent": "text-emerald-400",
};

export function AgentConsolePage({ projectId }: AgentConsolePageProps) {
  const [follow, setFollow] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

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

  const { workflow, runs, loading } = useWorkflow(null, projectId);
  const { messages } = useMessages(workflow?.id);

  // Auto scroll
  useEffect(() => {
    if (follow && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, follow]);

  if (loading && agentsList.length === 0) {
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
          <Terminal className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-foreground font-semibold text-[15px]">No Project Selected</h2>
        <p className="text-muted-foreground text-[12px] max-w-[320px]">
          Select an active project from the dashboard to inspect its live console logs.
        </p>
      </div>
    );
  }

  // Calculate dynamic execution stats
  const totalTokens = runs.reduce((acc, r) => acc + (r.tokens_in || 0) + (r.tokens_out || 0), 0);
  const totalTimeMs = runs.reduce((acc, r) => acc + (r.execution_time_ms || 0), 0);
  const totalTimeStr = totalTimeMs > 0 ? `${Math.floor(totalTimeMs / 1000)}s` : "0s";
  const messagesCount = messages.length;

  const EXEC_STATS = [
    { label: "Tokens Used", value: totalTokens.toLocaleString(), sub: `$${(totalTokens * 0.00001).toFixed(3)} est.` },
    { label: "Execution Time", value: totalTimeStr, sub: `${runs.length} runs executed` },
    { label: "Messages Sent", value: messagesCount.toString(), sub: "on Band network" },
    { label: "Active Agent", value: workflow?.current_agent || "None", sub: workflow?.status || "Idle" },
  ];

  // Map messages to LogEntry format
  const logs: LogEntry[] = [...messages]
    .reverse() // Display oldest first
    .map(msg => {
      const dbAgent = agentsList.find(a => a.id === msg.from_agent_id);
      const agentName = dbAgent ? dbAgent.name : "system";

      const timeString = new Date(msg.created_at).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + "." + String(new Date(msg.created_at).getMilliseconds()).padStart(3, "0");

      let level: any = "info";
      if (msg.severity === "success") level = "success";
      if (msg.severity === "warning") level = "warn";
      if (msg.severity === "error") level = "error";

      return {
        id: msg.id,
        time: timeString,
        agent: agentName,
        level,
        message: `${msg.title || ""}: ${msg.content || ""}`,
      };
    });

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-6 py-5 gap-4">
      {/* Header stats */}
      <div>
        <h1 className="text-foreground mb-3" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Agent Console — {project?.name || "Loading..."}
        </h1>
        <div className="grid grid-cols-4 gap-3">
          {EXEC_STATS.map(({ label, value, sub }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-3">
              <p className="text-foreground mb-0.5" style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "monospace" }}>
                {value}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{label}</p>
              <p className="text-muted-foreground/60" style={{ fontSize: "10px" }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Console window */}
      <div className="flex-1 rounded-lg border border-border bg-[oklch(0.06_0.01_264)] overflow-hidden flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-[oklch(0.08_0.01_264)]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>
              Execution Log
            </span>
            {workflow?.status === "running" && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary" style={{ fontSize: "10px" }}>
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Running
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={follow}
                onChange={(e) => setFollow(e.target.checked)}
                className="w-3 h-3 accent-primary"
              />
              <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Follow</span>
            </label>
          </div>
        </div>

        {/* Log output */}
        <div
          ref={logRef}
          className="flex-1 overflow-y-auto p-4 font-mono"
          style={{ fontSize: "11px", lineHeight: "1.8", scrollbarWidth: "none" }}
        >
          {logs.map((log) => {
            const levelConfigItem = levelConfig[log.level] || levelConfig.info;
            const { color, prefix } = levelConfigItem;
            const ac = agentColor[log.agent] || "text-muted-foreground";
            return (
              <div key={log.id} className="flex gap-3 hover:bg-white/3 px-1 -mx-1 rounded transition-colors">
                <span className="text-muted-foreground/50 shrink-0 select-none">{log.time}</span>
                <span className={`shrink-0 select-none ${color}`}>{prefix}</span>
                <span className={`shrink-0 ${ac}`}>[{log.agent}]</span>
                <span className="text-foreground/80">{log.message}</span>
              </div>
            );
          })}

          {workflow?.status === "running" && (
            <div className="flex gap-3 px-1 -mx-1">
              <span className="text-muted-foreground/50 shrink-0">--:--:--.---</span>
              <span className="text-primary shrink-0">INFO </span>
              <span className="text-primary shrink-0">[{workflow.current_agent || "system"}]</span>
              <span className="text-foreground/80 flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin inline" />
                Executing task step...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
