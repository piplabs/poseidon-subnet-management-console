import { useQuery } from "@tanstack/react-query"

export interface TimeSeriesData {
  time: string
  value: number
}

async function fetchWorkflowTimeSeries(
  subnetId?: string,
  timeRange?: string
): Promise<TimeSeriesData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Mock data - replace with actual API call
  // TODO: Replace with: const response = await fetch(`/api/subnets/${subnetId}/workflow-time-series?range=${timeRange}`)
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    value: 10 + i * 5,
  }))
}

export function useWorkflowTimeSeries(subnetId?: string, timeRange: string = "24h") {
  return useQuery({
    queryKey: ["workflowTimeSeries", subnetId, timeRange],
    queryFn: () => fetchWorkflowTimeSeries(subnetId, timeRange),
  })
}
