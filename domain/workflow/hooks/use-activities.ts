import { useQuery } from "@tanstack/react-query"
import type { ActivityStatus } from "@/lib/api/types"

export interface Activity {
  id: string
  name: string
  workflowId: string
  status: ActivityStatus
  startTime: string
  duration: string
  worker: string
}

// NOTE: This endpoint is NOT in the API design PDF
// FE needs: GET /api/v1/activities - List all activities across all workflows
// Current workaround: Using workflow detail API and flattening activities
interface ApiActivityListResponse {
  items: Array<{
    activityId: string
    workflowId: string
    type: string
    stepIndex: number
    status: ActivityStatus
    input: Record<string, unknown>
    output: Record<string, unknown>
    worker: string
    queueId: string
    startedAt: string
    completedAt: string | null
    failureReason: string | null
    progress: number
  }>
  page: number
  pageSize: number
  total: number
}

function formatDuration(startTime: string, endTime: string | null): string {
  const start = new Date(startTime).getTime()
  const end = endTime ? new Date(endTime).getTime() : Date.now()
  const durationSec = Math.floor((end - start) / 1000)
  const mins = Math.floor(durationSec / 60)
  const secs = durationSec % 60
  return `${mins}m ${secs}s`
}

async function fetchActivities(): Promise<Activity[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 850))

  // Mock API response - This endpoint needs to be added to the API
  const apiResponse: ApiActivityListResponse = {
    items: [
      {
        activityId: "0xactivity789",
        workflowId: "0xabc123",
        type: "VideoEncode",
        stepIndex: 2,
        status: "Completed",
        input: { fileHash: "Qm123..." },
        output: { fileHash: "QmResult..." },
        worker: "0xworker999",
        queueId: "video-queue",
        startedAt: "2025-10-10T04:22:01Z",
        completedAt: "2025-10-10T04:22:35Z",
        failureReason: null,
        progress: 100,
      },
      {
        activityId: "0xactivity790",
        workflowId: "0xabc123",
        type: "VideoTranscode",
        stepIndex: 3,
        status: "Running",
        input: { fileHash: "Qm124..." },
        output: {},
        worker: "0xworker998",
        queueId: "video-queue",
        startedAt: "2025-10-10T04:23:00Z",
        completedAt: null,
        failureReason: null,
        progress: 65,
      },
      {
        activityId: "0xactivity791",
        workflowId: "0xabc124",
        type: "DataValidation",
        stepIndex: 1,
        status: "Failed",
        input: { dataId: "data-001" },
        output: {},
        worker: "0xworker997",
        queueId: "data-queue",
        startedAt: "2025-10-10T04:20:00Z",
        completedAt: "2025-10-10T04:22:10Z",
        failureReason: "Validation error: Invalid format",
        progress: 0,
      },
    ],
    page: 1,
    pageSize: 20,
    total: 1500,
  }

  // Transform to FE format
  return apiResponse.items.map((item) => ({
    id: item.activityId,
    name: item.type,
    workflowId: item.workflowId,
    status: item.status,
    startTime: new Date(item.startedAt).toLocaleTimeString(),
    duration: formatDuration(item.startedAt, item.completedAt),
    worker: item.worker.substring(0, 12) + "...",
  }))
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => fetchActivities(),
  })
}
