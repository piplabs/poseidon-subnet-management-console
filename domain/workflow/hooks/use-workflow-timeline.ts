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
  // This timeline should match the activities from useWorkflow hook
  const now = Date.now()
  const workflowStart = now - 8 * 60 * 1000 // Started 8 minutes ago

  return [
    {
      id: "0x1a2b3c4d5e6f7890abcdef1234567890",
      name: "Step 0: ValidateInput",
      startTime: workflowStart + 60 * 1000,
      endTime: workflowStart + 60 * 1000 + 90 * 1000, // 90s duration
      status: "success",
    },
    {
      id: "0x2b3c4d5e6f7890abcdef1234567890ab",
      name: "Step 1: ProcessData",
      startTime: workflowStart + 60 * 1000 + 90 * 1000 + 10 * 1000,
      endTime: workflowStart + 60 * 1000 + 90 * 1000 + 10 * 1000 + 120 * 1000, // 120s duration
      status: "success",
    },
    {
      id: "0x3c4d5e6f7890abcdef1234567890abcd",
      name: "Step 2: TransformData",
      startTime: workflowStart + 60 * 1000 + 90 * 1000 + 10 * 1000 + 120 * 1000 + 15 * 1000,
      endTime: workflowStart + 60 * 1000 + 90 * 1000 + 10 * 1000 + 120 * 1000 + 15 * 1000 + 150 * 1000, // 150s duration
      status: "success",
    },
    {
      id: "0x4d5e6f7890abcdef1234567890abcdef",
      name: "Step 3: GenerateOutput",
      startTime: workflowStart + 60 * 1000 + 90 * 1000 + 10 * 1000 + 120 * 1000 + 15 * 1000 + 150 * 1000 + 5 * 1000,
      endTime: now, // Currently running
      status: "running",
    },
    {
      id: "0x5e6f7890abcdef1234567890abcdef12",
      name: "Step 4: ValidateOutput",
      startTime: 0,
      endTime: 0,
      status: "pending",
    },
    {
      id: "0x6f7890abcdef1234567890abcdef1234",
      name: "Step 5: SendNotification",
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
