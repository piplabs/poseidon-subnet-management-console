import { useInfiniteQuery } from "@tanstack/react-query"
import type { WorkflowListResponse, WorkflowStatus } from "@/lib/api/types"
import {
  formatDuration,
  formatTime,
  formatAddress,
} from "@/lib/api/transforms"
import { useWorkflowFilterContext } from "../contexts/workflow-filter-context"
import { useMemo } from "react"
import { getApiUrl, isApiConfigured } from "@/lib/env"

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

async function fetchWorkflows(params: {
  selectedStatuses: string[]
  workflowType?: string
  startTimeFrom?: string
  startTimeTo?: string
  sortBy?: string
  page: number
  pageSize: number
  subnetId?: string
}): Promise<WorkflowListResponse> {
  // Build query parameters
  const queryParams = new URLSearchParams()

  // Add status filter - join multiple statuses with comma
  if (params.selectedStatuses.length > 0 && params.selectedStatuses.length < 5) {
    queryParams.append("status", params.selectedStatuses.join(","))
  }

  if (params.workflowType) {
    queryParams.append("type", params.workflowType)
  }

  if (params.startTimeFrom) {
    queryParams.append("startTimeFrom", params.startTimeFrom)
  }

  if (params.startTimeTo) {
    queryParams.append("startTimeTo", params.startTimeTo)
  }

  if (params.sortBy) {
    queryParams.append("sortBy", params.sortBy)
  }

  queryParams.append("page", params.page.toString())
  queryParams.append("pageSize", params.pageSize.toString())

  let apiResponse: WorkflowListResponse

  // Use actual API if configured, otherwise use mock data
  if (isApiConfigured()) {
    const url = getApiUrl(`/api/v1/workflows?${queryParams.toString()}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.statusText}`)
    }

    apiResponse = await response.json()
  } else {
    // Simulate API delay for mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // MOCK DATA - Used when API is not configured
    apiResponse = {
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
      page: params.page, // Use the actual page from params
      pageSize: params.pageSize,
      total: 4021,
    }

    // Filter mock data based on selected statuses (for demo purposes)
    if (params.selectedStatuses.length > 0 && params.selectedStatuses.length < 5) {
      apiResponse.items = apiResponse.items.filter((item) =>
        params.selectedStatuses.includes(item.status)
      )
    }
  }

  return apiResponse
}

export function useWorkflows(subnetId?: string) {
  const filterContext = useWorkflowFilterContext()

  const query = useInfiniteQuery({
    queryKey: [
      "workflows",
      subnetId,
      filterContext.selectedStatuses,
      filterContext.workflowType,
      filterContext.startTimeFrom,
      filterContext.startTimeTo,
      filterContext.sortBy,
      filterContext.pageSize,
    ],
    queryFn: ({ pageParam = 1 }) =>
      fetchWorkflows({
        ...filterContext,
        subnetId,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize)
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
  })

  const workflows = useMemo(() => {
    if (!query.data) return []

    return query.data.pages.flatMap((page) =>
      page.items.map((item) => ({
        id: item.workflowId,
        type: item.type,
        definition: item.definition,
        status: item.status,
        startTime: formatTime(item.startedAt),
        endTime: item.endedAt ? formatTime(item.endedAt) : null,
        duration: formatDuration(item.durationSec),
        durationSec: item.durationSec,
        user: item.creator ? formatAddress(item.creator) : "",
        currentStep: item.currentStep,
        totalSteps: item.totalSteps,
        latestActivityId: item.latestActivityId || "",
      }))
    )
  }, [query.data])

  const lastPage = query.data?.pages[query.data.pages.length - 1]

  return {
    data: workflows,
    isLoading: query.isLoading,
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    total: lastPage?.total ?? 0,
  }
}
