"use client";

import { Clock, User, FileText, GitBranch, Activity } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/tooltip";
import { useEffect, useState } from "react";
import { formatTimestampWithTimezone, getWorkflowStatusBgColor } from "@/lib/utils";

interface WorkflowInfoCardProps {
  workflowId: string;
  type: string;
  definition: string;
  creator: string;
  status: string;
  createdAt: string;
  duration: undefined | string;
  completedSteps: number;
  totalSteps: number;
  workers: number;
  terminationReason?: string;
  terminatedAt?: string;
}

// Item component for label and content
interface ItemProps {
  label: string;
  content: React.ReactNode;
}

function Item({ label, content }: ItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm">
        {content}
      </div>
    </div>
  );
}

// Helper function to calculate relative time
function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return `${diffSeconds}s ago`;
}

// Helper function to format elapsed time
function formatElapsedTime(timestamp: string): string {
  const now = new Date();
  const start = new Date(timestamp);
  const diffMs = now.getTime() - start.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  const hours = diffHours;
  const minutes = diffMinutes % 60;
  const seconds = diffSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

export function WorkflowInfoCard({
  workflowId,
  type,
  definition,
  creator,
  status,
  createdAt,
  duration,
  completedSteps,
  totalSteps,
  workers,
  terminationReason,
  terminatedAt,
}: WorkflowInfoCardProps) {
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const relativeTime = getRelativeTime(createdAt);

  const isTerminated = status.toLowerCase() === "terminated";
  const terminatedRelativeTime = terminatedAt
    ? getRelativeTime(terminatedAt)
    : null;

  // State for live elapsed time updates
  const [elapsedTime, setElapsedTime] = useState<string>(() =>
    formatElapsedTime(createdAt)
  );

  const isRunning = status.toLowerCase() === "running";
  const shouldShowElapsedTime = isRunning && !duration;

  // Update elapsed time every second for running workflows
  useEffect(() => {
    if (!shouldShowElapsedTime) return;

    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldShowElapsedTime, createdAt]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="rounded-md bg-card border border-border shadow-sm">
        <div className="flex flex-col gap-6 overflow-hidden p-4 md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* First Row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Item
                label="ID"
                content={<span className="font-mono">{workflowId}</span>}
              />

              <Item
                label="Type"
                content={
                  <>
                    <GitBranch className="h-4 w-4 flex-none" />
                    <span>{type}</span>
                  </>
                }
              />

              <Item
                label="Status"
                content={
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-2.5 w-2.5 flex-none rounded-full ${getWorkflowStatusBgColor(status)}`}
                    />
                    {isTerminated && terminationReason ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="capitalize cursor-help">
                            {status}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          align="start"
                          alignOffset={-10}
                          sideOffset={6}
                        >
                          <div className="space-y-1 text-xs">
                            <p>{terminationReason}</p>
                            {terminatedAt && terminatedRelativeTime && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Terminated {terminatedRelativeTime}
                                <br />
                                {formatTimestampWithTimezone(terminatedAt)}
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="capitalize">{status}</span>
                    )}
                  </div>
                }
              />

              <Item
                label="Duration"
                content={
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-none" />
                    <span className="tabular-nums">
                      {shouldShowElapsedTime ? elapsedTime : duration}
                    </span>
                    {!shouldShowElapsedTime && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help text-gray-500 text-xs tabular-nums">
                            {relativeTime}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatTimestampWithTimezone(createdAt)}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                }
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Item
                label="Definition"
                content={
                  <>
                    <FileText className="h-4 w-4 flex-none" />
                    <span className="truncate font-mono">{definition}</span>
                  </>
                }
              />

              <Item
                label="Creator"
                content={
                  <>
                    <User className="h-4 w-4 flex-none" />
                    <span className="truncate">{creator}</span>
                  </>
                }
              />

              <Item
                label="Steps"
                content={
                  <>
                    <svg
                      className="h-4 w-4 flex-none"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted"
                        opacity="0.2"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                        strokeDasharray={`${progressPercentage * 0.503} ${
                          (100 - progressPercentage) * 0.503
                        }`}
                        strokeDashoffset="12.575"
                        transform="rotate(-90 10 10)"
                      />
                    </svg>
                    <span>
                      {completedSteps}/{totalSteps}
                    </span>
                  </>
                }
              />

              <Item
                label="Workers"
                content={
                  <>
                    <Activity className="h-4 w-4 flex-none" />
                    <span>{workers}</span>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
