import { useState, useEffect } from "react";
import {
  MessageSquare, Layout, Code2, TestTube, Shield, CheckSquare,
  CheckCircle2, AlertCircle, Loader2, Clock, Filter
} from "lucide-react";
import { useMessages } from "../../../hooks/useMessages";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { getAgents } from "../../../services/agent.service";
import { AGENT_CONFIG } from "../../../lib/agent-mapper";

interface BandActivityPageProps {
  projectId: string | null;
}

const typeConfig: Record<string, any> = {
  success: { icon: CheckCircle2, color: "text-emerald-400", bar: "bg-emerald-400" },
  warning: { icon: AlertCircle, color: "text-amber-400", bar: "bg-amber-400" },
  error: { icon: AlertCircle, color: "text-rose-400", bar: "bg-rose-400" },
  running: { icon: Loader2, color: "text-primary", bar: "bg-primary", spin: true },
  info: { icon: Clock, color: "text-muted-foreground", bar: "bg-muted-foreground" },
};

const ALL_AGENTS = ["PM Agent", "Architect Agent", "Engineer Agent", "QA Agent", "Security Agent", "Reviewer Agent"];

export function BandActivityPage({ projectId }: BandActivityPageProps) {
  const [filterAgent, setFilterAgent] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [agentsList, setAgentsList] = useState<any[]>([]);

  // 1. Fetch agents for lookup
  useEffect(() => {
    getAgents().then(setAgentsList).catch(console.error);
  }, []);

  // 2. Fetch active workflow
  const { workflow } = useWorkflow(null, projectId);

  // 3. Fetch messages for workflow (or all if workflow is null)
  const { messages, loading } = useMessages(workflow?.id);

  const getSeverityType = (severity?: string) => {
    if (!severity) return 'info';
    if (severity === 'success') return 'success';
    if (severity === 'warning') return 'warning';
    if (severity === 'error') return 'error';
    return 'info';
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

  const getGroupDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Map database messages to FeedEvent
  const feedEvents = messages.map(msg => {
    const dbAgent = agentsList.find(a => a.id === msg.from_agent_id);
    const code = dbAgent?.code || 'pm';
    const config = AGENT_CONFIG[code] || AGENT_CONFIG.pm;
    const severityType = getSeverityType(msg.severity);

    return {
      id: msg.id,
      agent: config.name,
      agentIcon: config.icon,
      agentColor: config.color,
      agentBg: config.bgColor,
      action: msg.title || 'Broadcast message',
      detail: msg.content || '',
      time: getTimeAgo(msg.created_at),
      type: severityType,
      date: getGroupDate(msg.created_at),
    };
  });

  const filtered = feedEvents.filter((e) => {
    const agentMatch = filterAgent === "All" || e.agent === filterAgent;
    const severityMatch = filterType === "All" || e.type === filterType;
    return agentMatch && severityMatch;
  });

  const grouped = filtered.reduce<Record<string, typeof feedEvents>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  if (loading && agentsList.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-foreground mb-1" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>
            Band Activity
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
            Communication and decisions between all agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-muted border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option>All</option>
            {ALL_AGENTS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-muted border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="All">All Severities</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {feedEvents.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, events]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-muted-foreground" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {date}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                {events.map((event) => {
                  const { icon: StatusIcon, color, bar, spin } = (typeConfig[event.type] || typeConfig.info) as any;
                  const AgentIcon = event.agentIcon;
                  return (
                    <div key={event.id} className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors group animate-in fade-in-50 duration-300">
                      {/* Left bar */}
                      <div className="flex flex-col items-center gap-1.5 pt-0.5">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${event.agentBg}`}>
                          <AgentIcon className={`w-3.5 h-3.5 ${event.agentColor}`} />
                        </div>
                        <div className={`w-0.5 flex-1 rounded-full opacity-30 ${bar}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${event.agentBg} ${event.agentColor}`}>
                              {event.agent}
                            </span>
                            <span className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>
                              {event.action}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <StatusIcon className={`w-3.5 h-3.5 ${color} ${spin ? "animate-spin" : ""}`} />
                            <span className="text-muted-foreground" style={{ fontSize: "10px" }}>{event.time}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "12px" }}>
                          {event.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-4 bg-muted/5">
          <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
          <h2 className="text-foreground font-semibold text-[14px]">No Activity</h2>
          <p className="text-muted-foreground text-[12px] max-w-[320px]">
            There is no activity to display for the selected project. Run a workflow simulation to see agent communication in action.
          </p>
        </div>
      )}
    </div>
  );
}
