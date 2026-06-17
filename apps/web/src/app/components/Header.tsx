import { Bell, Search, Plus, Play } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onNewProject?: () => void;
  onRunWorkflow?: () => void;
  showActions?: boolean;
}

export function Header({ title, subtitle, onNewProject, onRunWorkflow, showActions }: HeaderProps) {
  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm">
      <div>
        <h1 className="text-foreground" style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground" style={{ fontSize: "12px", lineHeight: 1.4 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border text-muted-foreground hover:border-primary/40 transition-colors cursor-pointer" style={{ minWidth: "180px" }}>
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span style={{ fontSize: "12px" }}>Search...</span>
          <kbd className="ml-auto text-muted-foreground/60 rounded px-1 bg-background/50" style={{ fontSize: "10px", fontFamily: "monospace" }}>⌘K</kbd>
        </div>

        {showActions && (
          <>
            <button
              onClick={onRunWorkflow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              <Play className="w-3 h-3" />
              Run Workflow
            </button>
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              <Plus className="w-3 h-3" />
              New Project
            </button>
          </>
        )}

        <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
