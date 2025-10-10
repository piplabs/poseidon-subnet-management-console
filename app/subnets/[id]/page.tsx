import { Header } from "@/common/components/layout/header"
import { Button } from "@/common/components/button"
import { MetricCard } from "@/domain/dashboard/components/metric-card"
import { ChartCard } from "@/domain/dashboard/components/chart-card"
import { WorkflowTable } from "@/domain/workflow/components/workflow-table"
import { ArrowLeft, Users, Coins, GitBranch, TrendingUp, Clock, Activity } from "lucide-react"
import Link from "next/link"

// Mock data for subnet-specific charts
const workflowData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(Math.random() * 50) + 20,
}))

export default function SubnetDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Subnet Header */}
        <div>
          <h1 className="text-3xl font-bold">Chutes Subnet</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">{params.id}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Active Workers"
            value={24}
            subtitle="8 idle"
            icon={Users}
            trend={{ value: "12%", positive: true }}
          />
          <MetricCard
            title="Total Staked"
            value="1.2M"
            subtitle="ETH"
            icon={Coins}
            trend={{ value: "5.3%", positive: true }}
          />
          <MetricCard
            title="Workflow Runs"
            value={234}
            subtitle="Last 24 hours"
            icon={GitBranch}
            trend={{ value: "8%", positive: true }}
          />
          <MetricCard
            title="Workflow Success Rate"
            value="96.5%"
            subtitle="Last 7 days"
            icon={TrendingUp}
            trend={{ value: "2.1%", positive: true }}
          />
          <MetricCard title="Avg Completion Time" value="8.5m" subtitle="End-to-end duration" icon={Clock} />
          <MetricCard title="Activity Success Rate" value="97.8%" subtitle="Individual activities" icon={Activity} />
        </div>

        {/* Workflow Executions Chart */}
        <ChartCard
          title="Workflow Executions"
          subtitle="Number of workflows per hour"
          data={workflowData}
          dataKey="value"
          type="area"
          color="hsl(210, 100%, 60%)"
        />

        {/* Workflow Table */}
        <WorkflowTable subnetId={params.id} />
      </main>
    </div>
  )
}
