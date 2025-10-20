"use client"

import { Button } from "@/common/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
} from "@/common/components/dropdown-menu"
import { Calendar, User, CheckCircle, Plus, X } from "lucide-react"
import { useWorkflowFilterContext } from "../contexts/workflow-filter-context"

const statusOptions = [
  { value: "Running", label: "Running", color: "bg-blue-500" },
  { value: "Completed", label: "Completed", color: "bg-green-500" },
  { value: "Failed", label: "Failed", color: "bg-red-500" },
  { value: "Pending", label: "Pending", color: "bg-yellow-500" },
  { value: "Terminated", label: "Terminated", color: "bg-gray-500" },
]

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
]

export function WorkflowFilterArea() {
  const { selectedStatuses, setSelectedStatuses } = useWorkflowFilterContext()

  const toggleStatusFilter = (statusValue: string) => {
    const newStatuses = selectedStatuses.includes(statusValue)
      ? selectedStatuses.filter((s) => s !== statusValue)
      : [...selectedStatuses, statusValue]

    setSelectedStatuses(newStatuses)
  }

  const getStatusDisplayLabel = () => {
    if (selectedStatuses.length === statusOptions.length) {
      return `${statusOptions.length} statuses`
    } else if (selectedStatuses.length === 1) {
      return statusOptions.find((s) => s.value === selectedStatuses[0])?.label || ""
    } else {
      return `${selectedStatuses.length} statuses`
    }
  }

  const selectedStatusColors = statusOptions
    .filter((s) => selectedStatuses.includes(s.value))
    .map((s) => s.color)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status Filter */}
      {selectedStatuses.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-[#1E1F22FF] transition-colors text-sm h-7 cursor-pointer">
              <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground font-medium">{getStatusDisplayLabel()}</span>

              {/* Overlapped status dots */}
              {selectedStatusColors.length > 0 && (
                <div className="flex items-center -space-x-1">
                  {selectedStatusColors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${color} border border-background`}
                      style={{ zIndex: selectedStatusColors.length - index }}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedStatuses([])
                }}
                className="ml-0.5 hover:bg-[#1E1F22FF] rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            {statusOptions.map((option) => {
              const isChecked = selectedStatuses.includes(option.value)
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isChecked}
                  onCheckedChange={() => toggleStatusFilter(option.value)}
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Add Filter Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-7 text-sm border-border">
            <Plus className="h-3.5 w-3.5" />
            Add Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {/* Status with submenu */}
          {selectedStatuses.length === 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Status</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        setSelectedStatuses(statusOptions.map((s) => s.value))
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}

          {/* Date Range with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Date Range</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      // TODO: Implement date range filter
                      console.log("Date range:", option.value)
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Author - simple item */}
          <DropdownMenuItem
            onClick={() => {
              // TODO: Implement author filter
              console.log("Author filter")
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Author</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
