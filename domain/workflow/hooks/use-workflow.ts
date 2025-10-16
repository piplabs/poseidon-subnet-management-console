import { useQuery } from "@tanstack/react-query"
import type {
  WorkflowDetailResponse,
  StateTransition,
  ActivitySummary,
  WorkerSummary,
} from "@/lib/api/types"
import {
  normalizeWorkflowStatus,
  normalizeActivityStatus,
  formatDuration,
  formatTime,
  formatAddress,
  formatDurationMs,
  type WorkflowStatus,
  type ActivityStatus,
} from "@/lib/api/transforms"

export interface WorkflowDetails {
  id: string
  type: string
  definition: string
  creator: string
  status: WorkflowStatus
  createdAt: string
  terminatedAt: string
  terminationReason: string
  startTime: string
  duration: string
  durationSec: number
  currentStep: number
  totalSteps: number
  stateHistory: StateTransition[]
  activities: ActivitySummary[]
  workers: WorkerSummary[]
}

async function fetchWorkflow(workflowId: string): Promise<WorkflowDetails> {
  // TODO: Replace with actual API call to GET /api/v1/workflows/{workflowId}
  // const response = await fetch(`/api/v1/workflows/${workflowId}`)
  // const apiResponse: WorkflowDetailResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Replace with actual API response
  const apiResponse: WorkflowDetailResponse = {
    workflowId: "0xabc123def456789",
    type: "VideoTranscode",
    definition: "0xdef456contract",
    creator: "0xuser123456789abcdef",
    status: "Completed",
    createdAt: "2025-10-16T10:21:00Z",
    terminatedAt: "2025-10-16T10:28:42Z",
    terminationReason: "Workflow completed successfully",
    durationSec: 462,
    currentStep: 8,
    totalSteps: 8,
    stateHistory: [
      {
        from: "Created",
        to: "Running",
        timestamp: "2025-10-16T10:21:05Z",
      },
      {
        from: "Running",
        to: "Completed",
        timestamp: "2025-10-16T10:28:42Z",
      },
    ],
    activities: [
      {
        activityId: "0xactivity789abc",
        stepIndex: 0,
        status: "Completed",
        startedAt: "2025-10-16T10:22:01Z",
        completedAt: "2025-10-16T10:22:35Z",
        logRef: "ipfs://QmX1Y2Z3...",
      },
      {
        activityId: "0xactivity790abc",
        stepIndex: 1,
        status: "Completed",
        startedAt: "2025-10-16T10:22:40Z",
        completedAt: "2025-10-16T10:25:15Z",
        logRef: "ipfs://QmA1B2C3...",
      },
      {
        activityId: "0xactivity791abc",
        stepIndex: 2,
        status: "Completed",
        startedAt: "2025-10-16T10:25:20Z",
        completedAt: "2025-10-16T10:26:40Z",
        logRef: "ipfs://QmD1E2F3...",
      },
      {
        activityId: "0xactivity792abc",
        stepIndex: 3,
        status: "Completed",
        startedAt: "2025-10-16T10:26:45Z",
        completedAt: "2025-10-16T10:28:40Z",
        logRef: "ipfs://QmG1H2I3...",
      },
    ],
    workers: [
      {
        worker: "0xworker999abc123def",
        lastHeartbeatAt: "2025-10-16T10:28:00Z",
      },
      {
        worker: "0xworker888abc123def",
        lastHeartbeatAt: "2025-10-16T10:27:30Z",
      },
    ],
  }

  // Transform to FE format - now we keep most API fields as-is
  return {
    id: apiResponse.workflowId,
    type: apiResponse.type,
    definition: apiResponse.definition,
    creator: apiResponse.creator,
    status: normalizeWorkflowStatus(apiResponse.status),
    createdAt: apiResponse.createdAt,
    terminatedAt: apiResponse.terminatedAt,
    terminationReason: apiResponse.terminationReason,
    startTime: formatTime(apiResponse.createdAt),
    duration: formatDuration(apiResponse.durationSec),
    durationSec: apiResponse.durationSec,
    currentStep: apiResponse.currentStep,
    totalSteps: apiResponse.totalSteps,
    stateHistory: apiResponse.stateHistory.map((transition) => ({
      from: normalizeWorkflowStatus(transition.from),
      to: normalizeWorkflowStatus(transition.to),
      timestamp: transition.timestamp,
    })),
    activities: apiResponse.activities.map((activity) => ({
      activityId: activity.activityId,
      stepIndex: activity.stepIndex,
      status: normalizeActivityStatus(activity.status),
      startedAt: activity.startedAt,
      completedAt: activity.completedAt,
      logRef: activity.logRef,
    })),
    workers: apiResponse.workers,
  }
}

export function useWorkflow(workflowId: string) {
  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId),
    enabled: !!workflowId,
  })
}
