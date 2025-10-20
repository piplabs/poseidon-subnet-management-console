"use client"

import { useState, useCallback } from "react"
import { buildContext } from "@/lib/react/build-context"

export interface WorkflowFilterState {
  selectedStatuses: string[]
  workflowType?: string
  startTimeFrom?: string
  startTimeTo?: string
  sortBy?: string
  page: number
  pageSize: number
}

export interface WorkflowFilterActions {
  setSelectedStatuses: (statuses: string[]) => void
  setWorkflowType: (type: string | undefined) => void
  setDateRange: (from: string | undefined, to: string | undefined) => void
  setSortBy: (sortBy: string | undefined) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  loadMore: () => void
  resetFilters: () => void
}

export type WorkflowFilterContextValue = WorkflowFilterState & WorkflowFilterActions

const DEFAULT_STATUSES = ["Running", "Completed", "Failed", "Pending", "Terminated"]

const initialState: WorkflowFilterState = {
  selectedStatuses: DEFAULT_STATUSES,
  workflowType: undefined,
  startTimeFrom: undefined,
  startTimeTo: undefined,
  sortBy: undefined,
  page: 1,
  pageSize: 20,
}

const [WorkflowFilterContextProvider, useWorkflowFilterContextRaw] =
  buildContext<WorkflowFilterContextValue>("WorkflowFilter")

export function WorkflowFilterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkflowFilterState>(initialState)

  const setSelectedStatuses = useCallback((statuses: string[]) => {
    setState((prev) => ({ ...prev, selectedStatuses: statuses, page: 1 }))
  }, [])

  const setWorkflowType = useCallback((type: string | undefined) => {
    setState((prev) => ({ ...prev, workflowType: type, page: 1 }))
  }, [])

  const setDateRange = useCallback((from: string | undefined, to: string | undefined) => {
    setState((prev) => ({ ...prev, startTimeFrom: from, startTimeTo: to, page: 1 }))
  }, [])

  const setSortBy = useCallback((sortBy: string | undefined) => {
    setState((prev) => ({ ...prev, sortBy }))
  }, [])

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 1 }))
  }, [])

  const loadMore = useCallback(() => {
    setState((prev) => ({ ...prev, page: prev.page + 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <WorkflowFilterContextProvider
      selectedStatuses={state.selectedStatuses}
      workflowType={state.workflowType}
      startTimeFrom={state.startTimeFrom}
      startTimeTo={state.startTimeTo}
      sortBy={state.sortBy}
      page={state.page}
      pageSize={state.pageSize}
      setSelectedStatuses={setSelectedStatuses}
      setWorkflowType={setWorkflowType}
      setDateRange={setDateRange}
      setSortBy={setSortBy}
      setPage={setPage}
      setPageSize={setPageSize}
      loadMore={loadMore}
      resetFilters={resetFilters}
    >
      {children}
    </WorkflowFilterContextProvider>
  )
}

export function useWorkflowFilterContext() {
  return useWorkflowFilterContextRaw("useWorkflowFilterContext")
}
