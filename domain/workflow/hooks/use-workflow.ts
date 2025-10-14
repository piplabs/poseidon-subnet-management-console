import { useQuery } from "@tanstack/react-query"

export interface WorkflowActivity {
  id: string
  name: string
  status: "completed" | "running" | "pending" | "failed"
  duration: string
  worker: string
}

export interface WorkflowWorker {
  id: string
  status: "active" | "inactive"
  currentActivity: string
  tasksCompleted: number
}

export interface WorkflowDetails {
  id: string
  type: string
  status: "running" | "succeeded" | "failed" | "cancelled" | "pending"
  startTime: string
  duration: string
  user: string
  activities: WorkflowActivity[]
  workers: WorkflowWorker[]
}

// API Response from GET /api/v1/workflows/{workflowId}
interface ApiWorkflowDetail {
  workflowId: string
  type: string
  definition: string
  creator: string
  status: "Running" | "Completed" | "Failed" | "Terminated"
  createdAt: string
  terminatedAt: string | null
  terminationReason: string
  durationSec: number
  currentStep: number
  totalSteps: number
  stateHistory: Array<{
    from: string
    to: string
    timestamp: string
  }>
  activities: Array<{
    activityId: string
    stepIndex: number
    status: "Completed" | "Running" | "Pending" | "Failed"
    startedAt: string
    completedAt: string | null
  }>
  workers: Array<{
    worker: string
    lastHeartbeatAt: string
  }>
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function normalizeStatus(apiStatus: string): WorkflowDetails["status"] {
  switch (apiStatus) {
    case "Running":
      return "running"
    case "Completed":
      return "succeeded"
    case "Failed":
      return "failed"
    case "Terminated":
      return "cancelled"
    default:
      return "pending"
  }
}

function normalizeActivityStatus(apiStatus: string): WorkflowActivity["status"] {
  switch (apiStatus) {
    case "Completed":
      return "completed"
    case "Running":
      return "running"
    case "Failed":
      return "failed"
    default:
      return "pending"
  }
}

async function fetchWorkflow(workflowId: string): Promise<WorkflowDetails> {
  // TODO: Replace with actual API call to GET /api/v1/workflows/{workflowId}
  // const response = await fetch(`/api/v1/workflows/${workflowId}`)
  // const apiResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Replace with actual API response
  const apiResponse: ApiWorkflowDetail = {
    workflowId: "0xabc123",
    type: "VideoTranscode",
    definition: "0xdef456",
    creator: "0xuser123",
    status: "Completed",
    createdAt: "2025-10-10T04:21:00Z",
    terminatedAt: "2025-10-10T04:28:42Z",
    terminationReason: "Success",
    durationSec: 462,
    currentStep: 8,
    totalSteps: 8,
    stateHistory: [
      {
        from: "Initialized",
        to: "Running",
        timestamp: "2025-10-10T04:21:05Z",
      },
      {
        from: "Running",
        to: "Completed",
        timestamp: "2025-10-10T04:28:42Z",
      },
    ],
    activities: [
      {
        activityId: "0xactivity789",
        stepIndex: 1,
        status: "Completed",
        startedAt: "2025-10-10T04:22:01Z",
        completedAt: "2025-10-10T04:22:35Z",
      },
      {
        activityId: "0xactivity790",
        stepIndex: 2,
        status: "Completed",
        startedAt: "2025-10-10T04:22:40Z",
        completedAt: "2025-10-10T04:25:15Z",
      },
      {
        activityId: "0xactivity791",
        stepIndex: 3,
        status: "Completed",
        startedAt: "2025-10-10T04:25:20Z",
        completedAt: "2025-10-10T04:28:40Z",
      },
    ],
    workers: [
      {
        worker: "0xworker999",
        lastHeartbeatAt: "2025-10-10T04:25:00Z",
      },
    ],
  }

  // Transform to FE format
  return {
    id: apiResponse.workflowId,
    type: apiResponse.type,
    status: normalizeStatus(apiResponse.status),
    startTime: new Date(apiResponse.createdAt).toLocaleTimeString(),
    duration: formatDuration(apiResponse.durationSec),
    user: apiResponse.creator.substring(0, 10) + "...",
    activities: apiResponse.activities.map((activity) => {
      const startTime = new Date(activity.startedAt).getTime()
      const endTime = activity.completedAt ? new Date(activity.completedAt).getTime() : Date.now()
      const durationSec = Math.floor((endTime - startTime) / 1000)

      return {
        id: activity.activityId,
        name: `Activity-${activity.stepIndex}`,
        status: normalizeActivityStatus(activity.status),
        duration: formatDuration(durationSec),
        worker: apiResponse.workers[0]?.worker || "-",
      }
    }),
    workers: apiResponse.workers.map((worker) => ({
      id: worker.worker,
      status: "active" as const,
      currentActivity: apiResponse.activities[0]?.activityId || "-",
      tasksCompleted: apiResponse.activities.length,
    })),
  }
}

export function useWorkflow(workflowId: string) {
  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId),
    enabled: !!workflowId,
  })
}
