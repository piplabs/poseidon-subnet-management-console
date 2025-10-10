"use client"
import { Button } from "@/common/components/button"
import { Input } from "@/common/components/input"
import { Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TaskQueue {
  id: string
  name: string
  pendingActivities: number
  oldestPendingActivity: string
  averageWaitTime: string
  throughput: string
  currentDepth: number
  createdAt: string
}

const mockTaskQueues: TaskQueue[] = [
  {
    id: "queue-001",
    name: "high-priority-tasks",
    pendingActivities: 45,
    oldestPendingActivity: "2m 15s",
    averageWaitTime: "1m 32s",
    throughput: "120/hr",
    currentDepth: 45,
    createdAt: "2h ago",
  },
  {
    id: "queue-002",
    name: "data-processing",
    pendingActivities: 128,
    oldestPendingActivity: "5m 42s",
    averageWaitTime: "3m 18s",
    throughput: "85/hr",
    currentDepth: 128,
    createdAt: "1d ago",
  },
  {
    id: "queue-003",
    name: "model-training",
    pendingActivities: 12,
    oldestPendingActivity: "45s",
    averageWaitTime: "2m 5s",
    throughput: "45/hr",
    currentDepth: 12,
    createdAt: "3h ago",
  },
  {
    id: "queue-004",
    name: "batch-jobs",
    pendingActivities: 67,
    oldestPendingActivity: "8m 20s",
    averageWaitTime: "4m 55s",
    throughput: "60/hr",
    currentDepth: 67,
    createdAt: "5h ago",
  },
  {
    id: "queue-005",
    name: "low-priority-tasks",
    pendingActivities: 203,
    oldestPendingActivity: "15m 30s",
    averageWaitTime: "8m 12s",
    throughput: "30/hr",
    currentDepth: 203,
    createdAt: "12h ago",
  },
]

export function TaskQueueTable({
  subnetId,
  showViewAll = true,
  showTitle = true,
}: { subnetId?: string; showViewAll?: boolean; showTitle?: boolean }) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Task Queues</h2>
            <p className="text-sm text-muted-foreground mt-1">Monitor all task queues and their metrics</p>
          </div>
          {showViewAll && (
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/task-queue")}>
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {!showTitle && showViewAll && (
        <div className="flex justify-end">
          <Button variant="ghost" className="gap-2" onClick={() => router.push("/task-queue")}>
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Select Date Range
        </Button>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search queues..." className="pl-9" />
        </div>
        <Button variant="outline">Sort by Depth</Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {(subnetId ? mockTaskQueues.slice(0, 5) : mockTaskQueues).map((queue, index) => (
              <tr
                key={queue.id}
                className={`border-b border-border last:border-b-0 hover:bg-[#1E1F22FF] transition-colors ${
                  index === 0 ? "" : ""
                }`}
              >
                <td className="p-4">
                  <Link href={`/task-queue/${queue.id}`} className="block">
                    <div className="flex items-start gap-4">
                      {/* Column 1: Queue Name and ID */}
                      <div className="min-w-[180px]">
                        <div className="font-medium text-sm">{queue.name}</div>
                        <div className="font-mono text-xs text-muted-foreground mt-0.5">{queue.id}</div>
                      </div>

                      {/* Column 2: Pending Activities and Depth */}
                      <div className="min-w-[140px]">
                        <div className="text-sm">
                          <span className="font-medium">{queue.pendingActivities}</span> pending
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Depth: {queue.currentDepth}</div>
                      </div>

                      {/* Column 3: Wait Times */}
                      <div className="min-w-[140px]">
                        <div className="text-sm">Oldest: {queue.oldestPendingActivity}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Avg: {queue.averageWaitTime}</div>
                      </div>

                      {/* Column 4: Throughput */}
                      <div className="min-w-[100px]">
                        <div className="text-sm">{queue.throughput}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Throughput</div>
                      </div>

                      {/* Column 5: Created At */}
                      <div className="flex-1 text-right">
                        <div className="text-sm text-muted-foreground">Created</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{queue.createdAt}</div>
                      </div>
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
