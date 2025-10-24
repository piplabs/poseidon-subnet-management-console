# API Module

This module provides TypeScript types and utilities for working with the Poseidon Subnet Management API.

## Overview

- **types.ts** - Complete API response types matching swagger.json
- **transforms.ts** - Helper functions for data transformation and formatting
- **index.ts** - Barrel exports for convenient imports

## Usage

### Importing Types

```typescript
// Import specific types
import type {
  WorkflowListItem,
  WorkflowDetailResponse,
  ActivityDetailResponse,
  WorkerDetailResponse,
  QueueDetailResponse,
  PaginatedResponse,
  ErrorResponse,
} from "@/lib/api/types";

// Or import from index
import type { WorkflowListItem } from "@/lib/api";
```

### Importing Helpers

```typescript
// Import transformation helpers
import {
  normalizeWorkflowStatus,
  normalizeActivityStatus,
  normalizeWorkerStatus,
  formatDuration,
  formatTime,
  formatRelativeTime,
  getWorkflowStatusColor,
} from "@/lib/api/transforms";

// Or import from index
import { formatDuration } from "@/lib/api";
```

### Frontend Status Types

```typescript
import type {
  WorkflowStatus,
  ActivityStatus,
  WorkerStatus,
} from "@/lib/api/transforms";

// Frontend uses lowercase status strings:
// WorkflowStatus = "created" | "running" | "paused" | "pending" | "completed" | "failed" | "terminated"
// ActivityStatus = "pending" | "scheduled" | "claimed" | "running" | "completed" | "failed"
// WorkerStatus = "active" | "inactive" | "jailed"
```

## API Types Reference

### Common Types

#### `PaginatedResponse<T>`

Generic paginated response wrapper used for list endpoints.

```typescript
interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
```

#### `ErrorResponse`

Standard error response format.

```typescript
interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}
```

### Workflow Types

#### `WorkflowListItem`

Workflow item in list responses (GET /api/v1/workflows).

```typescript
interface WorkflowListItem {
  workflowId: string;
  type: string;
  definition: string;
  creator: string;
  status: WorkflowStatus;
  startedAt: string;
  endedAt: string;
  durationSec: number;
  currentStep: number;
  totalSteps: number;
  latestActivityId: string;
}
```

#### `WorkflowDetailResponse`

Complete workflow details (GET /api/v1/workflows/{workflowId}).

```typescript
interface WorkflowDetailResponse {
  workflowId: string;
  type: string;
  definition: string;
  creator: string;
  status: WorkflowStatus;
  createdAt: string;
  terminatedAt: string;
  terminationReason: string;
  durationSec: number;
  currentStep: number;
  totalSteps: number;
  stateHistory: StateTransition[];
  activities: ActivitySummary[];
  workers: WorkerSummary[];
}
```

#### `StateTransition`

Workflow state transition in state history.

```typescript
interface StateTransition {
  from: WorkflowStatus;
  to: WorkflowStatus;
  timestamp: string;
}
```

#### `ActivitySummary`

Activity summary in workflow details.

```typescript
interface ActivitySummary {
  activityId: string;
  stepIndex: number;
  status: ActivityStatus;
  startedAt: string;
  completedAt: string;
  logRef: string;
}
```

#### `WorkerSummary`

Worker summary in workflow details.

```typescript
interface WorkerSummary {
  worker: string;
  lastHeartbeatAt: string;
}
```

### Activity Types

#### `ActivityListItem`

Activity item in list responses.

```typescript
interface ActivityListItem {
  activityId: string;
  type: string;
  status: ActivityStatus;
  workflowId: string;
  worker: string;
  startedAt: string;
}
```

#### `ActivityDetailResponse`

Complete activity details (GET /api/v1/activities/{activityId}).

```typescript
interface ActivityDetailResponse {
  activityId: string;
  type: string;
  status: ActivityStatus;
  workflowId: string;
  stepIndex: number;
  queueId: string;
  worker: string;
  attempt: number;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  input: any;
  output: any;
  failureReason: string;
}
```

### Worker Types

#### `WorkerListItem`

Worker item in list responses (GET /api/v1/workers).

```typescript
interface WorkerListItem {
  workerId: string;
  stakedAmount: string;
  status: WorkerStatus;
  jailed: boolean;
  lastHeartbeat: string;
  activeTasks: number;
}
```

#### `WorkerDetailResponse`

Complete worker details (GET /api/v1/workers/{workerId}).

```typescript
interface WorkerDetailResponse {
  workerId: string;
  stakedAmount: string;
  jailed: boolean;
  registeredAt: string;
  lastHeartbeat: string;
  missedHeartbeats: number;
  activeTasks: WorkerActivity[];
  recentWorkflows: WorkerWorkflow[];
}
```

#### `WorkerActivity`

Active task in worker details.

```typescript
interface WorkerActivity {
  workflowId: string;
  activityId: string;
}
```

#### `WorkerWorkflow`

Recent workflow in worker details.

```typescript
interface WorkerWorkflow {
  workflowId: string;
  status: WorkflowStatus;
}
```

### Queue Types

#### `QueueListItem`

Queue item in list responses.

```typescript
interface QueueListItem {
  queueId: string;
  partitionCount: number;
  pendingActivities: number;
  oldestPendingSince: string;
  avgWaitSec: number;
  throughputPerMin: number;
  createdAt: string;
}
```

#### `QueueDetailResponse`

Complete queue details (GET /api/v1/queues with include parameter).

