"use client"

import { useState } from "react"
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
} from "@/common/components/dropdown-menu"
import { Calendar, Search, ArrowUpDown, Plus, X, Filter } from "lucide-react"

export interface TaskFilter {
  id: string
  type: "dateRange" | "search" | "sort" | "depth"
  label: string
  displayLabel: string
  value?: string
}

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
]

const sortOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
]

export function TaskFilterArea() {
  const [filters, setFilters] = useState<TaskFilter[]>([
    {
      id: "default-sort",
      type: "sort",
      label: "Sort",
      displayLabel: "Descending",
      value: "desc",
    },
  ])

  const addOrUpdateFilter = (
    type: TaskFilter["type"],
    label: string,
    displayLabel: string,
    value: string
  ) => {
    const existingFilter = filters.find((f) => f.type === type)

    if (existingFilter) {
      // Update existing filter
      setFilters(
        filters.map((f) =>
          f.type === type ? { ...f, displayLabel, value } : f
        )
      )
    } else {
      // Add new filter
      const newFilter: TaskFilter = {
        id: `filter-${Date.now()}`,
        type,
        label,
        displayLabel,
        value,
      }
      setFilters([...filters, newFilter])
    }
  }

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter((f) => f.id !== filterId))
  }

  const getFilterDisplay = (filter: TaskFilter) => {
    const iconMap = {
      sort: ArrowUpDown,
      dateRange: Calendar,
      search: Search,
      depth: Filter,
    }
    const Icon = iconMap[filter.type]

    return (
      <div
        key={filter.id}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-[#1E1F22FF] transition-colors text-sm h-7"
      >
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">{filter.label}</span>
        <span className="text-foreground font-medium">{filter.displayLabel}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeFilter(filter.id)
          }}
          className="ml-0.5 hover:bg-[#1E1F22FF] rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    )
  }

  const hasFilter = (type: string) => filters.some((f) => f.type === type)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => getFilterDisplay(filter))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-7 text-sm border-border">
            <Plus className="h-3.5 w-3.5" />
            Add Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {/* Sort - simple item */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span className={hasFilter("sort") ? "text-muted-foreground" : ""}>Sort</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => addOrUpdateFilter("sort", "Sort", option.label, option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Date Range with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              <span className={hasFilter("dateRange") ? "text-muted-foreground" : ""}>Date Range</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => addOrUpdateFilter("dateRange", "Date Range", option.label, option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Search - simple item */}
          <DropdownMenuItem
            onClick={() => addOrUpdateFilter("search", "Search", "All Queues", "all")}
            disabled={hasFilter("search")}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className={hasFilter("search") ? "text-muted-foreground" : ""}>Search</span>
          </DropdownMenuItem>

          {/* Depth - simple item */}
          <DropdownMenuItem
            onClick={() => addOrUpdateFilter("depth", "Depth", "All Depths", "all")}
            disabled={hasFilter("depth")}
          >
            <Filter className="mr-2 h-4 w-4" />
            <span className={hasFilter("depth") ? "text-muted-foreground" : ""}>Depth</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
