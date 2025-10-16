"use client";

import { useState } from "react";
import { Button } from "@/common/components/button";
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
} from "@/common/components/dropdown-menu";
import { Calendar, User, CheckCircle, Plus, X } from "lucide-react";

export interface WorkflowFilter {
  id: string;
  type: "dateRange" | "author" | "status";
  label: string;
  displayLabel: string;
  value?: string | string[];
  selectedStatuses?: string[];
}

const statusOptions = [
  { value: "running", label: "Running", color: "bg-blue-500" },
  { value: "succeeded", label: "Succeeded", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "terminated", label: "Terminated", color: "bg-gray-500" },
];

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

export function WorkflowFilterArea() {
  const [filters, setFilters] = useState<WorkflowFilter[]>([
    {
      id: "default-status",
      type: "status",
      label: "Status",
      displayLabel: `${statusOptions.length} statuses`,
      selectedStatuses: statusOptions.map((s) => s.value),
    },
  ]);

  const addOrUpdateFilter = (
    type: WorkflowFilter["type"],
    label: string,
    displayLabel: string,
    value: string
  ) => {
    const existingFilter = filters.find((f) => f.type === type);

    if (existingFilter) {
      // Update existing filter
      setFilters(
        filters.map((f) =>
          f.type === type ? { ...f, displayLabel, value } : f
        )
      );
    } else {
      // Add new filter
      const newFilter: WorkflowFilter = {
        id: `filter-${Date.now()}`,
        type,
        label,
        displayLabel,
        value,
      };
      setFilters([...filters, newFilter]);
    }
  };

  const toggleStatusFilter = (statusValue: string) => {
    setFilters(
      filters.map((f) => {
        if (f.type === "status") {
          const currentStatuses = f.selectedStatuses || [];
          const newStatuses = currentStatuses.includes(statusValue)
            ? currentStatuses.filter((s) => s !== statusValue)
            : [...currentStatuses, statusValue];

          const displayLabel =
            newStatuses.length === statusOptions.length
              ? `${statusOptions.length} statuses`
              : newStatuses.length === 1
              ? statusOptions.find((s) => s.value === newStatuses[0])?.label ||
                ""
              : `${newStatuses.length} statuses`;

          return {
            ...f,
            selectedStatuses: newStatuses,
            displayLabel,
          };
        }
        return f;
      })
    );
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter((f) => f.id !== filterId));
  };

  const getFilterDisplay = (filter: WorkflowFilter) => {
    const iconMap = {
      status: CheckCircle,
      dateRange: Calendar,
      author: User,
    };
    const Icon = iconMap[filter.type];

    // For status filter, make the whole pill clickable
    if (filter.type === "status") {
      const selectedStatusColors = statusOptions
        .filter((s) => filter.selectedStatuses?.includes(s.value))
        .map((s) => s.color);

      return (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger asChild>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-[#1E1F22FF] transition-colors text-sm h-7 cursor-pointer">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{filter.label}</span>
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
              <span className="text-foreground font-medium">
                {filter.displayLabel}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(filter.id);
                }}
                className="ml-0.5 hover:bg-[#1E1F22FF] rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            {statusOptions.map((option) => {
              const isChecked =
                filter.selectedStatuses?.includes(option.value) || false;
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
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // For other filters
    return (
      <div
        key={filter.id}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-[#1E1F22FF] transition-colors text-sm h-7"
      >
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">{filter.label}</span>
        <span className="text-foreground font-medium">
          {filter.displayLabel}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFilter(filter.id);
          }}
          className="ml-0.5 hover:bg-[#1E1F22FF] rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  };

  const hasFilter = (type: string) => filters.some((f) => f.type === type);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => getFilterDisplay(filter))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-7 text-sm border-border"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {/* Status with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span
                className={hasFilter("status") ? "text-muted-foreground" : ""}
              >
                Status
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      if (!hasFilter("status")) {
                        const newFilter: WorkflowFilter = {
                          id: `filter-${Date.now()}`,
                          type: "status",
                          label: "Status",
                          displayLabel: `${statusOptions.length} statuses`,
                          selectedStatuses: statusOptions.map((s) => s.value),
                        };
                        setFilters([...filters, newFilter]);
                      }
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

          {/* Date Range with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              <span
                className={
                  hasFilter("dateRange") ? "text-muted-foreground" : ""
                }
              >
                Date Range
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      addOrUpdateFilter(
                        "dateRange",
                        "Date Range",
                        option.label,
                        option.value
                      )
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Author - simple item */}
          <DropdownMenuItem
            onClick={() =>
              addOrUpdateFilter("author", "Author", "All Authors", "all")
            }
            disabled={hasFilter("author")}
          >
            <User className="mr-2 h-4 w-4" />
            <span
              className={hasFilter("author") ? "text-muted-foreground" : ""}
            >
              Author
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
