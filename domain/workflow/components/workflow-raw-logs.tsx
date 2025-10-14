"use client"

import { useState } from "react"
import { Button } from "@/common/components/button"
import { Input } from "@/common/components/input"
import { Skeleton } from "@/common/components/skeleton"
import { useWorkflowLogs } from "@/domain/workflow/hooks"
import { Copy, Search, XCircle, AlertTriangle } from "lucide-react"

interface WorkflowRawLogsProps {
  workflowId?: string
}

export function WorkflowRawLogs({ workflowId }: WorkflowRawLogsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLines, setSelectedLines] = useState<number[]>([])
  const { data: logs, isLoading, error } = useWorkflowLogs(workflowId)

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (error) {
    return <div className="text-destructive">Error loading logs: {error.message}</div>
  }

  if (!logs || logs.length === 0) {
    return <div className="text-muted-foreground">No logs found</div>
  }

  const errorCount = logs.filter((log) => log.level === "error").length
  const warningCount = logs.filter((log) => log.level === "warning").length

  const filteredLogs = searchQuery
    ? logs.filter((log) => log.message.toLowerCase().includes(searchQuery.toLowerCase()))
    : logs

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 h-8 text-xs">
            <Copy className="h-3 w-3" />
            {selectedLines.length > 0 ? `${selectedLines.length} lines selected` : `${filteredLogs.length} lines`}
          </Button>

          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs">
              <XCircle className="h-3 w-3" />
              <span>{errorCount}</span>
            </div>
          )}

          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-warning/10 text-warning text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span>{warningCount}</span>
            </div>
          )}
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Find in logs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-7 pr-12 text-xs bg-background"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘ F
          </kbd>
        </div>
      </div>

      {/* Log viewer */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="font-mono text-xs leading-relaxed">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 px-4 py-1 hover:bg-muted/50 cursor-pointer ${
                  selectedLines.includes(index) ? "bg-primary/10" : ""
                } ${log.level === "error" ? "bg-destructive/5" : ""}`}
                onClick={() => {
                  setSelectedLines((prev) =>
                    prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
                  )
                }}
              >
                <span className="text-muted-foreground select-none shrink-0">{log.timestamp}</span>
                <span
                  className={`${
                    log.level === "error"
                      ? "text-destructive"
                      : log.level === "warning"
                        ? "text-warning"
                        : "text-foreground"
                  }`}
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
