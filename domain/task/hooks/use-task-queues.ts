import { useInfiniteQuery } from "@tanstack/react-query"
import type { QueueListResponse } from "@/lib/api/types"
import {
  formatRelativeTime,
  formatWaitTime,
  formatThroughput,
  formatDateTime,
} from "@/lib/api/transforms"
import { useTaskQueueFilterContext } from "../contexts/task-queue-filter-context"
import { useMemo } from "react"
import { getApiUrl, isApiConfigured } from "@/lib/env"

export interface TaskQueue {
  id: string
  partitionCount: number
  pendingActivities: number
  oldestPendingSince: string
  avgWaitSec: number
  throughputPerMin: number
  createdAt: string
  // Display-only fields (formatted)
  name: string
  oldestPendingActivity: string
  averageWaitTime: string
  throughput: string
  currentDepth: number
  createdAtFormatted: string
}

async function fetchTaskQueues(params: {
  queueId?: string
  includeActivities: boolean
  includeWorkflows: boolean
  page: number
  pageSize: number
  subnetId?: string
}): Promise<QueueListResponse> {
  // Build query parameters
  const queryParams = new URLSearchParams()

  // Add include parameter (comma-separated)
  const includes = []
  if (params.includeActivities) includes.push("activities")
  if (params.includeWorkflows) includes.push("workflows")
  if (includes.length > 0) {
    queryParams.append("include", includes.join(","))
  }

  if (params.queueId) {
    queryParams.append("queueId", params.queueId)
  }

  queryParams.append("page", params.page.toString())
  queryParams.append("pageSize", params.pageSize.toString())

  if (params.subnetId) {
    queryParams.append("subnetId", params.subnetId)
  }

  let apiResponse: QueueListResponse

  // Use actual API if configured, otherwise use mock data
  if (isApiConfigured()) {
    const url = getApiUrl(`/api/v1/queues?${queryParams.toString()}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch task queues: ${response.statusText}`)
    }

    apiResponse = await response.json()
  } else {
    // Simulate API delay for mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // MOCK DATA - Used when API is not configured
    apiResponse = {
    items: [
      {
        queueId: "chutes-default",
        partitionCount: 4,
        pendingActivities: 15,
        oldestPendingSince: "2025-10-16T10:34:00Z",
        avgWaitSec: 45,
        throughputPerMin: 12,
        createdAt: "2025-10-15T10:30:00Z",
      },
      {
        queueId: "chutes-priority",
        partitionCount: 2,
        pendingActivities: 3,
        oldestPendingSince: "2025-10-16T10:35:30Z",
        avgWaitSec: 15,
        throughputPerMin: 25,
        createdAt: "2025-10-15T11:00:00Z",
      },
      {
        queueId: "chutes-batch",
        partitionCount: 8,
        pendingActivities: 45,
        oldestPendingSince: "2025-10-16T10:31:00Z",
        avgWaitSec: 150,
        throughputPerMin: 8,
        createdAt: "2025-10-15T09:15:00Z",
      },
      {
        queueId: "chutes-workflow",
        partitionCount: 4,
        pendingActivities: 8,
        oldestPendingSince: "2025-10-16T10:35:00Z",
        avgWaitSec: 30,
        throughputPerMin: 15,
        createdAt: "2025-10-15T12:00:00Z",
      },
      {
        queueId: "chutes-async",
        partitionCount: 6,
        pendingActivities: 22,
        oldestPendingSince: "2025-10-16T10:33:00Z",
        avgWaitSec: 75,
        throughputPerMin: 10,
        createdAt: "2025-10-15T08:45:00Z",
      },
    ],
      page: params.page, // Use the actual page from params
      pageSize: params.pageSize,
      total: 5,
    }

    // Filter mock data by queueId (for demo purposes)
    if (params.queueId) {
      apiResponse.items = apiResponse.items.filter((item) =>
        item.queueId.toLowerCase().includes(params.queueId!.toLowerCase())
      )
    }
  }

  return apiResponse
}

export function useTaskQueues(subnetId?: string) {
  const filterContext = useTaskQueueFilterContext()

  const query = useInfiniteQuery({
    queryKey: [
      "taskQueues",
      subnetId,
      filterContext.queueId,
      filterContext.includeActivities,
      filterContext.includeWorkflows,
      filterContext.pageSize,
    ],
    queryFn: ({ pageParam = 1 }) =>
      fetchTaskQueues({
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

  const taskQueues = useMemo(() => {
    if (!query.data) return []

    return query.data.pages.flatMap((page) =>
      page.items.map((item) => ({
        id: item.queueId,
        partitionCount: item.partitionCount,
        pendingActivities: item.pendingActivities,
        oldestPendingSince: item.oldestPendingSince,
        avgWaitSec: item.avgWaitSec,
        throughputPerMin: item.throughputPerMin,
        createdAt: item.createdAt,
        // Display-only fields
        name: item.queueId,
        oldestPendingActivity: formatRelativeTime(item.oldestPendingSince),
        averageWaitTime: formatWaitTime(item.avgWaitSec),
        throughput: formatThroughput(item.throughputPerMin),
        currentDepth: item.partitionCount,
        createdAtFormatted: formatDateTime(item.createdAt),
      }))
    )
  }, [query.data])

  const lastPage = query.data?.pages[query.data.pages.length - 1]

  return {
    data: taskQueues,
    isLoading: query.isLoading,
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    total: lastPage?.total ?? 0,
  }
}
