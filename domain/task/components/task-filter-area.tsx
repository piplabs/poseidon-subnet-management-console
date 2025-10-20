"use client"

import { Input } from "@/common/components/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu"
import { Button } from "@/common/components/button"
import { Search, ChevronDown } from "lucide-react"
import { useTaskQueueFilterContext } from "../contexts/task-queue-filter-context"

const includeOptions = [
  { value: "activities", label: "Activities" },
  { value: "workflows", label: "Workflows" },
]

export function TaskFilterArea() {
  const {
    queueId,
    setQueueId,
    includeActivities,
    includeWorkflows,
    toggleIncludeActivities,
    toggleIncludeWorkflows,
  } = useTaskQueueFilterContext()

  const getIncludeLabel = () => {
    const selected = []
    if (includeActivities) selected.push("Activities")
    if (includeWorkflows) selected.push("Workflows")

    if (selected.length === 0) return "All Types"
    if (selected.length === 2) return "All Types"
    return selected[0]
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Queue ID Search Input */}
      <div className="relative w-[240px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search queue ID..."
          value={queueId || ""}
          onChange={(e) => setQueueId(e.target.value || undefined)}
          className="pl-9 h-8 text-sm"
        />
      </div>

      {/* Type Dropdown with Checkboxes */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8 text-sm">
            <span>{getIncludeLabel()}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px]">
          <DropdownMenuCheckboxItem
            checked={includeActivities}
            onCheckedChange={toggleIncludeActivities}
            onSelect={(e) => e.preventDefault()}
          >
            Activities
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={includeWorkflows}
            onCheckedChange={toggleIncludeWorkflows}
            onSelect={(e) => e.preventDefault()}
          >
            Workflows
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
