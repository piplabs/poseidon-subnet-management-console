import { SubnetHeader } from "@/common/components/layout/subnet-header"
import { MetricCard } from "@/domain/dashboard/components/metric-card"
import { ChartCard } from "@/domain/dashboard/components/chart-card"
import { WorkflowTable } from "@/domain/workflow/components/workflow-table"
import { TaskQueueTable } from "@/domain/task/components/task-queue-table"
import { Users, Coins, GitBranch, TrendingUp, Clock, Activity } from "lucide-react"

const workflowData = [
  { time: "00:00", value: 10 },
  { time: "01:00", value: 15 },
  { time: "02:00", value: 20 },
  { time: "03:00", value: 25 },
  { time: "04:00", value: 30 },
  { time: "05:00", value: 35 },
  { time: "06:00", value: 40 },
  { time: "07:00", value: 45 },
  { time: "08:00", value: 50 },
  { time: "09:00", value: 55 },
  { time: "10:00", value: 60 },
  { time: "11:00", value: 65 },
  { time: "12:00", value: 70 },
  { time: "13:00", value: 75 },
  { time: "14:00", value: 80 },
  { time: "15:00", value: 85 },
  { time: "16:00", value: 90 },
  { time: "17:00", value: 95 },
  { time: "18:00", value: 100 },
  { time: "19:00", value: 105 },
  { time: "20:00", value: 110 },
  { time: "21:00", value: 115 },
  { time: "22:00", value: 120 },
  { time: "23:00", value: 125 },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SubnetHeader subnetName="Chutes Subnet" />

      <main className="p-6 space-y-6">
        {/* Subnet Header */}
        <div>
          <h1 className="text-3xl font-bold">Chutes Subnet</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">subnet-001</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard title="Active Workers" value={24} subtitle="8 idle" icon={Users} />
          <MetricCard title="Total Staked" value="1.2M" subtitle="ETH" icon={Coins} />
          <MetricCard title="Workflow Runs" value={234} subtitle="Last 24 hours" icon={GitBranch} />
          <MetricCard title="Workflow Success Rate" value="96.5%" subtitle="Last 7 days" icon={TrendingUp} />
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
        <WorkflowTable />

        {/* Task Queue Table */}
        <TaskQueueTable />
      </main>
    </div>
  )
}
