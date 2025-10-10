import { Card } from "@/common/components/card"
import { ScrollArea } from "@/common/components/scroll-area"
import { CheckCircle2, XCircle, Clock, Info } from "lucide-react"

interface ActivityEvent {
  id: string
  type: string
  timestamp: string
  status: "success" | "error" | "info" | "pending"
  message: string
}

const mockEvents: ActivityEvent[] = [
  {
    id: "evt-001",
    type: "ActivityStarted",
    timestamp: "14:30:15.234",
    status: "info",
    message: "Activity execution started",
  },
  {
    id: "evt-002",
    type: "InputReceived",
    timestamp: "14:30:15.456",
    status: "success",
    message: "Input parameters validated",
  },
  { id: "evt-003", type: "Processing", timestamp: "14:30:18.123", status: "info", message: "Processing batch 1 of 5" },
  { id: "evt-004", type: "Processing", timestamp: "14:30:21.789", status: "info", message: "Processing batch 2 of 5" },
  {
    id: "evt-005",
    type: "Error",
    timestamp: "14:30:24.456",
    status: "error",
    message: "Connection timeout to external service",
  },
]

export function ActivityEventList() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Event History</h3>
        <p className="text-xs text-muted-foreground mt-1">Chronological log of activity events</p>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="mt-0.5">
                {event.status === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
                {event.status === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                {event.status === "info" && <Info className="h-4 w-4 text-primary" />}
                {event.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{event.type}</span>
                  <span className="text-xs font-mono text-muted-foreground">{event.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground">{event.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
