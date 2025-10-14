import { useQuery } from "@tanstack/react-query"

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

async function fetchTaskQueue(queueId: string): Promise<TaskQueueDetails> {
  // TODO: Replace with actual API call to GET /api/v1/queues?queueId={queueId}
  // const response = await fetch(`/api/v1/queues?queueId=${queueId}`)
  // const data = await response.json()
  // return data.items[0] // Extract first item from array

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Simulating API response structure: { items: [...] }
  const apiResponse = {
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

  // Transform API response to FE format
  const queue = apiResponse.items[0]
  return {
    id: queue.queueId,
    name: queue.queueId, // API doesn't provide name field yet
    pendingActivities: queue.pendingActivities,
    activeWorkers: 5, // Not in API response
    averageWaitTime: `${queue.avgWaitSec}s`,
    throughput: `${queue.throughputPerMin}/min`,
    currentDepth: queue.pendingActivities,
    createdAt: new Date(queue.createdAt).toLocaleDateString(),
    oldestPendingActivity: "2 minutes ago", // Would need to calculate from oldestPendingSince
  }
}

export function useTaskQueue(queueId: string) {
  return useQuery({
    queryKey: ["taskQueue", queueId],
    queryFn: () => fetchTaskQueue(queueId),
    enabled: !!queueId,
  })
}
