import { useQuery } from "@tanstack/react-query"

export interface TimelineEvent {
  id: string
  name: string
  startTime: number // milliseconds
  endTime: number // milliseconds
  status: "success" | "error" | "running" | "pending"
}

async function fetchWorkflowTimeline(workflowId: string): Promise<TimelineEvent[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/workflows/${workflowId}/timeline`)
  const now = Date.now()
  return [
    {
      id: "event-001",
      name: "ValidatePayment",
      startTime: now - 300000,
      endTime: now - 240000,
      status: "success",
    },
    {
      id: "event-002",
      name: "ProcessTransaction",
      startTime: now - 240000,
      endTime: now,
      status: "running",
    },
    {
      id: "event-003",
      name: "SendConfirmation",
      startTime: 0,
      endTime: 0,
      status: "pending",
    },
  ]
}

export function useWorkflowTimeline(workflowId: string) {
  return useQuery({
    queryKey: ["workflowTimeline", workflowId],
    queryFn: () => fetchWorkflowTimeline(workflowId),
    enabled: !!workflowId,
  })
}
