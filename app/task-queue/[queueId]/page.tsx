"use client";

import { Clock, Activity, Users, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "../../../common/components/card";
import { Skeleton } from "../../../common/components/skeleton";
import { Badge } from "../../../common/components/badge";
import { useTaskQueue, useQueueActivities } from "@/domain/task/hooks";
import { MainContent } from "@/common/components/layout/main-content";

export default function QueueDetailPage({
  params,
}: {
  params: { queueId: string };
}) {
  const router = useRouter();
  const { data: queueData, isLoading: queueLoading } = useTaskQueue(
    params.queueId
  );
  const { data: activities, isLoading: activitiesLoading } = useQueueActivities(
    params.queueId
  );

  return (
    <MainContent>
      {queueLoading ? (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <Skeleton className="h-4 w-32" />
            <span className="text-muted-foreground">•</span>
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
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
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {/* Pending Activities */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Pending Activities
              </span>
              <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
                <Activity className="h-4 w-4 flex-none" />
                <span className="font-mono">
                  {queueData?.pendingActivities}
                </span>
              </div>
            </div>

            {/* Active Workers */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Active Workers
              </span>
              <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
                <Users className="h-4 w-4 flex-none" />
                <span className="font-mono">{queueData?.activeWorkers}</span>
              </div>
            </div>

            {/* Avg Wait Time */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Avg Wait Time
              </span>
              <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
                <Clock className="h-4 w-4 flex-none" />
                <span className="font-mono tabular-nums">{queueData?.averageWaitTime}</span>
              </div>
            </div>

            {/* Throughput */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Throughput</span>
              <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
                <TrendingUp className="h-4 w-4 flex-none" />
                <span className="font-mono tabular-nums">{queueData?.throughput}</span>
              </div>
            </div>

            {/* Current Depth */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Current Depth
              </span>
              <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
                <span className="font-mono tabular-nums">{queueData?.currentDepth}</span>
              </div>
            </div>

            {/* Oldest Pending */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Oldest Pending
              </span>
              <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
                <span className="truncate tabular-nums">
                  {queueData?.oldestPendingActivity}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Activities in Queue</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks currently queued and waiting for execution
          </p>
        </div>

        {activitiesLoading ? (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {[...Array(4)].map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Activity Name and ID */}
                        <div className="min-w-[200px]">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>

                        {/* Workflow Info */}
                        <div className="min-w-[180px]">
                          <Skeleton className="h-3 w-16 mb-1" />
                          <Skeleton className="h-3 w-28" />
                        </div>

                        {/* Status */}
                        <div className="min-w-[100px]">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>

                        {/* Priority */}
                        <div className="min-w-[100px]">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>

                        {/* Queued Time */}
                        <div className="min-w-[120px]">
                          <Skeleton className="h-3 w-16 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>

                        {/* Estimated Duration */}
                        <div className="flex-1 text-right">
                          <Skeleton className="h-3 w-20 mb-1 ml-auto" />
                          <Skeleton className="h-3 w-16 ml-auto" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

                        {/* Queued Time */}
                        <div className="flex-1 text-right">
                          <div className="text-sm text-muted-foreground">
                            Queued at
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                            {activity.queuedAt}
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
    </MainContent>
  );
}
