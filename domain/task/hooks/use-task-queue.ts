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
  // TODO: Replace with actual API call to GET /api/v1/queues/{queueId}
  // This endpoint is MISSING in current API design - needs to be implemented
  // const response = await fetch(`/api/v1/queues/${queueId}`)
  // return await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Replace with actual API response
  return {
    id: queueId,
    name: "chutes-default",
    pendingActivities: 15,
    activeWorkers: 5,
    averageWaitTime: "45s",
    throughput: "12 activities/min",
    currentDepth: 15,
    createdAt: "2024-01-15",
    oldestPendingActivity: "2 minutes ago",
  }
}

export function useTaskQueue(queueId: string) {
  return useQuery({
    queryKey: ["taskQueue", queueId],
    queryFn: () => fetchTaskQueue(queueId),
    enabled: !!queueId,
  })
}
