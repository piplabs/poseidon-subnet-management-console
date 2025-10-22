# API Setup Guide

This document explains how to configure the application to use the actual API instead of mock data.

## Configuration

### Environment Variables

The application uses environment variables to configure API access. Create a `.env.local` file in the root directory:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

- **NEXT_PUBLIC_API_BASE_URL**: The base URL for the Poseidon Subnet Management API
  - Example: `http://localhost:8080`
  - If not set or empty, the application will use mock data

### Files Created

1. **`.env.local`** - Your local environment configuration (git-ignored)
2. **`.env.example`** - Template for environment variables (checked into git)
3. **`lib/env.ts`** - Environment configuration module

## How It Works

### Environment Module (`lib/env.ts`)

The `lib/env.ts` module provides:

- `env.apiBaseUrl` - The configured API base URL
- `isApiConfigured()` - Check if API is configured
- `getApiUrl(path)` - Get full API endpoint URL

### Updated Hooks

The following hooks have been updated to use the actual API when configured:

1. **Dashboard Metrics** (`domain/dashboard/hooks/use-dashboard-metrics.ts`)
   - Endpoint: `GET /api/v1/metrics/overview`

2. **Workflows** (`domain/workflow/hooks/use-workflows.ts`)
   - Endpoint: `GET /api/v1/workflows`
   - Supports filters: status, type, time range, sorting, pagination

3. **Worker Details** (`domain/worker/hooks/use-worker.ts`)
   - Endpoint: `GET /api/v1/workers/{workerId}`

4. **Task Queues** (`domain/task/hooks/use-task-queues.ts`)
   - Endpoint: `GET /api/v1/queues`
   - Supports filters: queueId, pagination

### Behavior

```typescript
// If API is configured
if (isApiConfigured()) {
  const url = getApiUrl("/api/v1/workflows")
  const response = await fetch(url)
  // Use actual API response
} else {
  // Use mock data
}
```

## Testing with Local API

### 1. Start the Backend API

Make sure the [Poseidon Subnet Management API](https://github.com/piplabs/poseidon-subnet-management-api) is running on `http://localhost:8080`.

### 2. Configure Environment

Create or update `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. Restart the Development Server

After creating or modifying `.env.local`, restart the Next.js development server:

```bash
pnpm dev
```

### 4. Verify API Connection

The application will now make actual API calls. You can verify this by:

1. Opening browser DevTools > Network tab
2. Navigating to different pages
3. Looking for API requests to `http://localhost:8080/api/v1/*`

## API Endpoints Used

| Feature | HTTP Method | Endpoint | Status |
|---------|-------------|----------|--------|
| Dashboard Metrics | GET | `/api/v1/metrics/overview` | ✓ |
| Workflow List | GET | `/api/v1/workflows` | ✓ |
| Workflow Detail | GET | `/api/v1/workflows/{id}` | TODO |
| Worker Detail | GET | `/api/v1/workers/{id}` | ✓ |
| Task Queues | GET | `/api/v1/queues` | ✓ |
| Search | GET | `/api/v1/search` | TODO |

## Switching Between API and Mock Data

### Use API (Production/Testing)

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Use Mock Data (Development)

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=
```

Or simply delete/rename the `.env.local` file.

## Error Handling

All API calls include error handling:

```typescript
if (!response.ok) {
  throw new Error(`Failed to fetch: ${response.statusText}`)
}
```

Errors are caught by React Query and exposed through the `error` property in hooks:

```typescript
const { data, isLoading, error } = useWorkflows()

if (error) {
  console.error("Failed to load workflows:", error)
}
```

## Next Steps

To fully integrate with the API, you may need to:

1. Update remaining hooks that still use only mock data
2. Implement proper error handling UI components
3. Add retry logic for failed requests
4. Add authentication headers if required
5. Configure CORS if API is on different domain

## Removed Files

The following activities-related files have been removed as activities are not a standalone feature:

- `domain/workflow/hooks/use-activities.ts`
- `app/activities/page.tsx`

Activities are accessed through workflow details and search endpoints instead.
