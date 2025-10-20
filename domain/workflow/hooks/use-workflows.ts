import { useQuery } from "@tanstack/react-query"
import type { WorkflowListResponse, WorkflowStatus } from "@/lib/api/types"
import {
  formatDuration,
  formatTime,
  formatAddress,
} from "@/lib/api/transforms"

export interface Workflow {
  id: string
  type: string
  definition: string
  status: WorkflowStatus
  startTime: string
  endTime: string | null
  duration: string
  durationSec: number | null
  user: string
  currentStep: number
  totalSteps: number
  latestActivityId: string
}

async function fetchWorkflows(subnetId?: string): Promise<Workflow[]> {
  // TODO: Replace with actual API call to GET /api/v1/workflows
  // const response = await fetch(`/api/v1/workflows?page=1&pageSize=20`)
  // const apiResponse: WorkflowListResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // MOCK DATA - Replace with actual API response
  const apiResponse: WorkflowListResponse = {
    items: [
      {
        workflowId: "0xabc123def456789",
        type: "VideoTranscode",
        definition: "0xdef456contract",
        creator: "0xuser123456789abcdef",
        status: "Running",
        startedAt: "2025-10-16T10:21:00Z",
        endedAt: "",
        durationSec: 0,
        currentStep: 3,
        totalSteps: 8,
        latestActivityId: "0xactivity789",
      },
      {
        workflowId: "0xabc124def456790",
        type: "DataProcessing",
        definition: "0xdef457contract",
        creator: "0xuser124456789abcdef",
        status: "Completed",
        startedAt: "2025-10-16T10:15:00Z",
        endedAt: "2025-10-16T10:18:45Z",
        durationSec: 225,
        currentStep: 5,
        totalSteps: 5,
        latestActivityId: "0xactivity790",
      },
      {
        workflowId: "0xabc125def456791",
        type: "ReportGeneration",
        definition: "0xdef458contract",
        creator: "0xuser125456789abcdef",
        status: "Failed",
        startedAt: "2025-10-16T10:10:00Z",
        endedAt: "2025-10-16T10:12:10Z",
        durationSec: 130,
        currentStep: 2,
        totalSteps: 6,
        latestActivityId: "0xactivity791",
      },
      {
        workflowId: "0xabc126def456792",
        type: "ImageProcessing",
        definition: "0xdef459contract",
        creator: "0xuser126456789abcdef",
        status: "Pending",
        startedAt: "2025-10-16T10:25:00Z",
        endedAt: "",
        durationSec: 0,
        currentStep: 0,
        totalSteps: 4,
        latestActivityId: "",
      },
      {
        workflowId: "0xabc127def456793",
        type: "DataValidation",
        definition: "0xdef460contract",
        creator: "0xuser127456789abcdef",
        status: "Terminated",
        startedAt: "2025-10-16T09:45:00Z",
        endedAt: "2025-10-16T09:50:30Z",
        durationSec: 330,
        currentStep: 4,
        totalSteps: 10,
        latestActivityId: "0xactivity795",
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
    definition: item.definition,
    status: item.status,
    startTime: formatTime(item.startedAt),
    endTime: item.endedAt ? formatTime(item.endedAt) : null,
    duration: formatDuration(item.durationSec),
    durationSec: item.durationSec,
    user: formatAddress(item.creator),
    currentStep: item.currentStep,
    totalSteps: item.totalSteps,
    latestActivityId: item.latestActivityId,
  }))
}

export function useWorkflows(subnetId?: string) {
  return useQuery({
    queryKey: ["workflows", subnetId],
    queryFn: () => fetchWorkflows(subnetId),
  })
}
