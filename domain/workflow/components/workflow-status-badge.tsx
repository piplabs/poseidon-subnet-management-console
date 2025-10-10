import { Badge } from "@/common/components/badge"
import { CheckCircle2, XCircle, Clock, PlayCircle, PauseCircle } from "lucide-react"

type WorkflowStatus = "running" | "succeeded" | "failed" | "cancelled" | "pending" | "completed"

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus | string
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const config = {
    running: {
      label: "Running",
      icon: PlayCircle,
      className: "bg-primary/10 text-primary border-primary/20",
    },
    succeeded: {
      label: "Succeeded",
      icon: CheckCircle2,
      className: "bg-success/10 text-success border-success/20",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      className: "bg-success/10 text-success border-success/20",
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    cancelled: {
      label: "Cancelled",
      icon: PauseCircle,
      className: "bg-muted text-muted-foreground border-border",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-warning/10 text-warning border-warning/20",
    },
  }

  const statusConfig = config[status as keyof typeof config] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  }

  const { label, icon: Icon, className } = statusConfig

  return (
    <Badge variant="outline" className={`gap-1.5 ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
