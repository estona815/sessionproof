import type { AgentRun, AgentToolCallSchema } from "@/core/schemas";

type ToolCall = typeof AgentToolCallSchema._output;

export class FixtureAgentTrace {
  private readonly startedAt: Date;
  private readonly calls: ToolCall[] = [];

  constructor(startedAt = new Date()) {
    this.startedAt = startedAt;
  }

  record(tool: string, inputArtifactIds: string[], outputArtifactIds: string[]): void {
    const startedAt = new Date(this.startedAt.getTime() + this.calls.length * 10);
    const completedAt = new Date(startedAt.getTime() + 5);
    this.calls.push({
      toolCallId: `tool_${String(this.calls.length + 1).padStart(2, "0")}`,
      tool,
      status: "SUCCEEDED",
      inputArtifactIds,
      outputArtifactIds,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
    });
  }

  complete(): AgentRun {
    const completedAt = new Date(this.startedAt.getTime() + Math.max(this.calls.length, 1) * 10);
    return {
      agentRunId: `agent_fixture_${this.startedAt.getTime()}`,
      projectId: "project_glass_city",
      agentType: "release-operations",
      startedAt: this.startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      status: "SUCCEEDED",
      inputArtifactIds: ["source_inventory_glass_city"],
      outputArtifactIds: ["ledger_glass_city", "conflicts_glass_city", "readiness_glass_city"],
      modelBackend: "fixture",
      modelName: null,
      promptVersion: "fixture-v1",
      schemaVersion: "1.0.0",
      toolCalls: this.calls,
      retryCount: 0,
      latencyMs: completedAt.getTime() - this.startedAt.getTime(),
      tokenUsage: null,
      estimatedCost: { minorUnits: 0, currency: "USD" },
      deterministicRuleVersion: "2026-07-22.1",
      errorCode: null,
      humanApprovalStatus: "PENDING",
    };
  }
}
