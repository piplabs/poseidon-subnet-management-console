import { useQuery } from "@tanstack/react-query"
import type { QueueListResponse } from "@/lib/api/types"
import {
  formatRelativeTime,
  formatWaitTime,
  formatThroughput,
} from "@/lib/api/transforms"

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
  oldestPendingRelative: string
  averageWaitTime: string
  throughput: string
}

async function fetchTaskQueues(): Promise<TaskQueue[]> {
  // TODO: Replace with actual API call to GET /api/v1/queues
  // const response = await fetch(`/api/v1/queues?page=1&pageSize=50`)
  // const apiResponse: QueueListResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // MOCK DATA - Replace with actual API response
  const apiResponse: QueueListResponse = {
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
    page: 1,
    pageSize: 50,
    total: 5,
  }

  // Transform to FE format
  return apiResponse.items.map((item) => ({
    id: item.queueId,
    partitionCount: item.partitionCount,
    pendingActivities: item.pendingActivities,
    oldestPendingSince: item.oldestPendingSince,
    avgWaitSec: item.avgWaitSec,
    throughputPerMin: item.throughputPerMin,
    createdAt: item.createdAt,
    // Display-only fields
    name: item.queueId,
    oldestPendingRelative: formatRelativeTime(item.oldestPendingSince),
    averageWaitTime: formatWaitTime(item.avgWaitSec),
    throughput: formatThroughput(item.throughputPerMin),
  }))
}

export function useTaskQueues() {
  return useQuery({
    queryKey: ["taskQueues"],
    queryFn: fetchTaskQueues,
  })
}
