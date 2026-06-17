import { useState } from "react";

const SECTIONS = ["General", "Agents", "Band", "API Keys", "Team", "Notifications"];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("General");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [maxTokens, setMaxTokens] = useState("4096");
  const [temperature, setTemperature] = useState("0.3");
  const [autoApprove, setAutoApprove] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Nav */}
      <div className="w-44 shrink-0 border-r border-border px-3 py-4 space-y-0.5">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeSection === s ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            style={{ fontSize: "12px", fontWeight: activeSection === s ? 500 : 400 }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: "none" }}>
        <h1 className="text-foreground mb-5" style={{ fontSize: "16px", fontWeight: 700 }}>{activeSection} Settings</h1>

        {activeSection === "General" && (
          <div className="space-y-5 max-w-lg">
            {[
              { label: "Workspace Name", value: "Acme Corp Engineering", type: "input" },
              { label: "Workspace Slug", value: "acme-corp", type: "input" },
              { label: "Default Timezone", value: "America/New_York", type: "input" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>{label}</label>
                <input type="text" defaultValue={value} className="w-full px-3 py-2 rounded-md bg-input-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors" style={{ fontSize: "13px" }} />
              </div>
            ))}
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
              Save Changes
            </button>
          </div>
        )}

        {activeSection === "Agents" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Default Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full px-3 py-2 rounded-md bg-input-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" style={{ fontSize: "13px" }}>
                <option value="claude-sonnet-4-6">claude-sonnet-4-6</option>
                <option value="claude-opus-4-8">claude-opus-4-8</option>
                <option value="claude-haiku-4-5">claude-haiku-4-5</option>
              </select>
            </div>
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Max Output Tokens</label>
              <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)} className="w-full px-3 py-2 rounded-md bg-input-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" style={{ fontSize: "13px" }} />
            </div>
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Temperature (0–1)</label>
              <input type="number" step="0.1" min="0" max="1" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="w-full px-3 py-2 rounded-md bg-input-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" style={{ fontSize: "13px" }} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
              <div>
                <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>Auto-approve workflows</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Skip human review for low-risk projects</p>
              </div>
              <button onClick={() => setAutoApprove(!autoApprove)} className={`w-9 h-5 rounded-full transition-colors ${autoApprove ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${autoApprove ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
              Save Changes
            </button>
          </div>
        )}

        {activeSection === "API Keys" && (
          <div className="space-y-4 max-w-lg">
            {[
              { label: "Anthropic API Key", value: "sk-ant-api03-••••••••••••••••••••••••••••••••••••" },
              { label: "GitHub API Token", value: "ghp_••••••••••••••••••••••••••••••••••••••" },
              { label: "Slack Webhook URL", value: "https://hooks.slack.com/services/••••••/••••••/••••••" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>{label}</label>
                <div className="flex gap-2">
                  <input type="text" defaultValue={value} className="flex-1 px-3 py-2 rounded-md bg-input-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" style={{ fontSize: "12px", fontFamily: "monospace" }} />
                  <button className="px-3 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "11px" }}>
                    Reveal
                  </button>
                </div>
              </div>
            ))}
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
              Save API Keys
            </button>
          </div>
        )}

        {activeSection === "Notifications" && (
          <div className="space-y-3 max-w-lg">
            {[
              { label: "Workflow completed", desc: "When all agents finish a workflow" },
              { label: "Agent blocked", desc: "When an agent gets stuck and needs input" },
              { label: "Approval required", desc: "When Reviewer Agent makes a decision" },
              { label: "Security issue found", desc: "When Security Agent flags critical issues" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card">
                <div>
                  <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>{label}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{desc}</p>
                </div>
                <button onClick={() => {}} className="w-9 h-5 rounded-full bg-primary">
                  <div className="w-4 h-4 rounded-full bg-white shadow translate-x-4 mx-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {(activeSection === "Band" || activeSection === "Team") && (
          <div className="max-w-lg">
            <div className="rounded-lg border border-border bg-card p-5 text-center">
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                {activeSection} settings coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
