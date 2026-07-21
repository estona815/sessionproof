import "server-only";

import { Firestore, FieldValue } from "@google-cloud/firestore";

import type { AgentRun, DemoResult } from "@/core/schemas";

export class SessionproofFirestore {
  private readonly database: Firestore;

  constructor(projectId?: string) {
    this.database = new Firestore(projectId ? { projectId } : undefined);
  }

  async saveProject(result: DemoResult): Promise<void> {
    await this.database
      .collection("projects")
      .doc(result.project.projectId)
      .set(
        {
          ...result.project,
          readiness: result.readiness,
          sourceCount: result.sources.length,
          contributorCount: result.contributors.length,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
  }

  async saveAgentRun(run: AgentRun): Promise<void> {
    await this.database
      .collection("agentRuns")
      .doc(run.agentRunId)
      .set({
        ...run,
        createdAt: FieldValue.serverTimestamp(),
      });
  }
}
