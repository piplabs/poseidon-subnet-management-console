/**
 * API Data Transformation Utilities
 * Format and display helpers for API data
 */

import type {
  WorkflowStatus,
  ActivityStatus,
  WorkerStatus,
} from "./types"
import { formatTimestampWithTimezone } from "../utils"

// ============================================================================
// Format Helper Functions
// ============================================================================

/**
 * Format duration in seconds to readable string (e.g., "5m 30s")
 */
export function formatDuration(seconds: number | null): undefined | string {
  if (seconds === null || seconds === undefined) return undefined
  if (seconds === 0) return "0s"

  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)

  if (mins === 0) return `${secs}s`
  if (secs === 0) return `${mins}m`
  return `${mins}m ${secs}s`
}

/**
 * Format duration in milliseconds to readable string
 */
export function formatDurationMs(ms: number | null): undefined | string {
  if (ms === null || ms === undefined) return undefined
  return formatDuration(Math.round(ms / 1000))
}

/**
 * Format ISO timestamp to relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(isoTimestamp: string): string {
  const now = Date.now()
  const then = new Date(isoTimestamp).getTime()
  const diffMs = now - then

  if (diffMs < 0) return "just now"

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  return `${days} day${days !== 1 ? "s" : ""} ago`
}

/**
 * Format ISO timestamp to local time string (e.g., "14:30:15")
 */
export function formatTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleTimeString()
}

/**
 * Format ISO timestamp to local date and time with timezone
 * Example: "Oct 23, 2025, 12:01:09 AM PDT"
 */
export function formatDateTime(isoTimestamp: string): string {
  return formatTimestampWithTimezone(isoTimestamp)
}

/**
 * Format throughput per minute (e.g., "12/min")
 */
export function formatThroughput(perMinute: number): string {
  return `${perMinute}/min`
}

/**
 * Format wait time in seconds to readable string
 */
export function formatWaitTime(seconds: number): undefined | string {
  return formatDuration(seconds)
}

/**
 * Format blockchain address to shortened version (e.g., "0xabc123...def456")
 */
export function formatAddress(address: string, prefixLength = 10): string {
  if (address.length <= prefixLength + 3) return address
  return `${address.substring(0, prefixLength)}...`
}

/**
 * Format staked amount (assuming it's in wei or similar)
 * TODO: Update based on actual token decimals
 */
export function formatStakedAmount(amount: string): string {
  // For now, just return as-is. Update when token details are known
  return amount
}

// ============================================================================
// Status UI Helpers
// ============================================================================

export type StatusColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "gray"
  | "orange"

/**
 * Get color for workflow status
 */
export function getWorkflowStatusColor(
  status: WorkflowStatus
): StatusColor {
  switch (status) {
    case "Completed":
      return "green"
    case "Running":
      return "blue"
    case "Failed":
      return "red"
    case "Terminated":
      return "orange"
    case "Paused":
      return "yellow"
    case "Pending":
    case "Created":
      return "gray"
    default:
      return "gray"
  }
}

/**
 * Get color for activity status
 */
export function getActivityStatusColor(status: ActivityStatus): StatusColor {
  switch (status) {
    case "Completed":
      return "green"
    case "Running":
      return "blue"
    case "Failed":
      return "red"
    case "Scheduled":
    case "Claimed":
      return "yellow"
    case "Pending":
      return "gray"
    default:
      return "gray"
  }
}

/**
 * Get color for worker status
 */
export function getWorkerStatusColor(status: WorkerStatus): StatusColor {
  switch (status) {
    case "Active":
      return "green"
    case "Inactive":
      return "gray"
    case "Jailed":
      return "red"
    default:
      return "gray"
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if worker is currently active
 */
export function isActiveWorker(
  status: WorkerStatus,
  lastHeartbeat: string,
  maxInactiveSeconds = 60
): boolean {
  if (status === "Jailed") return false
  if (status === "Inactive") return false

  const lastHeartbeatTime = new Date(lastHeartbeat).getTime()
  const now = Date.now()
  const inactiveSeconds = (now - lastHeartbeatTime) / 1000

  return inactiveSeconds < maxInactiveSeconds
}

/**
 * Check if workflow is completed
 */
export function isCompletedWorkflow(status: WorkflowStatus): boolean {
  return status === "Completed"
}

/**
 * Check if workflow is in terminal state
 */
export function isTerminalWorkflow(status: WorkflowStatus): boolean {
  return status === "Completed" || status === "Failed" || status === "Terminated"
}

/**
 * Check if activity is running
 */
export function isRunningActivity(status: ActivityStatus): boolean {
  return status === "Running"
}

/**
 * Check if activity is completed
 */
export function isCompletedActivity(status: ActivityStatus): boolean {
  return status === "Completed"
}

/**
 * Check if activity is in terminal state
 */
export function isTerminalActivity(status: ActivityStatus): boolean {
  return status === "Completed" || status === "Failed"
}
