import { useQuery } from "@tanstack/react-query"
import { getApiUrl, isApiConfigured } from "@/lib/env"

export interface DashboardMetrics {
  activeWorkers: number
  idleWorkers: number
  totalStaked: string
  stakingCurrency: string
  workflowRuns: number
  workflowSuccessRate: string
  workflowSuccessRateNumeric: number
  avgCompletionTime: string
  activitySuccessRate: string
  activitySuccessRateNumeric: number
  totalWorkflows: {
    started: number
    active: number
    completed: number
    failed: number
  }
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
  let apiResponse: ApiMetricsResponse
  console.log("isApiConfigured", isApiConfigured())
  // Use actual API if configured, otherwise use mock data
  if (isApiConfigured()) {
    const url = getApiUrl("/api/v1/metrics/overview")
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard metrics: ${response.statusText}`)
    }

    apiResponse = await response.json()
  } else {
    // Simulate API delay for mock data
    await new Promise((resolve) => setTimeout(resolve, 800))

    // MOCK DATA - Used when API is not configured
    apiResponse = {
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
    stakingCurrency: "PSDN",
    workflowRuns: totalWorkflows,
    workflowSuccessRate: `${apiResponse.workflowSuccessRate.toFixed(1)}%`,
    workflowSuccessRateNumeric: apiResponse.workflowSuccessRate,
    avgCompletionTime: `${Math.floor(apiResponse.avgWorkflowDurationSec / 60)}m ${apiResponse.avgWorkflowDurationSec % 60}s`,
    activitySuccessRate: `${apiResponse.activitySuccessRate.toFixed(1)}%`,
    activitySuccessRateNumeric: apiResponse.activitySuccessRate,
    totalWorkflows: apiResponse.totalWorkflows,
  }
}

export function useDashboardMetrics(subnetId?: string) {
  return useQuery({
    queryKey: ["dashboardMetrics", subnetId],
    queryFn: () => fetchDashboardMetrics(subnetId),
  })
}
