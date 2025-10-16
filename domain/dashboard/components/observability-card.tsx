"use client";

import { Card } from "@/common/components/card";

interface ObservabilityCardProps {
  workflowSuccessRate: number;
  activitySuccessRate: number;
}

export function ObservabilityCard({
  workflowSuccessRate,
  activitySuccessRate,
}: ObservabilityCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-4">
        <h3 className="text-xs text-muted-foreground">Observability</h3>
      </div>

      {/* Content */}
      <div className="px-4">
        <div className="grid grid-cols-1 gap-4 text-xs">
          {/* Workflow Success Rate */}
          <div>
            <div className="text-muted-foreground mb-1">
              Workflow Success Rate
            </div>
            <div className="font-mono">{workflowSuccessRate.toFixed(1)}%</div>
            <div className="w-full bg-muted rounded-full h-1 mt-1">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${workflowSuccessRate}%` }}
              />
            </div>
          </div>

          {/* Activity Success Rate */}
          <div>
            <div className="text-muted-foreground mb-1">
              Activity Success Rate
            </div>
            <div className="font-mono">{activitySuccessRate.toFixed(1)}%</div>
            <div className="w-full bg-muted rounded-full h-1 mt-1">
              <div
                className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${activitySuccessRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
