"use client";

import { Card } from "@/common/components/card";
import { Skeleton } from "@/common/components/skeleton";

export function ObservabilityCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-4">
        <h3 className="text-xs text-muted-foreground">Observability</h3>
      </div>

      {/* Content */}
      <div className="px-4">
        <div className="grid grid-cols-1 gap-4 text-xs">
          {/* Workflow Success Rate */}
          <div>
            <div className="text-muted-foreground mb-1">
              Workflow Success Rate
            </div>
            <Skeleton className="h-4 w-9 rounded-full" />
            <Skeleton className="h-1 w-full rounded-full mt-1" />
          </div>

          {/* Activity Success Rate */}
          <div>
            <div className="text-muted-foreground mb-1">
              Activity Success Rate
            </div>
            <Skeleton className="h-4 w-9 rounded-full" />
            <Skeleton className="h-1 w-full rounded-full mt-1" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function MetricsCardSkeleton() {
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="space-y-6">
        <h3 className="text-xs text-muted-foreground">Metrics</h3>

        <div className="space-y-8">
          {/* Active Workers */}
          <div className="flex items-start">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Active Workers</p>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </div>

          {/* Total Staked */}
          <div className="flex items-start">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Total Staked</p>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function WorkflowsCardSkeleton() {
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="space-y-6">
        <h3 className="text-xs text-muted-foreground">Workflows</h3>

        {/* Pie Chart Area */}
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <Skeleton className="h-[120px] w-[120px] rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-1">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
