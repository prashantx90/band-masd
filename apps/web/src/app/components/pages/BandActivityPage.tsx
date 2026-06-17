import React, { useState } from "react";
import {
  MessageSquare, Layout, Code2, TestTube, Shield, CheckSquare,
  CheckCircle2, AlertCircle, Loader2, Clock, Filter
} from "lucide-react";

interface FeedEvent {
  id: string;
  agent: string;
  agentIcon: React.ElementType;
  agentColor: string;
  agentBg: string;
  action: string;
  detail: string;
  time: string;
  type: "success" | "warning" | "running" | "info";
  date: string;
}

const FEED: FeedEvent[] = [
  { id: "1", agent: "PM Agent", agentIcon: MessageSquare, agentColor: "text-blue-400", agentBg: "bg-blue-500/15", action: "Posted requirements document", detail: "Completed PRD v1.4 — 42 requirements across 8 epics. Stakeholder sign-off from 3 departments confirmed.", time: "2 min ago", type: "success", date: "Today" },
  { id: "2", agent: "Architect Agent", agentIcon: Layout, agentColor: "text-violet-400", agentBg: "bg-violet-500/15", action: "Generated system architecture", detail: "Microservices blueprint with 14 services, 3 databases (PostgreSQL, Redis, S3), and event streaming via Kafka.", time: "8 min ago", type: "success", date: "Today" },
  { id: "3", agent: "Engineer Agent", agentIcon: Code2, agentColor: "text-indigo-400", agentBg: "bg-indigo-500/15", action: "Submitted implementation plan (partial)", detail: "214/312 tasks drafted. Auth, user management, and notification modules complete. Working on payment integration.", time: "14 min ago", type: "running", date: "Today" },
  { id: "4", agent: "QA Agent", agentIcon: TestTube, agentColor: "text-amber-400", agentBg: "bg-amber-500/15", action: "Reported API spec issues", detail: "3 validation issues found: missing pagination params on /users, undefined error codes in /payments, inconsistent date format in /events.", time: "22 min ago", type: "warning", date: "Today" },
  { id: "5", agent: "Security Agent", agentIcon: Shield, agentColor: "text-rose-400", agentBg: "bg-rose-500/15", action: "Started OWASP compliance check", detail: "Scanning 47 API endpoints against OWASP Top 10. Estimated completion in 8 minutes.", time: "31 min ago", type: "running", date: "Today" },
  { id: "6", agent: "Reviewer Agent", agentIcon: CheckSquare, agentColor: "text-emerald-400", agentBg: "bg-emerald-500/15", action: "Approved E-commerce MVP workflow", detail: "All 6 agents completed successfully. Architecture approved, 0 critical issues. Recommending to proceed to sprint planning.", time: "1 hr ago", type: "success", date: "Today" },
  { id: "7", agent: "PM Agent", agentIcon: MessageSquare, agentColor: "text-blue-400", agentBg: "bg-blue-500/15", action: "Completed stakeholder mapping", detail: "Identified 12 stakeholders across Engineering, Product, Legal, and Finance. Priority matrix generated.", time: "3 hr ago", type: "success", date: "Today" },
  { id: "8", agent: "Architect Agent", agentIcon: Layout, agentColor: "text-violet-400", agentBg: "bg-violet-500/15", action: "Requested human review on microservices split", detail: "Uncertain about splitting auth into 2 services vs keeping monolith. Recommend engineering lead decision.", time: "Jun 16", type: "info", date: "Yesterday" },
  { id: "9", agent: "Engineer Agent", agentIcon: Code2, agentColor: "text-indigo-400", agentBg: "bg-indigo-500/15", action: "Generated OpenAPI 3.1 spec", detail: "Full spec for 47 endpoints with request/response schemas, auth flows, and example payloads.", time: "Jun 16", type: "success", date: "Yesterday" },
  { id: "10", agent: "Reviewer Agent", agentIcon: CheckSquare, agentColor: "text-emerald-400", agentBg: "bg-emerald-500/15", action: "Requested changes on Auth Microservice", detail: "Missing rate limiting specs on public endpoints. Token refresh flow needs clarification.", time: "Jun 15", type: "warning", date: "Jun 15" },
];

const typeConfig = {
  success: { icon: CheckCircle2, color: "text-emerald-400", bar: "bg-emerald-400" },
  warning: { icon: AlertCircle, color: "text-amber-400", bar: "bg-amber-400" },
  running: { icon: Loader2, color: "text-primary", bar: "bg-primary", spin: true },
  info: { icon: Clock, color: "text-muted-foreground", bar: "bg-muted-foreground" },
};

const ALL_AGENTS = ["PM Agent", "Architect Agent", "Engineer Agent", "QA Agent", "Security Agent", "Reviewer Agent"];

export function BandActivityPage() {
  const [filterAgent, setFilterAgent] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const filtered = FEED.filter((e) => {
    const agentMatch = filterAgent === "All" || e.agent === filterAgent;
    const typeMatch = filterType === "All" || e.type === filterType;
    return agentMatch && typeMatch;
  });

  const grouped = filtered.reduce<Record<string, FeedEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

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
            <option>All</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="running">Running</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

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
                const { icon: StatusIcon, color, bar, spin } = typeConfig[event.type] as any;
                const AgentIcon = event.agentIcon;
                return (
                  <div key={event.id} className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors group">
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
    </div>
  );
}
