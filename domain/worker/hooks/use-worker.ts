import { useQuery } from "@tanstack/react-query"
import type {
  WorkerDetailResponse,
  WorkerActivity,
  WorkerWorkflow,
} from "@/lib/api/types"
import {
  normalizeWorkflowStatus,
  formatRelativeTime,
  type WorkerStatus,
} from "@/lib/api/transforms"

export interface WorkerDetails {
  id: string
  stakedAmount: string
  jailed: boolean
  registeredAt: string
  lastHeartbeat: string
  lastHeartbeatRelative: string
  missedHeartbeats: number
  activeTasks: WorkerActivity[]
  recentWorkflows: WorkerWorkflow[]
  // Derived fields
  status: WorkerStatus
  currentTasksCount: number
  currentActivity?: string
}

async function fetchWorker(workerId: string): Promise<WorkerDetails> {
  // TODO: Replace with actual API call to GET /api/v1/workers/{workerId}
  // const response = await fetch(`/api/v1/workers/${workerId}`)
  // const apiResponse: WorkerDetailResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Replace with actual API response
  const apiResponse: WorkerDetailResponse = {
    workerId: workerId,
    stakedAmount: "1000000000000000000000", // 1000 tokens in wei
    jailed: false,
    registeredAt: "2025-10-15T08:00:00Z",
    lastHeartbeat: "2025-10-16T10:35:58Z",
    missedHeartbeats: 0,
    activeTasks: [
      {
        workflowId: "0xwf001abc123def",
        activityId: "0xact002abc123",
      },
      {
        workflowId: "0xwf003abc123def",
        activityId: "0xact010abc123",
      },
    ],
    recentWorkflows: [
      {
        workflowId: "0xwf001abc123def",
        status: "Running",
      },
      {
        workflowId: "0xwf002abc123def",
        status: "Completed",
      },
      {
        workflowId: "0xwf003abc123def",
        status: "Running",
      },
      {
        workflowId: "0xwf004abc123def",
        status: "Completed",
      },
      {
        workflowId: "0xwf005abc123def",
        status: "Failed",
      },
    ],
  }

  // Derive status from jailed flag and last heartbeat
  const getWorkerStatus = (): WorkerStatus => {
    if (apiResponse.jailed) return "jailed"
    const lastHeartbeatTime = new Date(apiResponse.lastHeartbeat).getTime()
    const now = Date.now()
    const inactiveSeconds = (now - lastHeartbeatTime) / 1000
    return inactiveSeconds < 60 ? "active" : "inactive"
  }

  // Transform to FE format
  return {
    id: apiResponse.workerId,
    stakedAmount: apiResponse.stakedAmount,
    jailed: apiResponse.jailed,
    registeredAt: apiResponse.registeredAt,
    lastHeartbeat: apiResponse.lastHeartbeat,
    lastHeartbeatRelative: formatRelativeTime(apiResponse.lastHeartbeat),
    missedHeartbeats: apiResponse.missedHeartbeats,
    activeTasks: apiResponse.activeTasks,
    recentWorkflows: apiResponse.recentWorkflows.map((wf) => ({
      workflowId: wf.workflowId,
      status: normalizeWorkflowStatus(wf.status),
    })),
    // Derived fields
    status: getWorkerStatus(),
    currentTasksCount: apiResponse.activeTasks.length,
    currentActivity: apiResponse.activeTasks[0]?.activityId,
  }
}

export function useWorker(workerId: string) {
  return useQuery({
    queryKey: ["worker", workerId],
    queryFn: () => fetchWorker(workerId),
    enabled: !!workerId,
  })
}
