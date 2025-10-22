# Poseidon Subnet Management Console

A web dashboard for monitoring and managing Poseidon subnet workflows, tasks, and workers.

## Overview

The Poseidon Subnet Management Console provides a comprehensive interface for:

- **Dashboard Monitoring**: Real-time metrics for workflow success rates, active workers, and system health
- **Workflow Management**: View, track, and analyze workflow executions with detailed timelines
- **Task Queue Management**: Monitor task queues and their processing status
- **Worker Monitoring**: Track worker performance, staking, and status

## Related Repository

This frontend application connects to the backend API:

**[Poseidon Subnet Management API](https://github.com/piplabs/poseidon-subnet-management-api)**

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9.15.4 (recommended) or use npm/yarn
- **Backend API**: The [Poseidon Subnet Management API](https://github.com/piplabs/poseidon-subnet-management-api) must be running

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/poseidon-subnet-management-console.git
cd poseidon-subnet-management-console
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Adjust the `NEXT_PUBLIC_API_URL` to point to your running instance of the Poseidon Subnet Management API.

### 4. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `pnpm dev` - Start the development server on port 3000
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Project Structure

```
poseidon-subnet-management-console/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard homepage
│   ├── layout.tsx           # Root layout with navigation
│   ├── workflows/           # Workflow list and detail pages
│   ├── task-queue/          # Task queue management pages
│   └── ...
├── domain/                   # Feature-specific modules
│   ├── dashboard/           # Dashboard components and hooks
│   ├── workflow/            # Workflow-related logic
│   ├── task/                # Task management
│   └── worker/              # Worker monitoring
├── common/                   # Reusable components and hooks
│   ├── components/          # Pure UI components (shadcn/ui)
│   └── hooks/               # Generic React hooks
├── lib/                      # External integrations
│   ├── api/                 # API types and transforms
│   └── utils.ts             # Utility functions
├── public/                   # Static assets
└── styles/                   # Global styles
```

## Key Features

### Dashboard

Real-time monitoring with:

- Workflow success rate metrics
- Active/idle worker statistics
- Total staked amount tracking
- Historical execution charts

### Workflow Timeline

Interactive timeline visualization showing:

- Workflow execution flow
- Event history with zoom/pan controls
- Real-time status updates

### Task Queue Management

Monitor task queues with:

- Queue status and metrics
- Task distribution analysis
- Processing performance

### Worker Monitoring

Track worker performance:

- Worker status (Active/Inactive/Jailed)
- Staking information
- Task assignments

## API Integration

The application consumes the Poseidon Subnet Management API. Key endpoints include:

- `/api/dashboard/metrics` - Dashboard statistics
- `/api/workflows` - Workflow list and details
- `/api/workflows/{id}/events` - Workflow event history
- `/api/task-queue` - Task queue information
- `/api/workers` - Worker information

API types are defined in [lib/api/types.ts](lib/api/types.ts)
