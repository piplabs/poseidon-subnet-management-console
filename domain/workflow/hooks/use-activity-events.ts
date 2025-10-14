import { useQuery } from "@tanstack/react-query"

export interface ActivityEvent {
  id: string
  type: string
  timestamp: string
  status: "success" | "error" | "info" | "pending"
  message: string
}

async function fetchActivityEvents(activityId: string): Promise<ActivityEvent[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/activities/${activityId}/events`)
  return [
    {
      id: "evt-001",
      type: "ActivityStarted",
      timestamp: "14:30:15",
      status: "info",
      message: "Activity ValidatePayment started on worker-001",
    },
    {
      id: "evt-002",
      type: "ValidationCheck",
      timestamp: "14:30:16",
      status: "info",
      message: "Validating payment credentials",
    },
    {
      id: "evt-003",
      type: "ValidationSuccess",
      timestamp: "14:30:45",
      status: "success",
      message: "Payment credentials validated successfully",
    },
    {
      id: "evt-004",
      type: "DataProcessing",
      timestamp: "14:31:00",
      status: "info",
      message: "Processing payment data",
    },
    {
      id: "evt-005",
      type: "TransactionCreated",
      timestamp: "14:31:30",
      status: "success",
      message: "Transaction txn-98765 created successfully",
    },
    {
      id: "evt-006",
      type: "ActivityCompleted",
      timestamp: "14:31:38",
      status: "success",
      message: "Activity ValidatePayment completed successfully",
    },
  ]
}

export function useActivityEvents(activityId: string) {
  return useQuery({
    queryKey: ["activityEvents", activityId],
    queryFn: () => fetchActivityEvents(activityId),
    enabled: !!activityId,
  })
}
