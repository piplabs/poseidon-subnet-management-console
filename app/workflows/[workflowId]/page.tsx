"use client";

import { Button } from "@/common/components/button";
import { Card } from "@/common/components/card";
import { Skeleton } from "@/common/components/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/accordion";
import { WorkflowStatusBadge } from "@/domain/workflow/components/workflow-status-badge";
import { WorkflowInfoCard } from "@/domain/workflow/components/workflow-info-card";
import { WorkflowTimeline } from "@/domain/workflow/components/workflow-timeline";
import { useWorkflow } from "@/domain/workflow/hooks/use-workflow";
import {
  formatDurationMs,
  formatAddress,
  formatDateTime,
} from "@/lib/api/transforms";
import { Activity, BarChart3, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainContent } from "@/common/components/layout/main-content";

export default function WorkflowDetailPage({
  params,
}: {
  params: { workflowId: string };
}) {
  const router = useRouter();
  const { data: workflow, isLoading, error } = useWorkflow(params.workflowId);

  if (error) {
    return (
      <MainContent>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">Workflow</span>
        </div>
        <div className="border border-border rounded-lg p-6">
          <div className="text-destructive">Error loading workflow details</div>
        </div>
      </MainContent>
    );
  }

  return (
    <MainContent>
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
      {isLoading ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Workflow Details</h1>
              <WorkflowStatusBadge status={workflow!.status} />
            </div>
          </div>
        </div>
      )}

      {/* Workflow Info Card */}
      {isLoading ? (
        <div className="rounded-md bg-card border border-border shadow-sm">
          <div className="flex flex-col gap-6 overflow-hidden p-4 md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {/* First Row */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
              {/* Second Row */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <WorkflowInfoCard
          workflowId={workflow!.id}
          type={workflow!.type}
          definition={formatAddress(workflow!.definition, 12)}
          creator={formatAddress(workflow!.creator, 12)}
          status={workflow!.status}
          createdAt={workflow!.createdAt}
          duration={workflow!.duration}
          completedSteps={workflow!.currentStep}
          totalSteps={workflow!.totalSteps}
          workers={workflow!.workers.length}
        />
      )}

      {/* Activities and Event History */}
      <Card className="border border-border rounded-lg overflow-hidden">
        <Accordion
          type="multiple"
          defaultValue={["event-history", "activities"]}
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
              {isLoading ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Step
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Activity ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Started
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(4)].map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-4">
                            <Skeleton className="h-4 w-8" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-4 w-28" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Step
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Activity ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Started
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflow!.activities.map((activity) => {
                        const duration =
                          activity.completedAt && activity.startedAt
                            ? formatDurationMs(
                                new Date(activity.completedAt).getTime() -
                                  new Date(activity.startedAt).getTime()
                              )
                            : "-";

                        return (
                          <tr
                            key={activity.activityId}
                            className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => {
                              router.push(`/activities/${activity.activityId}`);
                            }}
                          >
                            <td className="py-3 px-4 font-mono text-xs">
                              {activity.stepIndex}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              {formatAddress(activity.activityId, 12)}
                            </td>
                            <td className="py-3 px-4">
                              <WorkflowStatusBadge status={activity.status} />
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {formatDateTime(activity.startedAt)}
                            </td>
                            <td className="py-3 px-4 font-mono text-sm">
                              {duration}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
              <WorkflowTimeline workflowId={params.workflowId} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Workers Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Workers</h3>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflow!.workers.map((worker) => (
              <Card
                key={worker.worker}
                className="p-4 hover:bg-[#1E1F22FF] transition-colors cursor-pointer"
                onClick={() => router.push(`/workers/${worker.worker}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Circle className="h-2 w-2 fill-success text-success" />
                      <h4 className="text-sm font-mono font-medium">
                        {formatAddress(worker.worker, 12)}
                      </h4>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Last Heartbeat:</span>
                        <span className="font-medium">
                          {formatDateTime(worker.lastHeartbeatAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainContent>
  );
}
