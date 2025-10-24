"use client";

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
import { cn, formatTimestampWithTimezone } from "../../../lib/utils";

interface WorkflowTimelineProps {
  workflowId: string;
}

type TimeUnit = "ms" | "s" | "m" | "h";

export function WorkflowTimeline({ workflowId }: WorkflowTimelineProps) {
  const [viewMode, setViewMode] = useState<"minimized" | "expanded">(
    "minimized"
  );
  const [selectedUnit, setSelectedUnit] = useState<TimeUnit>("s"); // Default to seconds
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
  // For pending events, assume they'll take 100ms and add to the timeline
  const completedMaxTime = Math.max(
    ...eventsWithRelativeTime
      .filter((e) => !e.isPending)
      .map((e) => e.relativeEnd),
    0 // Fallback if no completed events
  );
  const hasPendingEvents = eventsWithRelativeTime.some((e) => e.isPending);
  const maxRelativeTime = hasPendingEvents
    ? completedMaxTime + 100 // Add 100 for pending events (in current unit)
    : completedMaxTime;

  // Convert time values from seconds to selected unit
  const convertToSelectedUnit = (seconds: number): number => {
    switch (selectedUnit) {
      case "ms":
        return seconds * 1000; // seconds to milliseconds
      case "s":
        return seconds; // already in seconds
      case "m":
        return seconds / 60; // seconds to minutes
      case "h":
        return seconds / 3600; // seconds to hours
      default:
        return seconds;
    }
  };

  // Convert back from selected unit to seconds (for calculations)
  const convertFromSelectedUnit = (value: number): number => {
    switch (selectedUnit) {
      case "ms":
        return value / 1000; // milliseconds to seconds
      case "s":
        return value; // already in seconds
      case "m":
        return value * 60; // minutes to seconds
      case "h":
        return value * 3600; // hours to seconds
      default:
        return value;
    }
  };

  // Convert all time values to selected unit for display
  const maxRelativeTimeInUnit = convertToSelectedUnit(maxRelativeTime);
  const completedMaxTimeInUnit = convertToSelectedUnit(completedMaxTime);

  // Format absolute timestamp to readable format with user's timezone
  const formatTimestamp = (timestamp: number) => {
    return formatTimestampWithTimezone(new Date(timestamp).toISOString());
  };

  const timelineStart = formatTimestamp(minStartTime);

  // For the end timestamp, use current time if there are pending activities
  const hasPendingActivities = timelineEvents.some(
    (e) => e.status === "pending"
  );
  const timelineEnd = hasPendingActivities
    ? formatTimestamp(Date.now())
    : formatTimestamp(minStartTime + maxRelativeTime);

  // Calculate timeline dimensions with dynamic zoom (working with selected unit)
  // The zoom level determines how many pixels per unit
  const pixelsPerUnit = 500 / zoomLevel; // at 100 zoom: 5px per unit

  // Calculate actual timeline width in pixels based on data
  const timelineWidthPx = maxRelativeTimeInUnit * pixelsPerUnit;

  // Generate time markers with appropriate intervals (in selected unit)
  let markerInterval = Math.max(10, Math.round(maxRelativeTimeInUnit / 10)); // Start with ~10 markers
  const minMarkerSpacingPx = 80;
  const maxMarkerSpacingPx = 150;
  let currentMarkerSpacing = markerInterval * pixelsPerUnit;

  // Adjust marker interval based on selected unit
  const getIntervalStep = () => {
    switch (selectedUnit) {
      case "ms":
        return [100, 500, 1000, 5000]; // milliseconds steps
      case "s":
        return [10, 30, 60, 300]; // seconds steps
      case "m":
        return [1, 5, 10, 30]; // minutes steps
      case "h":
        return [0.25, 0.5, 1, 2]; // hours steps (15min, 30min, 1h, 2h)
      default:
        return [10, 30, 60, 300];
    }
  };

  const steps = getIntervalStep();

  // If markers are too close, increase interval
  while (
    currentMarkerSpacing < minMarkerSpacingPx &&
    markerInterval < maxRelativeTimeInUnit
  ) {
    const currentStepIndex = steps.findIndex((s) => s > markerInterval);
    if (currentStepIndex === -1) {
      markerInterval += steps[steps.length - 1];
    } else {
      markerInterval = steps[currentStepIndex];
    }
    currentMarkerSpacing = markerInterval * pixelsPerUnit;
  }

  // If markers are too far, decrease interval
  while (
    currentMarkerSpacing > maxMarkerSpacingPx &&
    markerInterval > steps[0]
  ) {
    const currentStepIndex = steps.findIndex((s) => s >= markerInterval);
    if (currentStepIndex > 0) {
      markerInterval = steps[currentStepIndex - 1];
    } else {
      break;
    }
    currentMarkerSpacing = markerInterval * pixelsPerUnit;
  }

  const markerCount = Math.ceil(maxRelativeTimeInUnit / markerInterval);
  const timeMarkers = Array.from(
    { length: Math.min(markerCount + 1, 20) },
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
  // 60: bar label, height itself + gap between bars
  const fitTimelineHeightForContent = Math.max(
    60 * eventsWithRelativeTime.length,
    200
  );

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Timeline Container */}
        <div className="relative bg-card border border-border rounded-lg p-4">
          {/* Unit Selector */}
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {(["ms", "s", "m", "h"] as TimeUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors text-gray-300",
                    selectedUnit === unit
                      ? "bg-[#1E1F22FF] text-white hover:text-white"
                      : "bg-card hover:text-gray-50"
                  )}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline boundaries */}
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-muted-foreground">
            <span className="sticky left-0 bg-card/95 backdrop-blur-sm px-1 z-20">
              {timelineStart}
            </span>
            <span className="sticky right-0 bg-card/95 backdrop-blur-sm px-1 z-20">
              {timelineEnd}
            </span>
          </div>

          {/* Timeline visualization - Scrollable wrapper */}
          <div
            className={cn(
              "overflow-x-auto bg-background/50 rounded border border-border/50",
              viewMode === "expanded" ? "max-h-96" : "max-h-60"
            )}
          >
            <div
              className={`relative`}
              style={{
                height: `${fitTimelineHeightForContent}px`,
                width: `${timelineWidthPx}px`,
                minWidth: `${timelineWidthPx}px`,
              }}
            >
              {/* Grid lines - positioned absolutely based on time values */}
              <div className="absolute inset-0">
                {timeMarkers.map((time, i) => {
                  const positionPx = time * pixelsPerUnit;
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
                const now = Math.floor(Date.now() / 1000); // Convert to seconds
                const nowRelative = now - minStartTime;
                const nowRelativeInUnit = convertToSelectedUnit(nowRelative);
                const isNowInRange =
                  nowRelative >= 0 && nowRelative <= maxRelativeTime;

                if (!isNowInRange) return null;

                const nowPositionPx = nowRelativeInUnit * pixelsPerUnit;

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

                  // Convert event times to selected unit
                  const eventStartInUnit = convertToSelectedUnit(
                    event.relativeStart
                  );
                  const eventEndInUnit = convertToSelectedUnit(
                    event.relativeEnd
                  );

                  // Calculate position in pixels
                  const leftPx = isPending
                    ? completedMaxTimeInUnit * pixelsPerUnit + 10 // Just after the last completed event
                    : eventStartInUnit * pixelsPerUnit;

                  const widthPx = isPending
                    ? 30 * pixelsPerUnit // Pending events: 30 units width
                    : (eventEndInUnit - eventStartInUnit) * pixelsPerUnit;

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
                                  <div>
                                    Start:{" "}
                                    {eventStartInUnit.toFixed(
                                      selectedUnit === "ms" ? 0 : 2
                                    )}
                                    {selectedUnit}
                                  </div>
                                  <div>
                                    End:{" "}
                                    {eventEndInUnit.toFixed(
                                      selectedUnit === "ms" ? 0 : 2
                                    )}
                                    {selectedUnit}
                                  </div>
                                  <div>
                                    Duration:{" "}
                                    {(
                                      eventEndInUnit - eventStartInUnit
                                    ).toFixed(selectedUnit === "ms" ? 0 : 2)}
                                    {selectedUnit}
                                  </div>
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

            {/* Time markers - X-axis with drag zoom */}
            <div
              className={`sticky bottom-0 mt-2 text-[10px] hover:cursor-ew-resize h-4 font-mono text-muted-foreground select-none`}
              style={{
                width: `${timelineWidthPx}px`,
                minWidth: `${timelineWidthPx}px`,
              }}
              onMouseDown={handleXAxisMouseDown}
              onMouseMove={handleXAxisMouseMove}
              onMouseUp={handleXAxisMouseUp}
            >
              {timeMarkers.map((time, i) => {
                const positionPx = i === 0 ? 16 : time * pixelsPerUnit;
                const formattedTime =
                  selectedUnit === "ms" || selectedUnit === "s"
                    ? Math.round(time).toString()
                    : time.toFixed(1);
                return (
                  <span
                    key={i}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${positionPx}px` }}
                  >
                    {formattedTime}
                    {selectedUnit}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
