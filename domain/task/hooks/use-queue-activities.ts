import { useQuery } from "@tanstack/react-query"

export interface QueueActivity {
  id: string
  name: string
  type: string
  workflowId: string
  workflowName: string
  status: "running" | "pending"
  queuedAt: string
}

async function fetchQueueActivities(queueId: string): Promise<QueueActivity[]> {
  // TODO: Replace with actual API call to GET /api/v1/queues?queueId={queueId}&include=activities
  // const response = await fetch(`/api/v1/queues?queueId=${queueId}&include=activities`)
  // const data = await response.json()
  // return data.items[0].activities // Extract activities from first queue

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 900))

  // MOCK DATA - Simulating API response structure with include=activities
  const apiResponse = {
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

  // Transform API response to FE format
  const activities = apiResponse.items[0].activities
  const workflows = apiResponse.items[0].workflows

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
