import { useQuery } from "@tanstack/react-query"

export interface Workflow {
  id: string
  type: string
  status: "running" | "succeeded" | "failed" | "cancelled" | "pending"
  startTime: string
  duration: string
  user: string
  activities: number
}

async function fetchWorkflows(subnetId?: string): Promise<Workflow[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data - replace with actual API call
  return [
    {
      id: "wf-001",
      type: "Payment Processing",
      status: "running",
      startTime: "14:30:15",
      duration: "5m 23s",
      user: "system",
      activities: 12,
    },
    {
      id: "wf-002",
      type: "Data Validation",
      status: "succeeded",
      startTime: "14:25:00",
      duration: "3m 45s",
      user: "admin",
      activities: 8,
    },
    {
      id: "wf-003",
      type: "Report Generation",
      status: "failed",
      startTime: "14:20:30",
      duration: "2m 10s",
      user: "system",
      activities: 5,
    },
    {
      id: "wf-004",
      type: "User Onboarding",
      status: "succeeded",
      startTime: "14:15:45",
      duration: "8m 30s",
      user: "admin",
      activities: 15,
    },
    {
      id: "wf-005",
      type: "Batch Processing",
      status: "pending",
      startTime: "14:35:00",
      duration: "-",
      user: "system",
      activities: 0,
    },
  ]
}

export function useWorkflows(subnetId?: string) {
  return useQuery({
    queryKey: ["workflows", subnetId],
    queryFn: () => fetchWorkflows(subnetId),
  })
}
