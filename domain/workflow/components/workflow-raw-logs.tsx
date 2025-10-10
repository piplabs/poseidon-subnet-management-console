"use client"

import { useState } from "react"
import { Button } from "@/common/components/button"
import { Input } from "@/common/components/input"
import { Copy, Search, XCircle, AlertTriangle } from "lucide-react"

interface LogEntry {
  timestamp: string
  level: "info" | "error" | "warning"
  message: string
}

const mockLogs: LogEntry[] = [
  { timestamp: "09:20:34.477", level: "info", message: "Workflow execution started" },
  { timestamp: "09:20:34.478", level: "info", message: "Collecting input parameters..." },
  { timestamp: "09:20:35.763", level: "info", message: "Validating input schema (0/3)..." },
  {
    timestamp: "09:20:35.825",
    level: "error",
    message: "Error validating input: Invalid parameter type [Error]: Expected string but received number",
  },
  {
    timestamp: "09:20:35.825",
    level: "error",
    message: "  at ValidationManager.validate (/workflow/validator.js:142)",
  },
  { timestamp: "09:20:35.825", level: "error", message: "  at InputProcessor.process (/workflow/input.js:89)" },
  { timestamp: "09:20:35.826", level: "error", message: "  at WorkflowExecutor.run (/workflow/executor.js:234)" },
  { timestamp: "09:20:35.826", level: "info", message: "Retrying with type coercion..." },
  { timestamp: "09:20:35.851", level: "info", message: "Validating input schema (1/3)..." },
  {
    timestamp: "09:20:35.851",
    level: "warning",
    message: "Warning: Deprecated parameter 'legacy_mode' detected. This will be removed in v2.0",
  },
  { timestamp: "09:20:35.852", level: "info", message: "Validating input schema (2/3)..." },
  { timestamp: "09:20:35.852", level: "info", message: "Input validation completed successfully" },
  { timestamp: "09:20:36.123", level: "info", message: "Initializing activity execution pipeline..." },
  { timestamp: "09:20:36.456", level: "info", message: "Activity 'FetchData' started on worker-node-05" },
  { timestamp: "09:20:38.234", level: "info", message: "Activity 'FetchData' completed in 1.778s" },
  { timestamp: "09:20:38.456", level: "info", message: "Activity 'ProcessData' started on worker-node-01" },
]

export function WorkflowRawLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLines, setSelectedLines] = useState<number[]>([])

  const errorCount = mockLogs.filter((log) => log.level === "error").length
  const warningCount = mockLogs.filter((log) => log.level === "warning").length

  const filteredLogs = searchQuery
    ? mockLogs.filter((log) => log.message.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockLogs

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
