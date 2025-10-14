"use client";

import { Clock, Activity, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../../common/components/button";
import { Card } from "../../../common/components/card";
import { Skeleton } from "../../../common/components/skeleton";
import { SubnetHeader } from "../../../common/components/layout/subnet-header";
import { Badge } from "../../../common/components/badge";
import { useTaskQueue, useQueueActivities } from "@/domain/task/hooks";

export default function QueueDetailPage({
  params,
}: {
  params: { queueId: string };
}) {
  const router = useRouter();
  const { data: queueData, isLoading: queueLoading } = useTaskQueue(params.queueId);
  const { data: activities, isLoading: activitiesLoading } = useQueueActivities(params.queueId);

  return (
    <div className="min-h-screen bg-background">
      <SubnetHeader subnetName="Chutes Subnet" />

      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/task-queue">
            <Button variant="ghost" size="sm">
              Task Queues
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">{params.queueId}</span>
        </div>

        {queueLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{queueData?.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono">{queueData?.id}</span>
              <span>•</span>
              <span>Created {queueData?.createdAt}</span>
            </div>
          </div>
        )}

        {queueLoading ? (
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">
                Pending Activities
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold font-mono">
              {queueData?.pendingActivities}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Current depth: {queueData?.currentDepth}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">
                Active Workers
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold font-mono">
              {queueData?.activeWorkers}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Processing tasks
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Avg Wait Time</div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold font-mono">
              {queueData?.averageWaitTime}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Oldest: {queueData?.oldestPendingActivity}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Throughput</div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold font-mono">
              {queueData?.throughput}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Tasks per hour
            </div>
          </Card>
        </div>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Activities in Queue</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tasks currently queued and waiting for execution
            </p>
          </div>

          {activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {activities?.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-border last:border-b-0 hover:bg-[#1E1F22FF] transition-colors cursor-pointer"
                    onClick={() => router.push(`/activities/${activity.id}`)}
                  >
                    <td className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Activity Name and ID */}
                        <div className="min-w-[200px]">
                          <div className="font-medium text-sm">
                            {activity.name}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground mt-0.5">
                            {activity.id}
                          </div>
                        </div>

                        {/* Workflow Info */}
                        <div className="min-w-[180px]">
                          <div className="text-sm text-muted-foreground">
                            Workflow
                          </div>
                          <div className="font-mono text-xs text-primary hover:underline mt-0.5">
                            {activity.workflowId}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="min-w-[100px]">
                          <Badge
                            variant="outline"
                            className={
                              activity.status === "running"
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                : "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>

                        {/* Priority */}
                        <div className="min-w-[100px]">
                          <Badge
                            variant="outline"
                            className={
                              activity.priority === "high"
                                ? "border-destructive/20 bg-destructive/10 text-destructive"
                                : activity.priority === "low"
                                ? "border-muted bg-muted text-muted-foreground"
                                : "border-primary/20 bg-primary/10 text-primary"
                            }
                          >
                            {activity.priority}
                          </Badge>
                        </div>

                        {/* Queued Time */}
                        <div className="min-w-[120px]">
                          <div className="text-sm text-muted-foreground">
                            Queued at
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {activity.queuedAt}
                          </div>
                        </div>

                        {/* Estimated Duration */}
                        <div className="flex-1 text-right">
                          <div className="text-sm text-muted-foreground">
                            Est. Duration
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {activity.estimatedDuration}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
