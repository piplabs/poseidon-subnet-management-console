"use client";

import { Card } from "@/common/components/card";
import { Users, Coins } from "lucide-react";

interface MetricsCardProps {
  activeWorkers: number;
  idleWorkers: number;
  totalStaked: string;
  stakingCurrency: string;
}

export function MetricsCard({
  activeWorkers,
  idleWorkers,
  totalStaked,
  stakingCurrency,
}: MetricsCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="space-y-6">
        <h3 className="text-xs text-muted-foreground">Metrics</h3>

        <div className="space-y-8">
          {/* Active Workers */}
          <div className="flex items-start">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Active Workers</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-mono">{activeWorkers}</span>
                <span className="text-xs text-muted-foreground">
                  {idleWorkers} idle
                </span>
              </div>
            </div>
          </div>

          {/* Total Staked */}
          <div className="flex items-start">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Total Staked</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-mono">{totalStaked}</span>
                <span className="text-xs text-muted-foreground">
                  {stakingCurrency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
