import { useMemo } from "react"
import { useWorkflow } from "./use-workflow"
import { formatTime } from "@/lib/api/transforms"

export interface WorkflowLog {
  timestamp: string
  level: "info" | "error" | "warning"
  message: string
}

/**
 * Generates logs from workflow state history and activities
 * Note: This is a derived view from workflow detail data.
 * For actual log files, a dedicated /api/v1/workflows/{id}/logs endpoint would be needed
 */
export function useWorkflowLogs(workflowId: string) {
  const workflowQuery = useWorkflow(workflowId)

  const logs = useMemo(() => {
    if (!workflowQuery.data) {
      return []
    }

    const workflow = workflowQuery.data
    const logEntries: WorkflowLog[] = []

    // Add workflow state transitions as log entries
    if (workflow.stateHistory && workflow.stateHistory.length > 0) {
      workflow.stateHistory.forEach((transition) => {
        logEntries.push({
          timestamp: formatTime(transition.timestamp),
          level: transition.to === "Failed" || transition.to === "Terminated" ? "error" : "info",
          message: `Workflow transitioned from ${transition.from} to ${transition.to}`,
        })
      })
    }

    // Add activity events as log entries
    if (workflow.activities && workflow.activities.length > 0) {
      workflow.activities.forEach((activity) => {
        // Activity started
        logEntries.push({
          timestamp: formatTime(activity.startedAt),
          level: "info",
          message: `Activity Step ${activity.stepIndex + 1} started`,
        })

        // Activity completed/failed
        if (activity.completedAt) {
          logEntries.push({
            timestamp: formatTime(activity.completedAt),
            level: activity.status === "Failed" ? "error" : "info",
            message: `Activity Step ${activity.stepIndex + 1} ${activity.status.toLowerCase()}`,
          })
        }
      })
    }

    // Sort logs by timestamp (most recent first or chronological)
    // For now, keeping chronological order
    return logEntries.sort((a, b) => {
      // Simple timestamp string comparison (works for HH:MM:SS format)
      return a.timestamp.localeCompare(b.timestamp)
    })
  }, [workflowQuery.data])

  return {
    data: logs,
    isLoading: workflowQuery.isLoading,
    error: workflowQuery.error,
  }
}
