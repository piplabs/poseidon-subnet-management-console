import { useQuery } from "@tanstack/react-query"

export interface Activity {
  id: string
  name: string
  workflowId: string
  status: "completed" | "running" | "pending" | "failed"
  startTime: string
  duration: string
  worker: string
}

async function fetchActivities(): Promise<Activity[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 850))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch('/api/activities')
  return [
    {
      id: "act-001",
      name: "ValidatePayment",
      workflowId: "wf-001",
      status: "completed",
      startTime: "14:30:15",
      duration: "1m 23s",
      worker: "worker-001",
    },
    {
      id: "act-002",
      name: "ProcessTransaction",
      workflowId: "wf-001",
      status: "running",
      startTime: "14:31:38",
      duration: "2m 15s",
      worker: "worker-002",
    },
    {
      id: "act-003",
      name: "SendConfirmation",
      workflowId: "wf-001",
      status: "pending",
      startTime: "-",
      duration: "-",
      worker: "-",
    },
    {
      id: "act-004",
      name: "ValidateData",
      workflowId: "wf-002",
      status: "completed",
      startTime: "14:25:00",
      duration: "45s",
      worker: "worker-003",
    },
    {
      id: "act-005",
      name: "TransformData",
      workflowId: "wf-002",
      status: "completed",
      startTime: "14:25:45",
      duration: "1m 30s",
      worker: "worker-001",
    },
    {
      id: "act-006",
      name: "SaveData",
      workflowId: "wf-002",
      status: "completed",
      startTime: "14:27:15",
      duration: "1m 30s",
      worker: "worker-002",
    },
    {
      id: "act-007",
      name: "GenerateReport",
      workflowId: "wf-003",
      status: "failed",
      startTime: "14:20:30",
      duration: "2m 10s",
      worker: "worker-004",
    },
    {
      id: "act-008",
      name: "CreateUserAccount",
      workflowId: "wf-004",
      status: "completed",
      startTime: "14:15:45",
      duration: "2m 10s",
      worker: "worker-001",
    },
  ]
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => fetchActivities(),
  })
}
