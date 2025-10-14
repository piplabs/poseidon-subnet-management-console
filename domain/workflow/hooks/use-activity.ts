import { useQuery } from "@tanstack/react-query"

export interface ActivityDetails {
  id: string
  name: string
  status: "completed" | "running" | "pending" | "failed"
  workflowId: string
  workflowName: string
  startTime: string
  endTime: string
  duration: string
  worker: string
  input: object
  output: object
  error: object | null
}

async function fetchActivity(activityId: string): Promise<ActivityDetails> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 750))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/activities/${activityId}`)
  return {
    id: activityId,
    name: "ValidatePayment",
    status: "completed",
    workflowId: "wf-001",
    workflowName: "Payment Processing",
    startTime: "14:30:15",
    endTime: "14:31:38",
    duration: "1m 23s",
    worker: "worker-001",
    input: {
      paymentId: "pay-12345",
      amount: 150.00,
      currency: "USD",
      customerId: "cust-67890",
    },
    output: {
      validationStatus: "success",
      transactionId: "txn-98765",
      processedAt: "2024-01-15T14:31:38Z",
    },
    error: null,
  }
}

export function useActivity(activityId: string) {
  return useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => fetchActivity(activityId),
    enabled: !!activityId,
  })
}
