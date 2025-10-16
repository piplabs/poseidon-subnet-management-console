"use client";

import { Button } from "@/common/components/button";
import { Skeleton } from "@/common/components/skeleton";
import { useWorkflowTimeline } from "@/domain/workflow/hooks";
import {
  Minimize2,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Expand,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu";
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
  const [viewMode, setViewMode] = useState<"minimized" | "expanded">(
    "minimized"
  );
  const [zoomLevel, setZoomLevel] = useState(100); // Starting interval in ms
  const [isDraggingXAxis, setIsDraggingXAxis] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartZoom, setDragStartZoom] = useState(100);

  const {
    data: timelineEvents,
    isLoading,
    error,
  } = useWorkflowTimeline(workflowId);

  // Add global mouse move and mouse up handlers for smoother dragging
  useEffect(() => {
    if (!isDraggingXAxis) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      const zoomChange = deltaX / 3;
      let newZoom = dragStartZoom + zoomChange;
      newZoom = Math.max(10, Math.min(1000, newZoom));
      setZoomLevel(newZoom);
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingXAxis(false);
      // Round to nearest 10ms for clean final value
      setZoomLevel((prev) => Math.round(prev / 10) * 10);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDraggingXAxis, dragStartX, dragStartZoom]);

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
  // The zoom level determines how many pixels per millisecond
  // Lower zoomLevel = more zoomed in = more pixels per ms
  const pixelsPerMs = 500 / zoomLevel; // at 100ms zoom: 50px per ms, at 10ms zoom: 500px per ms

  // Calculate actual timeline width in pixels based on data
  const timelineWidthPx = maxRelativeTime * pixelsPerMs;

  // Generate time markers with appropriate intervals based on zoom
  // Adjust marker interval to keep reasonable spacing
  let markerInterval = Math.max(10, Math.round(zoomLevel / 10) * 10); // Start with rounded zoom level
  const minMarkerSpacingPx = 100; // Minimum pixels between markers (increased)
  const maxMarkerSpacingPx = 200; // Maximum pixels between markers
  let currentMarkerSpacing = markerInterval * pixelsPerMs;

  // If markers are too close, increase interval (by clean multiples)
  while (currentMarkerSpacing < minMarkerSpacingPx && markerInterval < 10000) {
    if (markerInterval < 10) {
      markerInterval = 10;
    } else if (markerInterval < 50) {
      markerInterval += 10;
    } else if (markerInterval < 100) {
      markerInterval += 50;
    } else if (markerInterval < 500) {
      markerInterval += 100;
    } else {
      markerInterval += 500;
    }
    currentMarkerSpacing = markerInterval * pixelsPerMs;
  }

  // If markers are too far, decrease interval (by clean multiples)
  while (currentMarkerSpacing > maxMarkerSpacingPx && markerInterval > 10) {
    if (markerInterval <= 10) {
      break;
    } else if (markerInterval <= 50) {
      markerInterval -= 10;
    } else if (markerInterval <= 100) {
      markerInterval -= 50;
    } else if (markerInterval <= 500) {
      markerInterval -= 100;
    } else {
      markerInterval -= 500;
    }
    currentMarkerSpacing = markerInterval * pixelsPerMs;
    if (markerInterval < 10) {
      markerInterval = 10;
      break;
    }
  }

  const markerCount = Math.ceil(maxRelativeTime / markerInterval);
  const timeMarkers = Array.from(
    { length: markerCount + 1 },
    (_, i) => i * markerInterval
  );

  // X-axis drag zoom handlers
  const handleXAxisMouseDown = (e: React.MouseEvent) => {
    setIsDraggingXAxis(true);
    setDragStartX(e.clientX);
    setDragStartZoom(zoomLevel);
  };

  const handleXAxisMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingXAxis) return;

    const deltaX = e.clientX - dragStartX;
    // Drag right = zoom out (increase interval), drag left = zoom in (decrease interval)
    const zoomChange = deltaX / 3; // 3px drag = 1ms change (smooth)
    let newZoom = dragStartZoom + zoomChange;

    // Clamp to range (don't round during drag for smoothness)
    newZoom = Math.max(10, Math.min(1000, newZoom));

    setZoomLevel(newZoom);
  };

  const handleXAxisMouseUp = () => {
    setIsDraggingXAxis(false);
  };

  // Dynamic height based on view mode
  const timelineHeight = viewMode === "expanded" ? "h-96" : "h-48";
  const timelineHeightPx = viewMode === "expanded" ? 384 : 192;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-8 text-xs bg-transparent"
            onClick={() =>
              setViewMode(viewMode === "minimized" ? "expanded" : "minimized")
            }
          >
            {viewMode === "expanded" ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Expand className="h-3 w-3" />
            )}
            {viewMode === "minimized" ? "Expanded" : "Minimized"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-8 text-xs bg-transparent"
              >
                <Filter className="h-3 w-3" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Status submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span>Backlog</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full border-2 border-gray-400" />
                      <span>Proposal</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full border-2 border-gray-400" />
                      <span>Design Ready</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full border-2 border-gray-400" />
                      <span>Project Kickoff</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>In Progress: on track</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span>In Progress: at risk</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span>In Progress: off track</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Maintenance</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span>Completed</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      <span>Paused</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      <span>Canceled</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Date Range */}
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Date Range</span>
              </DropdownMenuItem>

              {/* Author */}
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Author</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Timeline Container */}
        <div className="relative bg-card border border-border rounded-lg p-4 overflow-x-auto">
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
          <div
            className={`relative ${timelineHeight} bg-background/50 rounded border border-border/50 overflow-hidden`}
          >
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
                  const positionPx = time * pixelsPerMs;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-border/30"
                      style={{ left: `${positionPx}px` }}
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
                  const containerHeight = timelineHeightPx; // Dynamic based on view mode
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

          {/* Time markers - X-axis with drag zoom */}
          <div
            className={`relative mt-2 text-[10px] hover:cursor-ew-resize h-4 font-mono text-muted-foreground select-none`}
            style={{
              width: `${timelineWidthPx}px`,
              minWidth: `${timelineWidthPx}px`,
            }}
            onMouseDown={handleXAxisMouseDown}
            onMouseMove={handleXAxisMouseMove}
            onMouseUp={handleXAxisMouseUp}
          >
            {timeMarkers.map((time, i) => {
              const positionPx = time * pixelsPerMs;
              return (
                <span
                  key={i}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${positionPx}px` }}
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
