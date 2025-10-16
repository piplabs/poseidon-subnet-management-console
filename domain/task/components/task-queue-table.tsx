"use client"
import { Skeleton } from "@/common/components/skeleton"
import Link from "next/link"
import { useTaskQueues } from "../hooks"

export function TaskQueueTable({ subnetId }: { subnetId?: string }) {
  const { data: taskQueues, isLoading, error } = useTaskQueues()

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-destructive">Failed to load task queues</p>
      </div>
    )
  }

  return (
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
  )
}
