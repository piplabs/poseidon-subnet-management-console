import { useQuery } from "@tanstack/react-query"
import { getApiUrl, isApiConfigured } from "@/lib/env"

export interface TaskQueueDetails {
  id: string
  name: string
  pendingActivities: number
  activeWorkers: number
  averageWaitTime: string
  throughput: string
  currentDepth: number
  createdAt: string
  oldestPendingActivity: string
}

// API Response from GET /api/v1/queues
interface ApiQueueResponse {
  items: Array<{
    queueId: string
    partitionCount: number
    createdAt: string
    pendingActivities: number
    throughputPerMin: number
    avgWaitSec: number
    oldestPendingSince: string
  }>
  page: number
  pageSize: number
  total: number
}

function calculateTimeAgo(timestamp: string): string {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return "just now"
  if (diffMinutes === 1) return "1 minute ago"
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "1 day ago"
  return `${diffDays} days ago`
}

async function fetchTaskQueue(queueId: string): Promise<TaskQueueDetails> {
  let apiResponse: ApiQueueResponse

  // Use actual API if configured, otherwise use mock data
  if (isApiConfigured()) {
    const url = getApiUrl(`/api/v1/queues?queueId=${encodeURIComponent(queueId)}`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch task queue: ${response.statusText}`)
    }

    apiResponse = await response.json()

    // Check if the queue was found in the response
    if (!apiResponse.items || apiResponse.items.length === 0) {
      throw new Error(`Queue with id ${queueId} not found`)
    }
  } else {
    // Simulate API delay for mock data
    await new Promise((resolve) => setTimeout(resolve, 800))

    // MOCK DATA - Used when API is not configured
    apiResponse = {
      items: [
        {
          queueId: queueId,
          partitionCount: 4,
          createdAt: "2025-10-01T00:00:00Z",
          pendingActivities: 15,
          throughputPerMin: 180,
          avgWaitSec: 6.3,
          oldestPendingSince: "2025-10-10T04:20:10Z",
        }
      ],
      page: 1,
      pageSize: 10,
      total: 1
    }
  }

  // Transform API response to FE format
  const queue = apiResponse.items[0]
  return {
    id: queue.queueId,
    name: queue.queueId, // API doesn't provide name field yet
    pendingActivities: queue.pendingActivities,
    activeWorkers: 5, // TODO: Not in API response - needs to be added or calculated
    averageWaitTime: `${queue.avgWaitSec}s`,
    throughput: `${queue.throughputPerMin}/min`,
    currentDepth: queue.pendingActivities,
    createdAt: new Date(queue.createdAt).toLocaleDateString(),
    oldestPendingActivity: calculateTimeAgo(queue.oldestPendingSince),
  }
}

export function useTaskQueue(queueId: string) {
  return useQuery({
    queryKey: ["taskQueue", queueId],
    queryFn: () => fetchTaskQueue(queueId),
    enabled: !!queueId,
  })
}
