"use client"
import { Button } from "@/common/components/button"
import { Input } from "@/common/components/input"
import { Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Workflow {
  id: string
  type: string
  status: "running" | "succeeded" | "failed" | "cancelled" | "pending"
  startTime: string
  duration: string
  user: string
  activities: number
}

const mockWorkflows: Workflow[] = [
  {
    id: "wf-001",
    type: "DataProcessing",
    status: "running",
    startTime: "32s (51m ago)",
    duration: "5m 23s",
    user: "0x1234...5678",
    activities: 12,
  },
  {
    id: "wf-002",
    type: "ModelTraining",
    status: "succeeded",
    startTime: "9m 49s (42m ago)",
    duration: "12m 45s",
    user: "0xabcd...ef01",
    activities: 8,
  },
  {
    id: "wf-003",
    type: "DataValidation",
    status: "failed",
    startTime: "24s (51m ago)",
    duration: "2m 10s",
    user: "0x9876...5432",
    activities: 5,
  },
  {
    id: "wf-004",
    type: "BatchProcessing",
    status: "pending",
    startTime: "38s (7h ago)",
    duration: "-",
    user: "0x1234...5678",
    activities: 0,
  },
  {
    id: "wf-005",
    type: "DataProcessing",
    status: "succeeded",
    startTime: "42s (7h ago)",
    duration: "8m 15s",
    user: "0xabcd...ef01",
    activities: 15,
  },
]

export function WorkflowTable({
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
            <h2 className="text-2xl font-semibold">Workflows</h2>
            <p className="text-sm text-muted-foreground mt-1">All workflows from Chutes Subnet</p>
          </div>
          {showViewAll && (
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/workflows")}>
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {!showTitle && showViewAll && (
        <div className="flex justify-end">
          <Button variant="ghost" className="gap-2" onClick={() => router.push("/workflows")}>
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
          <Input placeholder="All Authors..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          Status 5/6
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {mockWorkflows.map((workflow, index) => (
              <tr
                key={workflow.id}
                className={`border-b border-border last:border-b-0 hover:bg-[#1E1F22FF] transition-colors ${
                  index === 0 ? "" : ""
                }`}
              >
                <td className="p-4">
                  <Link href={`/workflows/${workflow.id}`} className="block">
                    <div className="flex items-start gap-4">
                      {/* Column 1: ID and Type */}
                      <div className="min-w-[140px]">
                        <div className="font-mono text-sm font-medium">{workflow.id}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{workflow.type}</div>
                      </div>

                      {/* Column 2: Status and Time */}
                      <div className="min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              workflow.status === "running"
                                ? "bg-blue-500"
                                : workflow.status === "succeeded"
                                  ? "bg-green-500"
                                  : workflow.status === "failed"
                                    ? "bg-red-500"
                                    : workflow.status === "pending"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                            }`}
                          />
                          <span className="text-sm capitalize">{workflow.status}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{workflow.startTime}</div>
                      </div>

                      {/* Column 3: Activities count */}
                      <div className="min-w-[120px]">
                        <div className="text-sm">{workflow.activities} activities</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Duration: {workflow.duration}</div>
                      </div>

                      {/* Column 4: User */}
                      <div className="flex-1 text-right">
                        <div className="text-sm text-muted-foreground">
                          {workflow.startTime.split("(")[1]?.replace(")", "")} by
                        </div>
                        <div className="font-mono text-xs text-muted-foreground mt-0.5">{workflow.user}</div>
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
