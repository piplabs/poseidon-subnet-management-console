import { useQuery } from "@tanstack/react-query"

export interface TaskQueue {
  id: string
  name: string
  pendingActivities: number
  oldestPendingActivity: string
  averageWaitTime: string
  throughput: string
  currentDepth: number
  createdAt: string
}

async function fetchTaskQueues(): Promise<TaskQueue[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data - replace with actual API call
  return [
    {
      id: "queue-001",
      name: "chutes-default",
      pendingActivities: 15,
      oldestPendingActivity: "2 minutes ago",
      averageWaitTime: "45s",
      throughput: "12/min",
      currentDepth: 15,
      createdAt: "2024-01-15 10:30:00",
    },
    {
      id: "queue-002",
      name: "chutes-priority",
      pendingActivities: 3,
      oldestPendingActivity: "30 seconds ago",
      averageWaitTime: "15s",
      throughput: "25/min",
      currentDepth: 3,
      createdAt: "2024-01-15 11:00:00",
    },
    {
      id: "queue-003",
      name: "chutes-batch",
      pendingActivities: 45,
      oldestPendingActivity: "5 minutes ago",
      averageWaitTime: "2m 30s",
      throughput: "8/min",
      currentDepth: 45,
      createdAt: "2024-01-15 09:15:00",
    },
    {
      id: "queue-004",
      name: "chutes-workflow",
      pendingActivities: 8,
      oldestPendingActivity: "1 minute ago",
      averageWaitTime: "30s",
      throughput: "15/min",
      currentDepth: 8,
      createdAt: "2024-01-15 12:00:00",
    },
    {
      id: "queue-005",
      name: "chutes-async",
      pendingActivities: 22,
      oldestPendingActivity: "3 minutes ago",
      averageWaitTime: "1m 15s",
      throughput: "10/min",
      currentDepth: 22,
      createdAt: "2024-01-15 08:45:00",
    },
  ]
}

export function useTaskQueues() {
  return useQuery({
    queryKey: ["taskQueues"],
    queryFn: fetchTaskQueues,
  })
}
