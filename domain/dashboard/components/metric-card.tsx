import { Card } from "@/common/components/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="space-y-2 relative z-10">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-mono">{value}</h3>
          {trend && (
            <span className={`text-sm font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </Card>
  )
}
