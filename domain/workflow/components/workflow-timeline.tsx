"use client"

import { Button } from "@/common/components/button"
import { Minimize2, Filter } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/components/tooltip"

interface TimelineEvent {
  id: string
  name: string
  startTime: number // milliseconds from workflow start
  endTime: number // milliseconds from workflow start
  status: "success" | "error" | "running" | "pending"
}

const mockTimelineEvents: TimelineEvent[] = [
  { id: "evt-001", name: "withdraw", startTime: 72, endTime: 116, status: "success" },
  { id: "evt-002", name: "deposit", startTime: 159, endTime: 232, status: "success" },
]

export function WorkflowTimeline() {
  const [viewMode] = useState<"minimized" | "expanded">("minimized")

  // Calculate timeline dimensions
  const maxTime = 275 // ms
  const timelineStart = "2025-09-01 UTC 05:22:00.017"
  const timelineEnd = "2025-09-01 UTC 05:22:00.292"

  // Generate time markers (every ~15ms)
  const timeMarkers = Array.from({ length: 19 }, (_, i) => i * 14 + 14)

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
              {mockTimelineEvents.map((event) => {
                const leftPercent = (event.startTime / maxTime) * 100
                const widthPercent = ((event.endTime - event.startTime) / maxTime) * 100
                const duration = event.endTime - event.startTime

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
