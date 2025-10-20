"use client";

import { Card } from "@/common/components/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface WorkflowsCardProps {
  totalWorkflows: {
    started: number;
    active: number;
    completed: number;
    failed: number;
  };
}

const COLORS = {
  started: "hsla(206,100%,50%,1)",
  active: "hsla(39,85%,49%,1)",
  completed: "hsl(142, 76%, 36%)",
  failed: "hsla(358,75%,59%,1)",
};

export function WorkflowsCard({ totalWorkflows }: WorkflowsCardProps) {
  const data = [
    { name: "Started", value: totalWorkflows.started, color: COLORS.started },
    { name: "Active", value: totalWorkflows.active, color: COLORS.active },
    {
      name: "Completed",
      value: totalWorkflows.completed,
      color: COLORS.completed,
    },
    { name: "Failed", value: totalWorkflows.failed, color: COLORS.failed },
  ];

  const total =
    totalWorkflows.started +
    totalWorkflows.active +
    totalWorkflows.completed +
    totalWorkflows.failed;

  const renderCustomLabel = ({
    cx,
    cy,
  }: {
    cx?: string | number;
    cy?: string | number;
  }) => {
    const centerX = typeof cx === "number" ? cx : parseFloat(cx || "0");
    const centerY = typeof cy === "number" ? cy : parseFloat(cy || "0");

    return (
      <g>
        <text
          x={centerX}
          y={centerY - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-[20px] font-mono"
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Total
        </text>
      </g>
    );
  };

  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] text-muted-foreground">
                {entry.name}
              </span>
              <span className="text-xs font-mono">{entry.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="space-y-6">
        <h3 className="text-xs text-muted-foreground">Workflows</h3>

        {/* Centered Pie Chart */}
        <div className="w-full h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
                width={120}
                height={120}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        {renderLegend()}
      </div>
    </Card>
  );
}
