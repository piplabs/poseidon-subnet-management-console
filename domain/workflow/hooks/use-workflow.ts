import { useQuery } from "@tanstack/react-query"
import type {
  WorkflowDetailResponse,
  StateTransition,
  ActivitySummary,
  WorkerSummary,
  WorkflowStatus,
} from "@/lib/api/types"
import {
  formatDuration,
  formatTime,
  formatAddress,
  formatDurationMs,
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
  // Get current time for realistic "Running" workflow
  const now = new Date()
  const startTime = new Date(now.getTime() - 8 * 60 * 1000) // Started 8 minutes ago
  const activity1Start = new Date(startTime.getTime() + 60 * 1000) // 1 min after start
  const activity1End = new Date(activity1Start.getTime() + 90 * 1000) // 1.5 min duration
  const activity2Start = new Date(activity1End.getTime() + 10 * 1000) // 10s after prev
  const activity2End = new Date(activity2Start.getTime() + 120 * 1000) // 2 min duration
  const activity3Start = new Date(activity2End.getTime() + 15 * 1000) // 15s after prev
  const activity3End = new Date(activity3Start.getTime() + 150 * 1000) // 2.5 min duration
  const activity4Start = new Date(activity3End.getTime() + 5 * 1000) // 5s after prev (currently running)

  const apiResponse: WorkflowDetailResponse = {
    workflowId: workflowId, // Use actual workflowId from params
    type: "DataProcessing",
    definition: "0xdef456789abcdef123456789abcdef12",
    creator: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    status: "Running",
    createdAt: startTime.toISOString(),
    terminatedAt: "",
    terminationReason: "",
    durationSec: Math.floor((now.getTime() - startTime.getTime()) / 1000),
    currentStep: 4,
    totalSteps: 6,
    stateHistory: [
      {
        from: "Created",
        to: "Running",
        timestamp: new Date(startTime.getTime() + 5000).toISOString(),
      },
    ],
    activities: [
      {
        activityId: "0x1a2b3c4d5e6f7890abcdef1234567890",
        stepIndex: 0,
        status: "Completed",
        startedAt: activity1Start.toISOString(),
        completedAt: activity1End.toISOString(),
        logRef: "ipfs://QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M",
      },
      {
        activityId: "0x2b3c4d5e6f7890abcdef1234567890ab",
        stepIndex: 1,
        status: "Completed",
        startedAt: activity2Start.toISOString(),
        completedAt: activity2End.toISOString(),
        logRef: "ipfs://QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P",
      },
      {
        activityId: "0x3c4d5e6f7890abcdef1234567890abcd",
        stepIndex: 2,
        status: "Completed",
        startedAt: activity3Start.toISOString(),
        completedAt: activity3End.toISOString(),
        logRef: "ipfs://QmD1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S",
      },
      {
        activityId: "0x4d5e6f7890abcdef1234567890abcdef",
        stepIndex: 3,
        status: "Running",
        startedAt: activity4Start.toISOString(),
        completedAt: "",
        logRef: "",
      },
      {
        activityId: "0x5e6f7890abcdef1234567890abcdef12",
        stepIndex: 4,
        status: "Pending",
        startedAt: "",
        completedAt: "",
        logRef: "",
      },
      {
        activityId: "0x6f7890abcdef1234567890abcdef1234",
        stepIndex: 5,
        status: "Pending",
        startedAt: "",
        completedAt: "",
        logRef: "",
      },
    ],
    workers: [
      {
        worker: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
        lastHeartbeatAt: new Date(now.getTime() - 10000).toISOString(), // 10s ago
      },
      {
        worker: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
        lastHeartbeatAt: new Date(now.getTime() - 15000).toISOString(), // 15s ago
      },
      {
        worker: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
        lastHeartbeatAt: new Date(now.getTime() - 5000).toISOString(), // 5s ago
      },
    ],
  }

  // Transform to FE format - now we keep most API fields as-is
  return {
    id: apiResponse.workflowId,
    type: apiResponse.type,
    definition: apiResponse.definition,
    creator: apiResponse.creator,
    status: apiResponse.status,
    createdAt: apiResponse.createdAt,
    terminatedAt: apiResponse.terminatedAt,
    terminationReason: apiResponse.terminationReason,
    startTime: formatTime(apiResponse.createdAt),
    duration: formatDuration(apiResponse.durationSec),
    durationSec: apiResponse.durationSec,
    currentStep: apiResponse.currentStep,
    totalSteps: apiResponse.totalSteps,
    stateHistory: apiResponse.stateHistory,
    activities: apiResponse.activities.map((activity) => ({
      activityId: activity.activityId,
      stepIndex: activity.stepIndex,
      status:activity.status,
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
