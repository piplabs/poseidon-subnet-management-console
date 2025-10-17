import { Badge } from "@/common/components/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  PlayCircle,
  PauseCircle,
  User,
} from "lucide-react";
import { ActivityStatus } from "@/lib/api";

interface WorkflowStatusBadgeProps {
  status: ActivityStatus | string;
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const config: Record<
    ActivityStatus,
    { label: string; icon: React.ElementType; className: string }
  > = {
    Running: {
      label: "Running",
      icon: PlayCircle,
      className: "bg-primary/10 text-primary border-primary/20",
    },
    Scheduled: {
      label: "Scheduled",
      icon: Clock,
      className: "bg-muted text-muted-foreground border-border",
    },
    Claimed: {
      label: "Claimed",
      icon: User,
      className: "bg-primary/10 text-primary border-primary/20",
    },
    Completed: {
      label: "Completed",
      icon: CheckCircle2,
      className: "bg-success/10 text-success border-success/20",
    },
    Failed: {
      label: "Failed",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },

    Pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-warning/10 text-warning border-warning/20",
    },
  };

  const statusConfig = config[status as keyof typeof config] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  };

  const { label, icon: Icon, className } = statusConfig;

  return (
    <Badge variant="outline" className={`gap-1.5 ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
