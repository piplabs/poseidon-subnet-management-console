import { useQuery } from "@tanstack/react-query"

export interface WorkflowActivity {
  id: string
  name: string
  status: "completed" | "running" | "pending" | "failed"
  duration: string
  worker: string
}

export interface WorkflowWorker {
  id: string
  status: "active" | "inactive"
  currentActivity: string
  tasksCompleted: number
}

export interface WorkflowDetails {
  id: string
  type: string
  status: "running" | "succeeded" | "failed" | "cancelled" | "pending"
  startTime: string
  duration: string
  user: string
  activities: WorkflowActivity[]
  workers: WorkflowWorker[]
}

async function fetchWorkflow(workflowId: string): Promise<WorkflowDetails> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/workflows/${workflowId}`)
  return {
    id: workflowId,
    type: "Payment Processing",
    status: "running",
    startTime: "14:30:15",
    duration: "5m 23s",
    user: "system",
    activities: [
      {
        id: "act-001",
        name: "ValidatePayment",
        status: "completed",
        duration: "1m 23s",
        worker: "worker-001",
      },
      {
        id: "act-002",
        name: "ProcessTransaction",
        status: "running",
        duration: "2m 15s",
        worker: "worker-002",
      },
      {
        id: "act-003",
        name: "SendConfirmation",
        status: "pending",
        duration: "-",
        worker: "-",
      },
    ],
    workers: [
      {
        id: "worker-001",
        status: "active",
        currentActivity: "ProcessTransaction",
        tasksCompleted: 145,
      },
      {
        id: "worker-002",
        status: "active",
        currentActivity: "ValidatePayment",
        tasksCompleted: 132,
      },
    ],
  }
}

export function useWorkflow(workflowId: string) {
  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId),
    enabled: !!workflowId,
  })
}
