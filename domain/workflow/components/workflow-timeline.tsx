"use client";

import { Button } from "@/common/components/button";
import { Skeleton } from "@/common/components/skeleton";
import { useWorkflowTimeline } from "@/domain/workflow/hooks";
import { Minimize2, Filter } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/tooltip";

interface WorkflowTimelineProps {
  workflowId: string;
}

export function WorkflowTimeline({ workflowId }: WorkflowTimelineProps) {
  console.log(workflowId);
  const [viewMode] = useState<"minimized" | "expanded">("minimized");
  const [zoomLevel, setZoomLevel] = useState(100); // Starting interval in ms
  const {
    data: timelineEvents,
    isLoading,
    error,
  } = useWorkflowTimeline(workflowId);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error loading timeline: {error.message}
      </div>
    );
  }

  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div className="text-muted-foreground">No timeline events found</div>
    );
  }

  // Find the earliest start time (timeline origin)
  const minStartTime = Math.min(
    ...timelineEvents
      .filter((e) => e.status !== "pending" && e.startTime > 0)
      .map((e) => e.startTime)
  );

  // Calculate relative times and find the maximum duration
  const eventsWithRelativeTime = timelineEvents.map((event) => {
    if (event.status === "pending" || event.startTime === 0) {
      return {
        ...event,
        relativeStart: 0,
        relativeEnd: 0,
        isPending: true,
      };
    }
    return {
      ...event,
      relativeStart: event.startTime - minStartTime,
      relativeEnd: event.endTime - minStartTime,
      isPending: false,
    };
  });

  // Find the maximum relative time for timeline scale
  const maxRelativeTime = Math.max(
    ...eventsWithRelativeTime
      .filter((e) => !e.isPending)
      .map((e) => e.relativeEnd)
  );

  // Format absolute timestamp to readable format
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").substring(0, 23);
  };

  const timelineStart = formatTimestamp(minStartTime);

  // For the end timestamp, use current time if there are pending activities
  const hasPendingActivities = timelineEvents.some(
    (e) => e.status === "pending"
  );
  const timelineEnd = hasPendingActivities
    ? formatTimestamp(Date.now())
    : formatTimestamp(minStartTime + maxRelativeTime);

  // Calculate timeline dimensions with dynamic zoom
  // Scale based on zoom level: at 100ms zoom, 1ms = 2px; at 10ms zoom, 1ms = 20px
  const pixelsPerMs = 200 / zoomLevel; // pixels per millisecond

  // Round up to nearest interval to ensure all events fit
  const markerInterval = zoomLevel; // Dynamic based on zoom
  const timelineWidth =
    Math.ceil(maxRelativeTime / markerInterval) * markerInterval;
  const timelineWidthPx = timelineWidth * pixelsPerMs;

  // Generate time markers with fixed intervals
  const markerCount = Math.ceil(timelineWidth / markerInterval);
  const timeMarkers = Array.from(
    { length: markerCount + 1 },
    (_, i) => i * markerInterval
  );

  // Handle wheel event for zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY === 0) return;
    e.preventDefault();

    setZoomLevel((prev) => {
      // Zoom in (scroll down) = decrease interval (more detailed)
      // Zoom out (scroll up) = increase interval (less detailed)
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(10, Math.min(1000, prev + delta));
      return newZoom;
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-8 text-xs bg-transparent"
          >
            <Minimize2 className="h-3 w-3" />
            Minimized
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-8 text-xs bg-transparent"
          >
            <Filter className="h-3 w-3" />
            Filter
          </Button>
        </div>

        {/* Timeline Container */}
        <div
          className="relative bg-card border border-border rounded-lg p-4 overflow-x-auto"
          onWheel={handleWheel}
        >
          {/* Timeline boundaries */}
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-muted-foreground">
            <span className="sticky left-0 bg-card/95 backdrop-blur-sm px-1 z-20">
              {timelineStart}
            </span>
            <span className="sticky right-0 bg-card/95 backdrop-blur-sm px-1 z-20">
              {timelineEnd}
            </span>
          </div>

          {/* Timeline visualization - Fixed background wrapper */}
          <div className="relative h-32 bg-background/50 rounded border border-border/50 overflow-hidden">
            {/* Scrollable timeline content */}
            <div
              className="relative h-full overflow-visible"
              style={{
                width: `${timelineWidthPx}px`,
                minWidth: `${timelineWidthPx}px`,
              }}
            >
              {/* Grid lines - positioned absolutely based on time values */}
              <div className="absolute inset-0">
                {timeMarkers.map((time, i) => {
                  const position = (time / timelineWidth) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-border/30"
                      style={{ left: `${position}%` }}
                    />
                  );
                })}
              </div>

              {/* "Now" indicator - only show if current time is within timeline range */}
              {(() => {
                const now = Date.now();
                const nowRelative = now - minStartTime;
                const isNowInRange =
                  nowRelative >= 0 && nowRelative <= maxRelativeTime;

                if (!isNowInRange) return null;

                const nowPositionPx = nowRelative * pixelsPerMs;

                return (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                    style={{ left: `${nowPositionPx}px` }}
                    title="Current Time"
                  />
                );
              })()}

              {/* Event bars */}
              <div className="absolute inset-0 px-2">
                {eventsWithRelativeTime.map((event, index) => {
                  // For pending events, show a small hatched box at the end
                  const isPending = event.isPending;

                  // Calculate position in pixels
                  const leftPx = isPending
                    ? maxRelativeTime * pixelsPerMs + 10 // Just after the last event
                    : event.relativeStart * pixelsPerMs;

                  const widthPx = isPending
                    ? 60 // Small fixed width for pending (60px)
                    : (event.relativeEnd - event.relativeStart) * pixelsPerMs;

                  const duration = event.relativeEnd - event.relativeStart;

                  // Calculate vertical position for each event
                  const eventHeight = 24; // h-6 = 24px
                  const gap = 12; // gap-3 = 12px
                  const totalHeight =
                    eventsWithRelativeTime.length * eventHeight +
                    (eventsWithRelativeTime.length - 1) * gap;
                  const containerHeight = 128; // h-32 = 128px
                  const startY = (containerHeight - totalHeight) / 2;
                  const itemGap = 28;
                  const topPosition = startY + index * (eventHeight + itemGap);

                  return (
                    <div
                      key={event.id}
                      className="absolute h-6"
                      style={{ top: `${topPosition}px` }}
                    >
                      <span
                        className="absolute bottom-full mb-1 text-xs font-medium text-foreground whitespace-nowrap"
                        style={{ left: `${leftPx}px` }}
                      >
                        {event.name}
                      </span>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`absolute h-full rounded-md cursor-pointer transition-colors ${
                              isPending
                                ? "bg-emerald-950/20 border border-emerald-500/30 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(16,185,129,0.1)_4px,rgba(16,185,129,0.1)_8px)]"
                                : "bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-950/60"
                            }`}
                            style={{
                              left: `${leftPx}px`,
                              width: `${widthPx}px`,
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-semibold">{event.name}</div>
                            <div className="text-xs text-muted-foreground">
                              <div>ID: {event.id}</div>
                              {!isPending && (
                                <>
                                  <div>Start: {event.relativeStart}ms</div>
                                  <div>End: {event.relativeEnd}ms</div>
                                  <div>Duration: {duration}ms</div>
                                </>
                              )}
                              <div>Status: {event.status}</div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time markers */}
          <div
            className="relative mt-2 text-[10px] font-mono text-muted-foreground"
            style={{
              width: `${timelineWidthPx}px`,
              minWidth: `${timelineWidthPx}px`,
            }}
          >
            {timeMarkers.map((time, i) => {
              const position = (time / timelineWidth) * 100;
              return (
                <span
                  key={i}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  {time}ms
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
