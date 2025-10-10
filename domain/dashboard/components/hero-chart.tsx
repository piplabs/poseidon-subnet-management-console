"use client"

import { Card } from "@/common/components/card"
import { Area, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const chartData = Array.from({ length: 50 }, (_, i) => {
  const date = new Date(2023, 2, 23 + Math.floor(i * 1.5))
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    transactions: 1000 + Math.random() * 3000 + Math.sin(i / 5) * 800,
  }
})

export function HeroChart() {
  const currentCount = chartData[chartData.length - 1].transactions

  return (
    <Card className="p-6 border-0 bg-card/50">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-muted-foreground mb-2">Transaction Count</h1>
        <span className="text-5xl font-bold">{Math.round(currentCount).toLocaleString()}</span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#transactionGradient)"
              animationDuration={0}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
