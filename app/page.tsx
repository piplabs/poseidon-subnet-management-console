"use client";

import { ObservabilityCard } from "@/domain/dashboard/components/observability-card";
import { MetricsCard } from "@/domain/dashboard/components/metrics-card";
import { WorkflowsCard } from "@/domain/dashboard/components/workflows-card";
import { MonitoringTabs } from "@/domain/dashboard/components/monitoring-tabs";
import {
  ObservabilityCardSkeleton,
  MetricsCardSkeleton,
  WorkflowsCardSkeleton
} from "@/domain/dashboard/components/dashboard-card-skeletons";
import { useDashboardMetrics } from "@/domain/dashboard/hooks";

export default function HomePage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();

  return (
    <main className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Workflow execution metrics and system overview
        </p>
      </div>

      {/* Metrics Grid */}
      {metricsLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ObservabilityCardSkeleton />
          <MetricsCardSkeleton />
          <WorkflowsCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ObservabilityCard
            workflowSuccessRate={metrics?.workflowSuccessRateNumeric || 0}
            activitySuccessRate={metrics?.activitySuccessRateNumeric || 0}
          />
          <MetricsCard
            activeWorkers={metrics?.activeWorkers || 0}
            idleWorkers={metrics?.idleWorkers || 0}
            totalStaked={metrics?.totalStaked || "0"}
            stakingCurrency={metrics?.stakingCurrency || "PSDN"}
          />
          <WorkflowsCard
            totalWorkflows={
              metrics?.totalWorkflows || {
                started: 0,
                active: 0,
                completed: 0,
                failed: 0,
              }
            }
          />
        </div>
      )}

      {/* Monitoring Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Monitoring</h2>
        </div>

        <MonitoringTabs />
      </div>
    </main>
  );
}
