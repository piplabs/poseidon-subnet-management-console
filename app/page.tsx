"use client"

import { Header } from "@/common/components/layout/header"
import { MetricCard } from "@/domain/dashboard/components/metric-card"
import { WorkflowTable } from "@/domain/workflow/components/workflow-table"
import { TaskQueueTable } from "@/domain/task/components/task-queue-table"
import { Skeleton } from "@/common/components/skeleton"
import { Users, Coins, GitBranch, TrendingUp, Clock, Activity } from "lucide-react"
import { useDashboardMetrics } from "@/domain/dashboard/hooks"

export default function HomePage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Workflow execution metrics and system overview</p>
        </div>

        {/* Metrics Grid */}
        {metricsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Active Workers"
              value={metrics?.activeWorkers || 0}
              subtitle={`${metrics?.idleWorkers || 0} idle`}
              icon={Users}
            />
            <MetricCard
              title="Total Staked"
              value={metrics?.totalStaked || "0"}
              subtitle={metrics?.stakingCurrency || "ETH"}
              icon={Coins}
            />
            <MetricCard
              title="Workflow Runs"
              value={metrics?.workflowRuns || 0}
              subtitle="Last 24 hours"
              icon={GitBranch}
            />
            <MetricCard
              title="Workflow Success Rate"
              value={metrics?.workflowSuccessRate || "0%"}
              subtitle="Last 7 days"
              icon={TrendingUp}
            />
            <MetricCard
              title="Avg Completion Time"
              value={metrics?.avgCompletionTime || "0m"}
              subtitle="End-to-end duration"
              icon={Clock}
            />
            <MetricCard
              title="Activity Success Rate"
              value={metrics?.activitySuccessRate || "0%"}
              subtitle="Individual activities"
              icon={Activity}
            />
          </div>
        )}

        {/* Workflow Table */}
        <WorkflowTable />

        {/* Task Queue Table */}
        <TaskQueueTable />
      </main>
    </div>
  )
}
