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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data - replace with actual API call
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
