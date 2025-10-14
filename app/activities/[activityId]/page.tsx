"use client"

import { SubnetHeader } from "@/common/components/layout/subnet-header"
import { Button } from "@/common/components/button"
import { Card } from "@/common/components/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/common/components/accordion"
import { WorkflowStatusBadge } from "@/domain/workflow/components/workflow-status-badge"
import { WorkflowTimeline } from "@/domain/workflow/components/workflow-timeline"
import { Skeleton } from "@/common/components/skeleton"
import { useActivity } from "@/domain/workflow/hooks"
import { BarChart3, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ActivityDetailPage({
  params,
}: {
  params: { activityId: string }
}) {
  const { data: activity, isLoading, error } = useActivity(params.activityId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SubnetHeader subnetName="Chutes Subnet" />
        <main className="p-6 space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SubnetHeader subnetName="Chutes Subnet" />
        <main className="p-6 space-y-6">
          <Card className="p-6">
            <div className="text-destructive">Error loading activity: {error.message}</div>
          </Card>
        </main>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <SubnetHeader subnetName="Chutes Subnet" />
        <main className="p-6 space-y-6">
          <Card className="p-6">
            <div className="text-muted-foreground">Activity not found</div>
          </Card>
        </main>
      </div>
    )
  }

  const isFailed = activity.status === "failed"

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
          <span className="text-sm">Activity</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Activity Details</h1>
              <WorkflowStatusBadge status={activity.status as any} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <span className="font-mono">{params.activityId}</span>
              <span className="hidden sm:inline">•</span>
              <span>{activity.name}</span>
              <span className="hidden sm:inline">•</span>
              <span>Started: {activity.startTime || "-"}</span>
              <span className="hidden sm:inline">•</span>
              <span>Duration: {activity.duration || "-"}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Workflow</div>
            <Link
              href={`/workflows/${activity.workflowId}`}
              className="font-mono text-sm text-primary hover:underline"
            >
              {activity.workflowId}
            </Link>
            {activity.workflowName && (
              <div className="text-xs text-muted-foreground mt-1">{activity.workflowName}</div>
            )}
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Worker</div>
            <div className="font-mono text-sm">{activity.worker || "-"}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">End Time</div>
            <div className="text-sm">{activity.endTime || "-"}</div>
          </Card>
        </div>

        {isFailed && activity.error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Error Details</h3>
              </div>
              <div className="space-y-2">
                {activity.error.type && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Error Type</div>
                    <div className="font-mono text-sm">{activity.error.type}</div>
                  </div>
                )}
                {activity.error.message && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Message</div>
                    <div className="text-sm">{activity.error.message}</div>
                  </div>
                )}
                {activity.error.stackTrace && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Stack Trace</div>
                    <pre className="text-xs font-mono bg-background/50 p-3 rounded border border-border overflow-x-auto">
                      {activity.error.stackTrace}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <Card className="border border-border rounded-lg overflow-hidden">
          <Accordion type="multiple" defaultValue={["input", "output"]} className="w-full">
            <AccordionItem value="input" className="border-b border-border px-6">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Input</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <pre className="text-xs font-mono bg-background/50 p-4 rounded border border-border overflow-x-auto">
                  {JSON.stringify(activity.input || {}, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="output" className="px-6">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Output</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <pre className="text-xs font-mono bg-background/50 p-4 rounded border border-border overflow-x-auto">
                  {JSON.stringify(activity.output || {}, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="border border-border rounded-lg overflow-hidden">
          <Accordion type="multiple" defaultValue={["event-history"]} className="w-full">
            <AccordionItem value="event-history" className="px-6">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Event History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <WorkflowTimeline />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </main>
    </div>
  )
}
