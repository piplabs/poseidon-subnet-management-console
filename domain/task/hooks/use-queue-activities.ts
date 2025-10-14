import { useQuery } from "@tanstack/react-query"

export interface QueueActivity {
  id: string
  name: string
  type: string
  workflowId: string
  workflowName: string
  status: "running" | "pending"
  queuedAt: string
  priority: "high" | "normal" | "low"
  estimatedDuration: string
}

async function fetchQueueActivities(queueId: string): Promise<QueueActivity[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Mock data - replace with actual API call
  return [
    {
      id: "act-001",
      name: "ProcessPayment",
      type: "Activity",
      workflowId: "wf-001",
      workflowName: "Payment Processing",
      status: "running",
      queuedAt: "2 minutes ago",
      priority: "high",
      estimatedDuration: "30s",
    },
    {
      id: "act-002",
      name: "SendNotification",
      type: "Activity",
      workflowId: "wf-002",
      workflowName: "User Notification",
      status: "pending",
      queuedAt: "3 minutes ago",
      priority: "normal",
      estimatedDuration: "15s",
    },
    {
      id: "act-003",
      name: "ValidateData",
      type: "Activity",
      workflowId: "wf-003",
      workflowName: "Data Validation",
      status: "pending",
      queuedAt: "4 minutes ago",
      priority: "low",
      estimatedDuration: "1m",
    },
    {
      id: "act-004",
      name: "GenerateReport",
      type: "Activity",
      workflowId: "wf-004",
      workflowName: "Reporting",
      status: "pending",
      queuedAt: "5 minutes ago",
      priority: "normal",
      estimatedDuration: "2m",
    },
    {
      id: "act-005",
      name: "UpdateDatabase",
      type: "Activity",
      workflowId: "wf-005",
      workflowName: "Database Update",
      status: "pending",
      queuedAt: "6 minutes ago",
      priority: "high",
      estimatedDuration: "45s",
    },
  ]
}

export function useQueueActivities(queueId: string) {
  return useQuery({
    queryKey: ["queueActivities", queueId],
    queryFn: () => fetchQueueActivities(queueId),
    enabled: !!queueId,
  })
}
