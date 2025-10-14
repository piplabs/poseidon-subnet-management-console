import { useQuery } from "@tanstack/react-query"

export interface WorkerActivity {
  id: string
  workflow: string
  name: string
  status: "completed" | "running" | "pending" | "failed"
  startTime: string
}

export interface WorkerDetails {
  id: string
  status: "active" | "inactive"
  address: string
  uptime: string
  tasksCompleted: number
  currentTask: string
  taskQueue: number
  lastHeartbeat: string
  version: string
  resources: {
    cpu: number
    memory: number
    disk: number
  }
  recentActivities: WorkerActivity[]
}

async function fetchWorker(workerId: string): Promise<WorkerDetails> {
  // TODO: Replace with actual API call to GET /api/v1/workers/{workerId}
  // const response = await fetch(`/api/v1/workers/${workerId}`)
  // const apiResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Replace with actual API response
  return {
    id: workerId,
    status: "active",
    address: "192.168.1.100:8080",
    uptime: "23h 45m",
    tasksCompleted: 145,
    currentTask: "ProcessTransaction",
    taskQueue: 3,
    lastHeartbeat: "2s ago",
    version: "1.2.4",
    resources: {
      cpu: 45,
      memory: 62,
      disk: 38,
    },
    recentActivities: [
      {
        id: "act-001",
        workflow: "Payment Processing",
        name: "ValidatePayment",
        status: "completed",
        startTime: "14:30:15",
      },
      {
        id: "act-002",
        workflow: "Payment Processing",
        name: "ProcessTransaction",
        status: "running",
        startTime: "14:31:38",
      },
      {
        id: "act-005",
        workflow: "Data Validation",
        name: "TransformData",
        status: "completed",
        startTime: "14:25:45",
      },
      {
        id: "act-008",
        workflow: "User Onboarding",
        name: "CreateUserAccount",
        status: "completed",
        startTime: "14:15:45",
      },
      {
        id: "act-009",
        workflow: "Report Generation",
        name: "CompileData",
        status: "failed",
        startTime: "14:10:20",
      },
    ],
  }
}

export function useWorker(workerId: string) {
  return useQuery({
    queryKey: ["worker", workerId],
    queryFn: () => fetchWorker(workerId),
    enabled: !!workerId,
  })
}
