"use client"
import { Button } from "@/common/components/button"
import { Input } from "@/common/components/input"
import { Skeleton } from "@/common/components/skeleton"
import { Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTaskQueues } from "../hooks"

export function TaskQueueTable({
  subnetId,
  showViewAll = true,
  showTitle = true,
}: { subnetId?: string; showViewAll?: boolean; showTitle?: boolean }) {
  const router = useRouter()
  const { data: taskQueues, isLoading, error } = useTaskQueues()

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

      {isLoading ? (
        <div className="border border-border rounded-lg p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="border border-border rounded-lg p-8 text-center">
          <p className="text-destructive">Failed to load task queues</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {(subnetId ? taskQueues?.slice(0, 5) : taskQueues)?.map((queue, index) => (
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
      )}
    </div>
  )
}
