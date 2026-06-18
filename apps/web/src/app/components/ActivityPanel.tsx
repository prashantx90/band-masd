import { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { useMessages } from "../../hooks/useMessages";
import { getAgents } from "../../services/agent.service";

interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  time: string;
  type: "success" | "running" | "warning" | "pending";
}

const typeConfig: Record<string, any> = {
  success: { icon: CheckCircle2, color: "text-emerald-400" },
  running: { icon: Loader2, color: "text-primary", spin: true },
  warning: { icon: AlertCircle, color: "text-amber-400" },
  error: { icon: AlertCircle, color: "text-rose-400" },
  pending: { icon: Clock, color: "text-muted-foreground" },
};

const agentColors: Record<string, string> = {
  "PM Agent": "bg-blue-500/15 text-blue-400",
  "Architect Agent": "bg-violet-500/15 text-violet-400",
  "Engineer Agent": "bg-indigo-500/15 text-indigo-400",
  "QA Agent": "bg-amber-500/15 text-amber-400",
  "Security Agent": "bg-rose-500/15 text-rose-400",
  "Reviewer Agent": "bg-emerald-500/15 text-emerald-400",
};

export function ActivityPanel() {
  const [agentsList, setAgentsList] = useState<any[]>([]);

  // Fetch agents lookup list
  useEffect(() => {
    getAgents().then(setAgentsList).catch(console.error);
  }, []);

  const { messages } = useMessages(undefined, 3000); // Poll every 3s

  const getSeverityType = (severity?: string) => {
    if (!severity) return 'pending';
    if (severity === 'success') return 'success';
    if (severity === 'warning') return 'warning';
    if (severity === 'error') return 'error';
    return 'pending';
  };

  const getTimeAgo = (dateStr: string) => {
    const elapsed = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Map database messages to ActivityItem format
  const activities: ActivityItem[] = messages.slice(0, 10).map(msg => {
    const dbAgent = agentsList.find(a => a.id === msg.from_agent_id);
    const agentName = dbAgent ? dbAgent.name : "System";
    const severityType = getSeverityType(msg.severity);

    return {
      id: msg.id,
      agent: agentName,
      action: msg.title || "Processing",
      time: getTimeAgo(msg.created_at),
      type: severityType === 'pending' && msg.event_type === 'log' ? 'running' : severityType as any,
    };
  });

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full border-l border-border bg-card">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-primary" />
        <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>
          Live Activity
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-muted-foreground" style={{ fontSize: "10px" }}>Live</span>
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5" style={{ scrollbarWidth: "none" }}>
        {activities.length > 0 ? (
          activities.map((item) => {
            const config = typeConfig[item.type] || typeConfig.pending;
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className="p-2.5 rounded-md hover:bg-muted/40 transition-colors animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <div className="flex items-start gap-2">
                  <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${config.color} ${config.spin ? "animate-spin" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${agentColors[item.agent] || "bg-muted text-muted-foreground"}`}>
                        {item.agent}
                      </span>
                    </div>
                    <p className="text-foreground leading-snug" style={{ fontSize: "11px" }}>
                      {item.action}
                    </p>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: "10px" }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground" style={{ fontSize: "11px" }}>
            Waiting for activity logs...
          </div>
        )}
      </div>
    </aside>
  );
}
