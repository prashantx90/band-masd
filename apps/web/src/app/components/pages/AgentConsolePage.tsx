import { useState, useRef, useEffect } from "react";
import { Terminal, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface LogEntry {
  id: number;
  time: string;
  agent: string;
  level: "info" | "success" | "warn" | "error" | "debug";
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, time: "14:22:01.441", agent: "system", level: "info", message: "Band orchestrator initialized — 6 agents loaded" },
  { id: 2, time: "14:22:01.892", agent: "pm-agent", level: "info", message: "Starting requirements analysis for project: CRM Platform v2" },
  { id: 3, time: "14:22:03.210", agent: "pm-agent", level: "debug", message: "Loaded context: business_requirements.txt (4.2KB), stakeholder_list.json (1.1KB)" },
  { id: 4, time: "14:22:05.771", agent: "pm-agent", level: "info", message: "Calling Claude claude-sonnet-4-6 (tokens: 4,821 in)" },
  { id: 5, time: "14:22:12.004", agent: "pm-agent", level: "success", message: "Requirements extracted — 42 requirements, 8 epics, 3 priority tiers (tokens: 2,104 out)" },
  { id: 6, time: "14:22:12.210", agent: "pm-agent", level: "info", message: "Publishing PRD to Band channel #requirements" },
  { id: 7, time: "14:22:12.441", agent: "system", level: "info", message: "Routing PRD to architect-agent" },
  { id: 8, time: "14:22:12.900", agent: "architect-agent", level: "info", message: "Received PRD — starting system design phase" },
  { id: 9, time: "14:22:13.120", agent: "architect-agent", level: "debug", message: "Analyzing 42 requirements for technical constraints..." },
  { id: 10, time: "14:22:14.450", agent: "architect-agent", level: "info", message: "Calling Claude claude-sonnet-4-6 (tokens: 8,341 in)" },
  { id: 11, time: "14:22:24.882", agent: "architect-agent", level: "success", message: "Architecture blueprint generated — 14 services, 3 databases (tokens: 4,212 out)" },
  { id: 12, time: "14:22:25.101", agent: "architect-agent", level: "info", message: "Posting schema to Band channel #architecture" },
  { id: 13, time: "14:22:25.441", agent: "engineer-agent", level: "info", message: "Received architecture — starting implementation planning" },
  { id: 14, time: "14:22:25.780", agent: "engineer-agent", level: "debug", message: "Decomposing 14 services into implementation tasks..." },
  { id: 15, time: "14:22:26.211", agent: "engineer-agent", level: "info", message: "Calling Claude claude-sonnet-4-6 (tokens: 12,004 in)" },
  { id: 16, time: "14:22:38.770", agent: "engineer-agent", level: "info", message: "Task decomposition complete — 312 tasks across 14 modules" },
  { id: 17, time: "14:22:39.100", agent: "engineer-agent", level: "info", message: "Generating OpenAPI specs for 47 endpoints..." },
  { id: 18, time: "14:22:41.440", agent: "engineer-agent", level: "debug", message: "Progress: 214/312 tasks drafted" },
];

const NEW_LOGS: LogEntry[] = [
  { id: 19, time: "14:22:43.001", agent: "engineer-agent", level: "debug", message: "Writing payment integration spec (task 215/312)..." },
  { id: 20, time: "14:22:44.210", agent: "engineer-agent", level: "info", message: "Calling Claude claude-sonnet-4-6 for payment flow (tokens: 5,440 in)" },
  { id: 21, time: "14:22:47.882", agent: "engineer-agent", level: "success", message: "Payment integration spec generated (tokens: 2,881 out)" },
];

const levelConfig = {
  info: { color: "text-blue-400", prefix: "INFO " },
  success: { color: "text-emerald-400", prefix: "OK   " },
  warn: { color: "text-amber-400", prefix: "WARN " },
  error: { color: "text-rose-400", prefix: "ERROR" },
  debug: { color: "text-muted-foreground", prefix: "DBG  " },
};

const agentColor: Record<string, string> = {
  "system": "text-violet-400",
  "pm-agent": "text-blue-400",
  "architect-agent": "text-violet-400",
  "engineer-agent": "text-indigo-400",
  "qa-agent": "text-amber-400",
  "security-agent": "text-rose-400",
  "reviewer-agent": "text-emerald-400",
};

const EXEC_STATS = [
  { label: "Tokens Used", value: "38,201", sub: "~$0.38 est." },
  { label: "Execution Time", value: "2m 41s", sub: "avg 4.1s/call" },
  { label: "Messages Sent", value: "47", sub: "across 6 agents" },
  { label: "Messages Received", value: "38", sub: "from Band" },
];

export function AgentConsolePage() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [follow, setFollow] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  let logIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (logIdx.current < NEW_LOGS.length) {
        setLogs((prev) => [...prev, NEW_LOGS[logIdx.current]]);
        logIdx.current++;
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (follow && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, follow]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-6 py-5 gap-4">
      {/* Header stats */}
      <div>
        <h1 className="text-foreground mb-3" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Agent Console
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
              Execution Log — CRM Platform v2
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary" style={{ fontSize: "10px" }}>
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              Running
            </span>
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
            const { color, prefix } = levelConfig[log.level];
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
          <div className="flex gap-3 px-1 -mx-1">
            <span className="text-muted-foreground/50 shrink-0">14:22:47.882</span>
            <span className="text-primary shrink-0">INFO </span>
            <span className="text-indigo-400 shrink-0">[engineer-agent]</span>
            <span className="text-foreground/80 flex items-center gap-1">
              <Loader2 className="w-2.5 h-2.5 animate-spin inline" />
              Processing task 216/312...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
