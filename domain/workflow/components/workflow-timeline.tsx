"use client"

import { Button } from "@/common/components/button"
import { Skeleton } from "@/common/components/skeleton"
import { useWorkflowTimeline } from "@/domain/workflow/hooks"
import { Minimize2, Filter } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/components/tooltip"

interface WorkflowTimelineProps {
  workflowId?: string
}

export function WorkflowTimeline({ workflowId }: WorkflowTimelineProps) {
  const [viewMode] = useState<"minimized" | "expanded">("minimized")
  const { data: timelineEvents, isLoading, error } = useWorkflowTimeline(workflowId)

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />
  }

  if (error) {
    return <div className="text-destructive">Error loading timeline: {error.message}</div>
  }

  if (!timelineEvents || timelineEvents.length === 0) {
    return <div className="text-muted-foreground">No timeline events found</div>
  }

  // Calculate timeline dimensions
  const maxTime = timelineEvents.length > 0
    ? Math.max(...timelineEvents.map(e => e.endTime || 0))
    : 275
  const timelineStart = timelineEvents[0]?.startTime || "2025-09-01 UTC 05:22:00.017"
  const timelineEnd = timelineEvents[timelineEvents.length - 1]?.endTime || "2025-09-01 UTC 05:22:00.292"

  // Generate time markers
  const markerCount = 19
  const timeMarkers = Array.from({ length: markerCount }, (_, i) => Math.floor((maxTime / markerCount) * (i + 1)))

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-transparent">
            <Minimize2 className="h-3 w-3" />
            Minimized
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-transparent">
            <Filter className="h-3 w-3" />
            Filter
          </Button>
        </div>

        {/* Timeline Container */}
        <div className="relative bg-card border border-border rounded-lg p-4 overflow-x-auto">
          {/* Timeline boundaries */}
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-muted-foreground">
            <span>{timelineStart}</span>
            <span>{timelineEnd}</span>
          </div>

          {/* Timeline visualization */}
          <div className="relative h-32 bg-background/50 rounded border border-border/50">
            {/* Grid lines */}
            <div className="absolute inset-0 flex">
              {timeMarkers.map((time, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-border/30"
                  style={{ minWidth: `${100 / timeMarkers.length}%` }}
                />
              ))}
            </div>

            {/* Left boundary marker */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

            {/* Right boundary marker */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />

            {/* Event bars */}
            <div className="absolute inset-0 flex flex-col justify-center gap-3 px-2">
              {timelineEvents.map((event) => {
                const startTime = typeof event.startTime === 'number' ? event.startTime : 0
                const endTime = typeof event.endTime === 'number' ? event.endTime : startTime
                const leftPercent = (startTime / maxTime) * 100
                const widthPercent = ((endTime - startTime) / maxTime) * 100
                const duration = endTime - startTime

                return (
                  <div key={event.id} className="relative h-6 flex items-center">
                    <span
                      className="absolute bottom-full mb-1 text-xs font-medium text-foreground whitespace-nowrap"
                      style={{ left: `${leftPercent}%` }}
                    >
                      {event.name}
                    </span>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute h-full rounded-md bg-emerald-950/40 border border-emerald-500/40 cursor-pointer hover:bg-emerald-950/60 transition-colors"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-semibold">{event.name}</div>
                          <div className="text-xs text-muted-foreground">
                            <div>ID: {event.id}</div>
                            <div>Start: {event.startTime}ms</div>
                            <div>End: {event.endTime}ms</div>
                            <div>Duration: {duration}ms</div>
                            <div>Status: {event.status}</div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Time markers */}
          <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-muted-foreground">
            {timeMarkers.map((time, i) => (
              <span key={i} className="flex-1 text-center">
                {time}ms
              </span>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
