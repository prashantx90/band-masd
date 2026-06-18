import { describe, it, expect } from "vitest";
import { mapRunsToAgentNodes } from "./agent-mapper";

describe("agent-mapper utility", () => {
  const mockAgentsList = [
    { id: "agent-pm-123", code: "pm", name: "Product Manager Agent" },
    { id: "agent-arch-456", code: "architect", name: "Architect Agent" },
    { id: "agent-eng-789", code: "engineer", name: "Engineer Agent" },
  ];

  it("should return all standard agents with pending status when no runs exist", () => {
    const nodes = mapRunsToAgentNodes([], mockAgentsList);

    expect(nodes).toHaveLength(6); // 6 agents total in config
    const pmNode = nodes.find(n => n.id === "pm");
    expect(pmNode).toBeDefined();
    expect(pmNode?.status).toBe("pending");
    expect(pmNode?.progress).toBe(0);
    expect(pmNode?.lastActivity).toBe("Pending upstream phases");
  });

  it("should map run status, progress, and output_summary to the correct node", () => {
    const mockRuns = [
      {
        agent_id: "agent-pm-123",
        status: "completed",
        progress: 100,
        output_summary: "Wrote complete PRD document.",
      },
      {
        agent_id: "agent-eng-789",
        status: "running",
        progress: 45,
        output_summary: "Generating code scaffolding...",
      },
    ];

    const nodes = mapRunsToAgentNodes(mockRuns, mockAgentsList);

    const pmNode = nodes.find(n => n.id === "pm");
    expect(pmNode?.status).toBe("completed");
    expect(pmNode?.progress).toBe(100);
    expect(pmNode?.lastActivity).toBe("Wrote complete PRD document.");

    const engNode = nodes.find(n => n.id === "engineer");
    expect(engNode?.status).toBe("running");
    expect(engNode?.progress).toBe(45);
    expect(engNode?.lastActivity).toBe("Generating code scaffolding...");

    // Architect should still be pending since no run was matched
    const archNode = nodes.find(n => n.id === "architect");
    expect(archNode?.status).toBe("pending");
    expect(archNode?.progress).toBe(0);
  });
});
