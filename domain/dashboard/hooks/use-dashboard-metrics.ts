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

async function fetchDashboardMetrics(subnetId?: string): Promise<DashboardMetrics> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/subnets/${subnetId}/metrics`)
  return {
    activeWorkers: 24,
    idleWorkers: 8,
    totalStaked: "1.2M",
    stakingCurrency: "ETH",
    workflowRuns: 234,
    workflowSuccessRate: "96.5%",
    avgCompletionTime: "8.5m",
    activitySuccessRate: "97.8%",
  }
}

export function useDashboardMetrics(subnetId?: string) {
  return useQuery({
    queryKey: ["dashboardMetrics", subnetId],
    queryFn: () => fetchDashboardMetrics(subnetId),
  })
}
