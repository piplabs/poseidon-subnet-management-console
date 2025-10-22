import { useMemo } from "react"
import { useWorkflow } from "./use-workflow"
import type { ActivityStatus } from "@/lib/api/types"

export interface TimelineEvent {
  id: string
  name: string
  startTime: number // milliseconds
  endTime: number // milliseconds
  status: "success" | "error" | "running" | "pending"
}

// Map ActivityStatus to timeline status
function mapActivityStatus(status: ActivityStatus): TimelineEvent["status"] {
  switch (status) {
    case "Completed":
      return "success"
    case "Failed":
      return "error"
    case "Running":
      return "running"
    case "Pending":
    case "Scheduled":
    case "Claimed":
      return "pending"
    default:
      return "pending"
  }
}

/**
 * Uses workflow detail data (activities) to build timeline events
 * No separate API call needed - data comes from workflow detail endpoint
 */
export function useWorkflowTimeline(workflowId: string) {
  const workflowQuery = useWorkflow(workflowId)

  const timelineEvents = useMemo(() => {
    if (!workflowQuery.data || !workflowQuery.data.activities) {
      return []
    }

    // Transform activities into timeline events
    return workflowQuery.data.activities.map((activity) => {
      console.log("activity", activity)
      const startTime = new Date(activity.startedAt).getTime()
      const endTime = activity.completedAt
        ? new Date(activity.completedAt).getTime()
        : 0

      return {
        id: activity.activityId,
        name: `Step ${activity.stepIndex + 1}`,
        startTime,
        endTime,
        status: mapActivityStatus(activity.status),
      }
    })
  }, [workflowQuery.data])

  return {
    data: timelineEvents,
    isLoading: workflowQuery.isLoading,
    error: workflowQuery.error,
  }
}
