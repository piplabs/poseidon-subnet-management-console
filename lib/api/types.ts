/**
 * API Types - Generated from swagger.json
 * These types match the API response schemas exactly
 */

// ============================================================================
// Enums
// ============================================================================

export type WorkflowStatus =
  | "Created"
  | "Running"
  | "Paused"
  | "Pending"
  | "Completed"
  | "Failed"
  | "Terminated"

export type ActivityStatus =
  | "Pending"
  | "Scheduled"
  | "Claimed"
  | "Running"
  | "Completed"
  | "Failed"

export type WorkerStatus = "Active" | "Inactive" | "Jailed"

// ============================================================================
// Common Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface ErrorResponse {
  status: number
  message: string
  timestamp: string
}

// ============================================================================
// Workflow Types
// ============================================================================

export interface WorkflowListItem {
  workflowId: string
  type: string
  definition: string
  creator: string | null  // Can be null for system-generated workflows
  status: WorkflowStatus
  startedAt: string
  endedAt: string | null  // Null for running workflows
  durationSec: number | null  // Null for running workflows
  currentStep: number
  totalSteps: number
  latestActivityId: string | null  // Can be null if no activities yet
}

export interface StateTransition {
  from: WorkflowStatus
  to: WorkflowStatus
  timestamp: string
}

export interface ActivitySummary {
  activityId: string
  stepIndex: number
  status: ActivityStatus
  startedAt: string
  completedAt: string
  logRef: string
}

export interface WorkerSummary {
  worker: string
  lastHeartbeatAt: string
}

export interface WorkflowDetailResponse {
  workflowId: string
  type: string
  definition: string
  creator: string
  status: WorkflowStatus
  createdAt: string
  terminatedAt: string
  terminationReason: string
  durationSec: number
  currentStep: number
  totalSteps: number
  stateHistory: StateTransition[]
  activities: ActivitySummary[]
  workers: WorkerSummary[]
}

export interface WorkflowActivityListResponse {
  workflowId: string
  workflowType: string
  status: WorkflowStatus
  startedAt: string
  completedAt: string
  durationMs: number
  activities: ActivityDetail[]
}

// ============================================================================
// Activity Types
// ============================================================================

export interface ActivityListItem {
  activityId: string
  type: string
  status: ActivityStatus
  workflowId: string
  worker: string
  startedAt: string
}

export interface ActivityDetailResponse {
  activityId: string
  type: string
  status: ActivityStatus
  workflowId: string
  stepIndex: number
  queueId: string
  worker: string
  attempt: number
  startedAt: string
  completedAt: string
  durationMs: number
  input: any
  output: any
  failureReason: string
}

export interface ActivityDetail {
  activityId: string
  activityType: string
  status: ActivityStatus
  taskQueue: string
  worker: string
  attempt: number
  scheduledAt: string
  claimedAt: string
  startedAt: string
  completedAt: string
  durationMs: number
  input: any
  output: any
}

// ============================================================================
// Worker Types
// ============================================================================

export interface WorkerActivity {
  workflowId: string
  activityId: string
}

export interface WorkerWorkflow {
  workflowId: string
  status: WorkflowStatus
}

export interface WorkerListItem {
  workerId: string
  stakedAmount: string
  status: WorkerStatus
  jailed: boolean
  lastHeartbeat: string
  activeTasks: number
}

export interface WorkerDetailResponse {
  workerId: string
  stakedAmount: string
  jailed: boolean
  registeredAt: string
  lastHeartbeat: string
  missedHeartbeats: number
  activeTasks: WorkerActivity[]
  recentWorkflows: WorkerWorkflow[]
}

// ============================================================================
// Queue Types
// ============================================================================

export interface QueueListItem {
  queueId: string
  partitionCount: number
  pendingActivities: number
  oldestPendingSince: string
  avgWaitSec: number
  throughputPerMin: number
  createdAt: string
}

export interface QueueDetailResponse {
  queueId: string
  partitionCount: number
  pendingActivities: number
  oldestPendingSince: string
  avgWaitSec: number
  throughputPerMin: number
  createdAt: string
  activities?: ActivityListItem[]
  workflows?: WorkflowListItem[]
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResponse {
  workflows: WorkflowListItem[]
  activities: ActivityListItem[]
  workers: WorkerListItem[]
}

// ============================================================================
// Type Aliases for Paginated Responses
// ============================================================================

export type WorkflowListResponse = PaginatedResponse<WorkflowListItem>
export type WorkerListResponse = PaginatedResponse<WorkerListItem>
export type QueueListResponse = PaginatedResponse<QueueDetailResponse>
