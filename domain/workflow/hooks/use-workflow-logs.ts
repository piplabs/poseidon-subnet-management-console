import { useQuery } from "@tanstack/react-query"

export interface WorkflowLog {
  timestamp: string
  level: "info" | "error" | "warning"
  message: string
}

async function fetchWorkflowLogs(workflowId: string): Promise<WorkflowLog[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/workflows/${workflowId}/logs`)
  return [
    {
      timestamp: "14:30:15.123",
      level: "info",
      message: "Workflow started",
    },
    {
      timestamp: "14:30:15.456",
      level: "info",
      message: "Activity 'ValidatePayment' started",
    },
    {
      timestamp: "14:31:38.789",
      level: "info",
      message: "Activity 'ValidatePayment' completed successfully",
    },
    {
      timestamp: "14:31:39.012",
      level: "info",
      message: "Activity 'ProcessTransaction' started",
    },
    {
      timestamp: "14:32:45.345",
      level: "warning",
      message: "Retrying transaction due to network timeout",
    },
  ]
}

export function useWorkflowLogs(workflowId: string) {
  return useQuery({
    queryKey: ["workflowLogs", workflowId],
    queryFn: () => fetchWorkflowLogs(workflowId),
    enabled: !!workflowId,
    refetchInterval: 5000, // Refresh every 5 seconds for live logs
  })
}
