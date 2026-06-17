import React, { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";

interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  time: string;
  type: "success" | "running" | "warning" | "pending";
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: "1", agent: "PM Agent", action: "Started requirements analysis for CRM Platform", time: "Just now", type: "running" },
  { id: "2", agent: "Architect Agent", action: "Generated database schema with 14 tables", time: "2m ago", type: "success" },
  { id: "3", agent: "Engineer Agent", action: "Created implementation plan (312 tasks)", time: "5m ago", type: "success" },
  { id: "4", agent: "QA Agent", action: "Found 3 validation issues in API spec", time: "8m ago", type: "warning" },
  { id: "5", agent: "Security Agent", action: "Running OWASP compliance check", time: "12m ago", type: "running" },
  { id: "6", agent: "Reviewer Agent", action: "Approved workflow for E-commerce MVP", time: "18m ago", type: "success" },
  { id: "7", agent: "PM Agent", action: "Completed stakeholder mapping", time: "24m ago", type: "success" },
  { id: "8", agent: "Architect Agent", action: "Pending microservices review", time: "31m ago", type: "pending" },
];

const NEW_EVENTS: ActivityItem[] = [
  { id: "n1", agent: "Engineer Agent", action: "Submitted PR template for auth module", time: "Just now", type: "success" },
  { id: "n2", agent: "QA Agent", action: "Running test coverage analysis", time: "Just now", type: "running" },
  { id: "n3", agent: "PM Agent", action: "Updated sprint backlog with 8 new items", time: "Just now", type: "success" },
];

const typeConfig = {
  success: { icon: CheckCircle2, color: "text-emerald-400" },
  running: { icon: Loader2, color: "text-primary", spin: true },
  warning: { icon: AlertCircle, color: "text-amber-400" },
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
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [newItemId, setNewItemId] = useState<string | null>(null);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < NEW_EVENTS.length) {
        const item = { ...NEW_EVENTS[idx], id: `live-${Date.now()}`, time: "Just now" };
        setActivities((prev) => [item, ...prev.slice(0, 11)]);
        setNewItemId(item.id);
        setTimeout(() => setNewItemId(null), 1000);
        idx++;
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
        {activities.map((item) => {
          const { icon: Icon, color, spin } = typeConfig[item.type] as any;
          const isNew = item.id === newItemId;
          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-md transition-all duration-500 ${isNew ? "bg-primary/8 border border-primary/20" : "hover:bg-muted/40"}`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${color} ${spin ? "animate-spin" : ""}`} />
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
        })}
      </div>
    </aside>
  );
}
