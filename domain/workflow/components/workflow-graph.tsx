"use client";

import { Card } from "@/common/components/card";
import { Check, XCircle } from "lucide-react";

interface ActivityNode {
  id: string;
  name: string;
  status: "completed" | "failed" | "running" | "pending";
  duration?: string;
}

const mockActivities: ActivityNode[] = [
  { id: "act-001", name: "Initialize", status: "completed", duration: "0.5s" },
  { id: "act-002", name: "Fetch Data", status: "completed", duration: "2.3s" },
  { id: "act-003", name: "Process Data", status: "running", duration: "5.2s" },
  { id: "act-004", name: "Validate Results", status: "pending" },
  { id: "act-005", name: "Store Output", status: "pending" },
];

export function WorkflowGraph() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Steps</h3>
      </div>

      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-start gap-0 min-w-max">
          {mockActivities.map((activity, index) => (
            <div key={activity.id} className="flex items-start">
              {/* Node container with circle and label */}
              <div className="flex flex-col items-center min-w-[140px]">
                {/* Circle positioned at top */}
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                    activity.status === "completed"
                      ? "bg-muted-foreground/20" // Gray background for completed status
                      : activity.status === "failed"
                      ? "border-2 border-destructive bg-destructive/10"
                      : activity.status === "running"
                      ? "border-2 border-primary bg-primary/10"
                      : "border-2 border-muted-foreground/30 bg-muted"
                  }`}
                >
                  {activity.status === "completed" && (
                    <Check className="h-6 w-6 text-muted-foreground" />
                  )}
                  {activity.status === "failed" && (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  {activity.status === "running" && (
                    <div className="text-lg font-bold text-primary">
                      {index + 1}
                    </div>
                  )}
                  {activity.status === "pending" && (
                    <div className="text-lg font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Label below circle */}
                <div className="text-center mt-2">
                  <p className="text-xs font-medium">{activity.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {activity.id}
                  </p>
                  {activity.duration && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.duration}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting line - positioned at the same height as circle center */}
              {index < mockActivities.length - 1 && (
                <div className="relative w-16 -mx-2" style={{ height: "48px" }}>
                  {/* Line positioned at vertical center (24px from top, which is center of 48px circle) */}
                  <div
                    className="absolute left-0 right-0"
                    style={{ top: "24px" }}
                  >
                    {/* Gradient animated line between completed and running */}
                    {activity.status === "completed" &&
                    mockActivities[index + 1].status === "running" ? (
                      <div className="relative w-full h-0.5 overflow-hidden bg-muted">
                        <div
                          className="absolute inset-0 h-full w-full bg-gradient-to-r from-muted-foreground/20 to-primary"
                          style={{
                            animation: "gradient-flow 2s ease-in-out infinite",
                          }}
                        />
                      </div>
                    ) : activity.status === "completed" ? (
                      /* Gray line for completed steps with muted gray */
                      <div className="w-full h-0.5 bg-muted-foreground/20" />
                    ) : (
                      /* Dotted line for pending steps */
                      <div className="w-full border-t-2 border-dotted border-muted-foreground/30" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Card>
  );
}
