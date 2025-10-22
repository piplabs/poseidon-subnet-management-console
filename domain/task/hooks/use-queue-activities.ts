import { useQuery } from "@tanstack/react-query"
import { getApiUrl, isApiConfigured } from "@/lib/env"

export interface QueueActivity {
  id: string
  name: string
  type: string
  workflowId: string
  workflowName: string
  status: "running" | "pending"
  queuedAt: string
}

// API Response from GET /api/v1/queues?include=activities,workflows
interface ApiQueueActivityResponse {
  items: Array<{
    queueId: string
    partitionCount: number
    createdAt: string
    pendingActivities: number
    throughputPerMin: number
    avgWaitSec: number
    oldestPendingSince: string
    activities?: Array<{
      activityId: string
      workflowId: string
      type: string
      status: string
      startedAt: string
      worker: string | null
    }>
    workflows?: Array<{
      workflowId: string
      type: string
      status: string
      creator: string
      startedAt: string
    }>
  }>
  page: number
  pageSize: number
  total: number
}

async function fetchQueueActivities(queueId: string): Promise<QueueActivity[]> {
  let apiResponse: ApiQueueActivityResponse

  // Use actual API if configured, otherwise use mock data
  if (isApiConfigured()) {
    const url = getApiUrl(`/api/v1/queues?queueId=${encodeURIComponent(queueId)}&include=activities`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch queue activities: ${response.statusText}`)
    }

    apiResponse = await response.json()
    // Check if the queue was found in the response
    if (!apiResponse.items || apiResponse.items.length === 0) {
      throw new Error(`Queue with id ${queueId} not found`)
    }
  } else {
    // Simulate API delay for mock data
    await new Promise((resolve) => setTimeout(resolve, 900))

    // MOCK DATA - Used when API is not configured
    apiResponse = {
      items: [
        {
          queueId: queueId,
          partitionCount: 4,
          createdAt: "2025-10-01T00:00:00Z",
          pendingActivities: 5,
          throughputPerMin: 180,
          avgWaitSec: 6.3,
          oldestPendingSince: "2025-10-10T04:20:10Z",
          activities: [
            {
              activityId: "0xactivity123",
              workflowId: "0xworkflowAAA",
              type: "VideoEncode",
              status: "Pending",
              startedAt: "2025-10-10T04:18:00Z",
              worker: null
            },
            {
              activityId: "0xactivity124",
              workflowId: "0xworkflowBBB",
              type: "VideoSegment",
              status: "Running",
              startedAt: "2025-10-10T04:19:32Z",
              worker: "0xworker999"
            },
            {
              activityId: "0xactivity125",
              workflowId: "0xworkflowCCC",
              type: "AudioProcess",
              status: "Pending",
              startedAt: "2025-10-10T04:20:00Z",
              worker: null
            }
          ],
          workflows: [
            {
              workflowId: "0xworkflowAAA",
              type: "VideoTranscode",
              status: "Running",
              creator: "0xuser123",
              startedAt: "2025-10-10T04:17:00Z"
            },
            {
              workflowId: "0xworkflowBBB",
              type: "VideoTranscode",
              status: "Running",
              creator: "0xuser456",
              startedAt: "2025-10-10T04:18:30Z"
            }
          ]
        }
      ],
      page: 1,
      pageSize: 10,
      total: 1
    }
  }

  // Transform API response to FE format
  const activities = apiResponse.items[0].activities || []
  const workflows = apiResponse.items[0].workflows || []

  return activities.map(activity => {
    const workflow = workflows.find(w => w.workflowId === activity.workflowId)
    const status = activity.status.toLowerCase() as "running" | "pending"

    return {
      id: activity.activityId,
      name: activity.type,
      type: activity.type,
      workflowId: activity.workflowId,
      workflowName: workflow?.type || "Unknown",
      status: status,
      queuedAt: new Date(activity.startedAt).toLocaleTimeString(),
    }
  })
}

export function useQueueActivities(queueId: string) {
  return useQuery({
    queryKey: ["queueActivities", queueId],
    queryFn: () => fetchQueueActivities(queueId),
    enabled: !!queueId,
  })
}
