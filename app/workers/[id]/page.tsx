"use client";

import { Button } from "@/common/components/button";
import { Card } from "@/common/components/card";
import { Skeleton } from "@/common/components/skeleton";
import { Badge } from "@/common/components/badge";
import { useWorker } from "@/domain/worker/hooks";
import {
  formatAddress,
  formatDateTime,
  formatStakedAmount,
  getWorkflowStatusColor,
} from "@/lib/api/transforms";
import {
  ArrowLeft,
  Activity,
  Clock,
  Coins,
  AlertTriangle,
  Search,
  MoreHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: worker, isLoading, error } = useWorker(params.id);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadgeClass = (status: string) => {
    const color = getWorkflowStatusColor(status as any);
    const colorMap = {
      blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
      green: "border-green-500/20 bg-green-500/10 text-green-500",
      red: "border-red-500/20 bg-red-500/10 text-red-500",
      yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
      orange: "border-orange-500/20 bg-orange-500/10 text-orange-500",
      gray: "border-gray-500/20 bg-gray-500/10 text-gray-500",
    };
    return colorMap[color];
  };

  if (isLoading) {
    return (
      <main className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Info Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Worker Information Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-3 w-32 mb-4" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </Card>

        {/* Tables Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 space-y-6">
        <Card className="p-6">
          <div className="text-destructive">
            Error loading worker: {error.message}
          </div>
        </Card>
      </main>
    );
  }

  if (!worker) {
    return (
      <main className="p-6 space-y-6">
        <Card className="p-6">
          <div className="text-muted-foreground">Worker not found</div>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      {/* Worker Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Worker Details</h1>
            <Badge
              variant="outline"
              className={
                worker.status === "active"
                  ? "border-green-500/20 bg-green-500/10 text-green-500"
                  : worker.status === "jailed"
                  ? "border-red-500/20 bg-red-500/10 text-red-500"
                  : "border-gray-500/20 bg-gray-500/10 text-gray-500"
              }
            >
              {worker.status}
            </Badge>
            {worker.jailed && (
              <Badge
                variant="outline"
                className="border-red-500/20 bg-red-500/10 text-red-500 gap-1"
              >
                <AlertTriangle className="h-3 w-3" />
                Jailed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Worker Information */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">ID</span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <span className="font-mono truncate">
                {formatAddress(worker.id, 12)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Staked Amount</span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <Coins className="h-4 w-4 flex-none" />
              <span className="font-mono">
                {formatStakedAmount(worker.stakedAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Registered At</span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <Clock className="h-4 w-4 flex-none" />
              <span className="truncate">
                {formatDateTime(worker.registeredAt).split(",")[0]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Last Heartbeat
            </span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <span className="truncate">{worker.lastHeartbeatRelative}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Active Tasks</span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <Activity className="h-4 w-4 flex-none" />
              <span className="font-mono">{worker.currentTasksCount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Total Workflows
            </span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <span className="font-mono">{worker.recentWorkflows.length}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Missed Heartbeats
            </span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <AlertTriangle
                className={`h-4 w-4 flex-none ${
                  worker.missedHeartbeats > 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`font-mono ${
                  worker.missedHeartbeats > 0 ? "text-destructive" : ""
                }`}
              >
                {worker.missedHeartbeats}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Status</span>
            <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
              <span
                className={`flex h-2.5 w-2.5 flex-none rounded-full ${
                  worker.jailed
                    ? "bg-red-500"
                    : worker.status === "active"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              />
              <span className="capitalize">
                {worker.jailed ? "Jailed" : worker.status}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-medium mb-2">Tasks</h3>
        {/* Active Tasks */}
        <Card className="overflow-hidden py-0">
          {/* Task List */}
          {worker.activeTasks.length > 0 ? (
            <div className="divide-y divide-border">
              {worker.activeTasks
                .filter(
                  (task) =>
                    task.workflowId
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    task.activityId
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((task, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/workflows/${task.workflowId}`)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Branch Icon */}
                      <Activity className="h-4 w-4 text-muted-foreground flex-none" />

                      {/* Task Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-mono truncate">
                          {formatAddress(task.workflowId, 16)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 flex-none">
                        {/* Preview Badge */}
                        <Badge
                          variant="outline"
                          className="border-blue-500/20 bg-blue-500/10 text-blue-500 text-xs"
                        >
                          Preview
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No active tasks
            </div>
          )}

          {/* Load More Button */}
          {worker.activeTasks.length > 5 && (
            <div className="border-t border-border px-6 py-3">
              <button className="w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors">
                Load More
              </button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
