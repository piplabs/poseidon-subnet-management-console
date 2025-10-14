import { useQuery } from "@tanstack/react-query"

export interface DashboardMetrics {
  activeWorkers: number
  idleWorkers: number
  totalStaked: string
  stakingCurrency: string
  workflowRuns: number
  workflowSuccessRate: string
  avgCompletionTime: string
  activitySuccessRate: string
}

// API Response from GET /api/v1/metrics/overview
interface ApiMetricsResponse {
  activeWorkers: number
  totalStaked: string
  totalWorkflows: {
    started: number
    active: number
    completed: number
    failed: number
  }
  workflowSuccessRate: number
  activitySuccessRate: number
  avgWorkflowDurationSec: number
  p95WorkflowDurationSec: number
}

async function fetchDashboardMetrics(subnetId?: string): Promise<DashboardMetrics> {
  // TODO: Replace with actual API call to GET /api/v1/metrics/overview
  // const response = await fetch(`/api/v1/metrics/overview`)
  // const apiResponse: ApiMetricsResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // MOCK DATA - Replace with actual API response
  const apiResponse: ApiMetricsResponse = {
    activeWorkers: 124,
    totalStaked: "32145.89",
    totalWorkflows: {
      started: 4021,
      active: 312,
      completed: 3510,
      failed: 199,
    },
    workflowSuccessRate: 94.6,
    activitySuccessRate: 96.2,
    avgWorkflowDurationSec: 128,
    p95WorkflowDurationSec: 540,
  }

  // Transform to FE format
  const totalWorkflows = apiResponse.totalWorkflows.started

  // TODO: Get idle workers count from GET /api/v1/workers API
  // Filter workers with status "idle" or calculate based on actual worker data
  const idleWorkers = Math.floor(apiResponse.activeWorkers * 0.25) // TEMPORARY: Estimate idle workers

  return {
    activeWorkers: apiResponse.activeWorkers,
    idleWorkers,
    totalStaked: `${(parseFloat(apiResponse.totalStaked) / 1000).toFixed(1)}K`,
    stakingCurrency: "ETH",
    workflowRuns: totalWorkflows,
    workflowSuccessRate: `${apiResponse.workflowSuccessRate.toFixed(1)}%`,
    avgCompletionTime: `${Math.floor(apiResponse.avgWorkflowDurationSec / 60)}m ${apiResponse.avgWorkflowDurationSec % 60}s`,
    activitySuccessRate: `${apiResponse.activitySuccessRate.toFixed(1)}%`,
  }
}

export function useDashboardMetrics(subnetId?: string) {
  return useQuery({
    queryKey: ["dashboardMetrics", subnetId],
    queryFn: () => fetchDashboardMetrics(subnetId),
  })
}
