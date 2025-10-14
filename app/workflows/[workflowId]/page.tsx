"use client";

import { Button } from "@/common/components/button";
import { Card } from "@/common/components/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/accordion";
import { WorkflowStatusBadge } from "@/domain/workflow/components/workflow-status-badge";
import { WorkflowGraph } from "@/domain/workflow/components/workflow-graph";
import { WorkflowTimeline } from "@/domain/workflow/components/workflow-timeline";
import { WorkflowRawLogs } from "@/domain/workflow/components/workflow-raw-logs";
import { Activity, BarChart3, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Declare variables for activitiesData and workersData
const activitiesData = [
  {
    id: "act-001",
    name: "Fetch Data",
    status: "completed",
    duration: "2m 30s",
    worker: "worker-001",
  },
  {
    id: "act-002",
    name: "Transform Data",
    status: "completed",
    duration: "3m 15s",
    worker: "worker-002",
  },
  {
    id: "act-003",
    name: "Process Data",
    status: "running",
    duration: "1m 45s",
    worker: "worker-003",
  },
  // Add more activities as needed
];

const workersData = [
  {
    id: "worker-001",
    status: "active",
    currentActivity: "Fetch Data",
    tasksCompleted: 2,
  },
  {
    id: "worker-002",
    status: "inactive",
    currentActivity: "None",
    tasksCompleted: 1,
  },
  {
    id: "worker-003",
    status: "active",
    currentActivity: "Process Data",
    tasksCompleted: 0,
  },
  // Add more workers as needed
];

export default function WorkflowDetailPage({
  params,
}: {
  params: { workflowId: string };
}) {
  const router = useRouter();

  return (
      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">Workflow</span>
        </div>

        {/* Workflow Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Workflow Details</h1>
              <WorkflowStatusBadge status="running" />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <span className="font-mono">{params.workflowId}</span>
              <span className="hidden sm:inline">•</span>
              <span>Type: DataProcessing</span>
              <span className="hidden sm:inline">•</span>
              <span>Started: 2025-01-15 14:30:15</span>
              <span className="hidden sm:inline">•</span>
              <span>Duration: 5m 23s</span>
            </div>
          </div>
        </div>

        {/* Workflow Info Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">User</div>
            <div className="font-mono text-sm">0x1234...5678</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Current Activity
            </div>
            <div className="text-sm">Process Data (act-003)</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Activities Completed
            </div>
            <div className="text-sm">2 of 5</div>
          </Card>
        </div>

        {/* Workflow Graph */}
        <WorkflowGraph />

        {/* Event History */}

        <Card className="border border-border rounded-lg overflow-hidden">
          <Accordion
            type="multiple"
            defaultValue={["event-history"]}
            className="w-full"
          >
            {/* Activities Accordion */}
            <AccordionItem
              value="activities"
              className="border-b border-border px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Activities</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Duration
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Worker
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activitiesData.map((activity) => (
                        <tr
                          key={activity.id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => {
                            router.push(`/activities/${activity.id}`);
                          }}
                        >
                          <td className="py-3 px-4 font-mono text-xs">
                            {activity.id}
                          </td>
                          <td className="py-3 px-4 text-sm">{activity.name}</td>
                          <td className="py-3 px-4">
                            <WorkflowStatusBadge
                              status={activity.status as any}
                            />
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">
                            {activity.duration}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                            {activity.worker}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Event History Accordion */}
            <AccordionItem
              value="event-history"
              className="border-b border-border px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Event History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <WorkflowTimeline />
              </AccordionContent>
            </AccordionItem>

            {/* Raw Log Accordion */}
            <AccordionItem value="raw-log" className="px-6">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">Raw Log</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <WorkflowRawLogs />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Workers</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workersData.map((worker) => (
              <Card
                key={worker.id}
                className="p-4 hover:bg-[#1E1F22FF] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Circle
                        className={`h-2 w-2 ${
                          worker.status === "active"
                            ? "fill-success text-success"
                            : "fill-muted-foreground text-muted-foreground"
                        }`}
                      />
                      <h4 className="text-sm font-mono font-medium">
                        {worker.id}
                      </h4>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium capitalize">
                          {worker.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Activity:</span>
                        <span className="font-mono">
                          {worker.currentActivity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasks Completed:</span>
                        <span className="font-medium">
                          {worker.tasksCompleted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
