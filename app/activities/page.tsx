"use client"

import { Card } from "@/common/components/card"
import { Button } from "@/common/components/button"
import { Input } from "@/common/components/input"
import { WorkflowStatusBadge } from "@/domain/workflow/components/workflow-status-badge"
import { Skeleton } from "@/common/components/skeleton"
import { useActivities } from "@/domain/workflow/hooks"
import { Search, Filter, ChevronRight } from "lucide-react"

export default function ActivitiesPage() {
  const { data: activities, isLoading, error } = useActivities()

  if (isLoading) {
    return (
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground mt-1">Monitor individual activity executions across all workflows</p>
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
    )
  }

  if (error) {
    return (
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground mt-1">Monitor individual activity executions across all workflows</p>
          </div>
          <Card className="p-6">
            <div className="text-destructive">Error loading activities: {error.message}</div>
          </Card>
        </main>
    )
  }

  if (!activities || activities.length === 0) {
    return (
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground mt-1">Monitor individual activity executions across all workflows</p>
          </div>
          <Card className="p-6">
            <div className="text-muted-foreground">No activities found</div>
          </Card>
        </main>
    )
  }

  return (
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-muted-foreground mt-1">Monitor individual activity executions across all workflows</p>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search activities..." className="w-64 pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-[1fr,1.5fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground">
              <div>Activity ID</div>
              <div>Name</div>
              <div>Workflow ID</div>
              <div>Status</div>
              <div>Start Time</div>
              <div>Duration</div>
              <div>Worker</div>
              <div></div>
            </div>

            {activities.map((activity) => (
              <div
                key={activity.id}
                className="grid grid-cols-[1fr,1.5fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/50 cursor-pointer"
                onClick={() => {
                  window.location.href = `/activities/${activity.id}`
                }}
              >
                <div className="font-mono text-sm">{activity.id}</div>
                <div className="text-sm">{activity.name}</div>
                <div className="font-mono text-sm text-primary hover:underline cursor-pointer">
                  {activity.workflowId}
                </div>
                <div>
                  <WorkflowStatusBadge status={activity.status} />
                </div>
                <div className="text-sm text-muted-foreground">{activity.startTime || "-"}</div>
                <div className="font-mono text-sm">{activity.duration || "-"}</div>
                <div className="font-mono text-sm text-muted-foreground">{activity.worker || "-"}</div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </main>
  )
}
