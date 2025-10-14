import { useQuery } from "@tanstack/react-query"

export interface Workflow {
  id: string
  type: string
  status: "running" | "succeeded" | "failed" | "cancelled" | "pending"
  startTime: string
  duration: string
  user: string
  activities: number
}

// API Response from GET /api/v1/workflows
interface ApiWorkflowResponse {
  items: Array<{
    workflowId: string
    type: string
    definition: string
    creator: string
    status: "Running" | "Completed" | "Failed" | "Terminated"
    startedAt: string
    endedAt: string | null
    durationSec: number | null
    currentStep: number
    totalSteps: number
    latestActivityId: string
  }>
  page: number
  pageSize: number
  total: number
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "-"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function normalizeStatus(apiStatus: string): Workflow["status"] {
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

async function fetchWorkflows(subnetId?: string): Promise<Workflow[]> {
  // TODO: Replace with actual API call to GET /api/v1/workflows
  // const response = await fetch(`/api/v1/workflows?page=1&pageSize=20`)
  // const apiResponse: ApiWorkflowResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // MOCK DATA - Replace with actual API response
  const apiResponse: ApiWorkflowResponse = {
    items: [
      {
        workflowId: "0xabc123",
        type: "VideoTranscode",
        definition: "0xdef456",
        creator: "0xuser123",
        status: "Running",
        startedAt: "2025-10-10T04:21:00Z",
        endedAt: null,
        durationSec: null,
        currentStep: 3,
        totalSteps: 8,
        latestActivityId: "0xactivity789",
      },
      {
        workflowId: "0xabc124",
        type: "DataProcessing",
        definition: "0xdef457",
        creator: "0xuser124",
        status: "Completed",
        startedAt: "2025-10-10T04:15:00Z",
        endedAt: "2025-10-10T04:18:45Z",
        durationSec: 225,
        currentStep: 5,
        totalSteps: 5,
        latestActivityId: "0xactivity790",
      },
      {
        workflowId: "0xabc125",
        type: "ReportGeneration",
        definition: "0xdef458",
        creator: "0xuser125",
        status: "Failed",
        startedAt: "2025-10-10T04:10:00Z",
        endedAt: "2025-10-10T04:12:10Z",
        durationSec: 130,
        currentStep: 2,
        totalSteps: 6,
        latestActivityId: "0xactivity791",
      },
    ],
    page: 1,
    pageSize: 20,
    total: 4021,
  }

  // Transform to FE format
  return apiResponse.items.map((item) => ({
    id: item.workflowId,
    type: item.type,
    status: normalizeStatus(item.status),
    startTime: new Date(item.startedAt).toLocaleTimeString(),
    duration: formatDuration(item.durationSec),
    user: item.creator.substring(0, 10) + "...",
    activities: item.totalSteps,
  }))
}

export function useWorkflows(subnetId?: string) {
  return useQuery({
    queryKey: ["workflows", subnetId],
    queryFn: () => fetchWorkflows(subnetId),
  })
}
