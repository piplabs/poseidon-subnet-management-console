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
import { DatePicker } from "@/common/components/date-picker"
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
  const {
    selectedStatuses,
    setSelectedStatuses,
    startTimeFrom,
    startTimeTo,
    setDateRange,
  } = useWorkflowFilterContext()

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

  const handleDateRangeSelect = (rangeType: string) => {
    const now = new Date()
    let from: Date | undefined
    let to: Date | undefined = now

    switch (rangeType) {
      case "today":
        from = new Date(now.setHours(0, 0, 0, 0))
        to = new Date(now.setHours(23, 59, 59, 999))
        break
      case "yesterday":
        from = new Date(now.setDate(now.getDate() - 1))
        from.setHours(0, 0, 0, 0)
        to = new Date(from)
        to.setHours(23, 59, 59, 999)
        break
      case "last7days":
        from = new Date(now.setDate(now.getDate() - 7))
        from.setHours(0, 0, 0, 0)
        to = new Date()
        break
      case "last30days":
        from = new Date(now.setDate(now.getDate() - 30))
        from.setHours(0, 0, 0, 0)
        to = new Date()
        break
      case "custom":
        // TODO: Open date picker modal
        return
      default:
        return
    }

    if (from && to) {
      setDateRange(from.toISOString(), to.toISOString())
    }
  }

  const getDateRangeLabel = () => {
    if (!startTimeFrom && !startTimeTo) return null

    const dateRangeOption = dateRangeOptions.find((opt) => {
      const now = new Date()
      switch (opt.value) {
        case "today":
          const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString()
          return startTimeFrom?.startsWith(todayStart.split("T")[0])
        case "last7days":
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
          return startTimeFrom && new Date(startTimeFrom) >= sevenDaysAgo
        case "last30days":
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
          return startTimeFrom && new Date(startTimeFrom) >= thirtyDaysAgo
        default:
          return false
      }
    })

    return dateRangeOption?.label || "Custom range"
  }

  const hasDateRangeFilter = startTimeFrom || startTimeTo

  const selectedStatusColors = statusOptions
    .filter((s) => selectedStatuses.includes(s.value))
    .map((s) => s.color)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status Filter */}
      {selectedStatuses.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-[#1E1F22FF] transition-colors text-sm h-7">
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

              <span
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedStatuses([])
                }}
                className="ml-0.5 hover:bg-[#1E1F22FF] rounded-sm p-0.5 text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </span>
            </button>
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

      {/* Start Time Filter */}
      {hasDateRangeFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-[#1E1F22FF] transition-colors text-sm h-7">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Start Time</span>
              <span className="text-foreground font-medium">{getDateRangeLabel()}</span>

              <span
                onClick={(e) => {
                  e.stopPropagation()
                  setDateRange(undefined, undefined)
                }}
                className="ml-0.5 hover:bg-[#1E1F22FF] rounded-sm p-0.5 text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            {dateRangeOptions.slice(0, -1).map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => handleDateRangeSelect(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}

            {/* Custom range with date picker sub-menu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Custom range
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="p-0">
                  <DatePicker
                    startDate={startTimeFrom ? new Date(startTimeFrom) : undefined}
                    endDate={startTimeTo ? new Date(startTimeTo) : undefined}
                    onApply={(start, end) => {
                      setDateRange(start.toISOString(), end.toISOString())
                    }}
                  />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
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

          {/* Start Time with submenu */}
          {!hasDateRangeFilter && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Start Time</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {dateRangeOptions.slice(0, -1).map((option) => (
                    <DropdownMenuItem key={option.value} onClick={() => handleDateRangeSelect(option.value)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}

                  {/* Custom range with date picker sub-menu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Custom range
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="p-0">
                        <DatePicker
                          startDate={startTimeFrom ? new Date(startTimeFrom) : undefined}
                          endDate={startTimeTo ? new Date(startTimeTo) : undefined}
                          onApply={(start, end) => {
                            setDateRange(start.toISOString(), end.toISOString())
                          }}
                        />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}

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