```typescript
interface QueueDetailResponse {
  queueId: string;
  partitionCount: number;
  pendingActivities: number;
  oldestPendingSince: string;
  avgWaitSec: number;
  throughputPerMin: number;
  createdAt: string;
  activities?: ActivityListItem[];
  workflows?: WorkflowListItem[];
}
```

### Search Types

#### `SearchResponse`

Global search results (GET /api/v1/search).

```typescript
interface SearchResponse {
  workflows: WorkflowListItem[];
  activities: ActivityListItem[];
  workers: WorkerListItem[];
}
```

## Transform Utilities Reference

### Status Normalization

Convert API status strings (PascalCase) to frontend format (lowercase).

```typescript
normalizeWorkflowStatus(apiStatus: string): WorkflowStatus
normalizeActivityStatus(apiStatus: string): ActivityStatus
normalizeWorkerStatus(apiStatus: string): WorkerStatus
```

**Example:**

```typescript
normalizeWorkflowStatus("Running"); // → "running"
normalizeActivityStatus("Completed"); // → "completed"
normalizeWorkerStatus("Active"); // → "active"
```

### Formatting Functions

#### Duration Formatting

```typescript
formatDuration(seconds: number | null): string
formatDurationMs(ms: number | null): string
```

**Example:**

```typescript
formatDuration(330); // → "5m 30s"
formatDuration(45); // → "45s"
formatDurationMs(83000); // → "1m 23s"
```

#### Time Formatting

```typescript
formatTime(isoTimestamp: string): string
formatDateTime(isoTimestamp: string): string
formatRelativeTime(isoTimestamp: string): string
```

**Example:**

```typescript
formatTime("2025-10-16T10:30:15Z"); // → "10:30:15"
formatDateTime("2025-10-16T10:30:15Z"); // → "10/16/2025, 10:30:15 AM"
formatRelativeTime("2025-10-16T10:30:15Z"); // → "2 minutes ago"
```

#### Other Formatting

```typescript
formatThroughput(perMinute: number): string
formatWaitTime(seconds: number): string
formatAddress(address: string, prefixLength?: number): string
formatStakedAmount(amount: string): string
```

**Example:**

```typescript
formatThroughput(12); // → "12/min"
formatWaitTime(45); // → "45s"
formatAddress("0xabc123def456789", 10); // → "0xabc123d..."
```

### UI Helper Functions

#### Status Colors

```typescript
getWorkflowStatusColor(status: WorkflowStatus): StatusColor
getActivityStatusColor(status: ActivityStatus): StatusColor
getWorkerStatusColor(status: WorkerStatus): StatusColor
```

**Returns:** `"blue" | "green" | "red" | "yellow" | "gray" | "orange"`

**Example:**

```typescript
getWorkflowStatusColor("running"); // → "blue"
getActivityStatusColor("completed"); // → "green"
getWorkerStatusColor("jailed"); // → "red"
```

### Validation Functions

```typescript
isActiveWorker(status: WorkerStatus, lastHeartbeat: string, maxInactiveSeconds?: number): boolean
isCompletedWorkflow(status: WorkflowStatus): boolean
isTerminalWorkflow(status: WorkflowStatus): boolean
isRunningActivity(status: ActivityStatus): boolean
isCompletedActivity(status: ActivityStatus): boolean
isTerminalActivity(status: ActivityStatus): boolean
```

**Example:**

```typescript
isActiveWorker("active", "2025-10-16T10:35:58Z"); // → true/false
isTerminalWorkflow("completed"); // → true
isRunningActivity("running"); // → true
```

## Status Enums

### WorkflowStatus (API)

```typescript
"Created" |
  "Running" |
  "Paused" |
  "Pending" |
  "Completed" |
  "Failed" |
  "Terminated";
```

### WorkflowStatus (Frontend)

```typescript
"created" |
  "running" |
  "paused" |
  "pending" |
  "completed" |
  "failed" |
  "terminated";
```

### ActivityStatus (API)

```typescript
"Pending" | "Scheduled" | "Claimed" | "Running" | "Completed" | "Failed";
```

### ActivityStatus (Frontend)

```typescript
"pending" | "scheduled" | "claimed" | "running" | "completed" | "failed";
```

### WorkerStatus (API)

```typescript
"Active" | "Inactive" | "Jailed";
```

### WorkerStatus (Frontend)

```typescript
"active" | "inactive" | "jailed";
```

## Best Practices

### 1. Always Use Types

```typescript
// ✅ Good
const response: WorkflowListResponse = await fetch(...)

// ❌ Bad
const response = await fetch(...) // No type safety
```

### 2. Normalize Status Immediately

```typescript
// ✅ Good
const status = normalizeWorkflowStatus(apiResponse.status);

// ❌ Bad
const status = apiResponse.status.toLowerCase(); // Type error
```

### 3. Store Raw Values, Format for Display

```typescript
// ✅ Good - Store raw value
const workflow = {
  durationSec: 330,
  duration: formatDuration(330), // Format for display
};

// ❌ Bad - Only store formatted
const workflow = {
  duration: "5m 30s", // Can't sort or calculate with this
};
```

### 4. Use Helper Functions

```typescript
// ✅ Good
const color = getWorkflowStatusColor(workflow.status);

// ❌ Bad
const color =
  workflow.status === "running"
    ? "blue"
    : workflow.status === "completed"
    ? "green"
    : "gray";
```

## Related Documentation

- [API_SCHEMA_ALIGNMENT.md](../../API_SCHEMA_ALIGNMENT.md) - Detailed API schema analysis
- [UPDATE_SUMMARY.md](../../UPDATE_SUMMARY.md) - Summary of recent changes
- [swagger.json](../../swagger.json) - OpenAPI specification
