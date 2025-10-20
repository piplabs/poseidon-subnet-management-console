import { useQuery } from "@tanstack/react-query"

export interface TimelineEvent {
  id: string
  name: string
  startTime: number // milliseconds
  endTime: number // milliseconds
  status: "success" | "error" | "running" | "pending"
}

async function fetchWorkflowTimeline(workflowId: string): Promise<TimelineEvent[]> {
  // TODO: Replace with actual API call to GET /api/v1/workflows/{workflowId}/events
  // const response = await fetch(`/api/v1/workflows/${workflowId}/events`)
  // const apiResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // MOCK DATA - Replace with actual API response
  const now = Date.now()
  const workflowStart = now - 500 // Workflow started 500ms ago
  return [
    {
      id: "event-001",
      name: "ValidatePayment",
      startTime: workflowStart,
      endTime: workflowStart + 125, // 125ms duration
      status: "success",
    },
    {
      id: "event-002",
      name: "ProcessTransaction",
      startTime: workflowStart + 135, // 10ms gap
      endTime: workflowStart + 280, // 145ms duration
      status: "success",
    },
    {
      id: "event-003",
      name: "SendConfirmation",
      startTime: workflowStart + 290, // 10ms gap
      endTime: workflowStart + 400, // 110ms duration
      status: "running",
    },
    {
      id: "event-004",
      name: "UpdateInventory",
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
