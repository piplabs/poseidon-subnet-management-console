"use client"

import { Card } from "@/common/components/card"
import { ScrollArea } from "@/common/components/scroll-area"
import { Skeleton } from "@/common/components/skeleton"
import { useActivityEvents } from "@/domain/workflow/hooks"
import { CheckCircle2, XCircle, Clock, Info } from "lucide-react"

interface ActivityEventListProps {
  activityId?: string
}

export function ActivityEventList({ activityId }: ActivityEventListProps) {
  const { data: events, isLoading, error } = useActivityEvents(activityId)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium">Event History</h3>
          <p className="text-xs text-muted-foreground mt-1">Chronological log of activity events</p>
        </div>
        <Skeleton className="h-96 w-full" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium">Event History</h3>
          <p className="text-xs text-muted-foreground mt-1">Chronological log of activity events</p>
        </div>
        <div className="text-destructive">Error loading events: {error.message}</div>
      </Card>
    )
  }

  if (!events || events.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium">Event History</h3>
          <p className="text-xs text-muted-foreground mt-1">Chronological log of activity events</p>
        </div>
        <div className="text-muted-foreground">No events found</div>
      </Card>
    )
  }
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Event History</h3>
        <p className="text-xs text-muted-foreground mt-1">Chronological log of activity events</p>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="mt-0.5">
                {event.status === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
                {event.status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                {event.status === "info" && <Info className="h-4 w-4 text-primary" />}
                {event.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{event.type}</span>
                  <span className="text-xs font-mono text-muted-foreground">{event.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground">{event.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
