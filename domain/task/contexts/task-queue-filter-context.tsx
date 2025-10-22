"use client"

import { useState, useCallback } from "react"
import { buildContext } from "@/lib/react/build-context"

export interface TaskQueueFilterState {
  queueId?: string
  includeActivities: boolean
  includeWorkflows: boolean
  page: number
  pageSize: number
}

export interface TaskQueueFilterActions {
  setQueueId: (queueId: string | undefined) => void
  setIncludeActivities: (include: boolean) => void
  setIncludeWorkflows: (include: boolean) => void
  toggleIncludeActivities: () => void
  toggleIncludeWorkflows: () => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  loadMore: () => void
  resetFilters: () => void
}

export type TaskQueueFilterContextValue = TaskQueueFilterState & TaskQueueFilterActions

const initialState: TaskQueueFilterState = {
  queueId: undefined,
  includeActivities: false,
  includeWorkflows: false,
  page: 1,
  pageSize: 20,
}

const [TaskQueueFilterContextProvider, useTaskQueueFilterContextRaw] =
  buildContext<TaskQueueFilterContextValue>("TaskQueueFilter")

export function TaskQueueFilterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TaskQueueFilterState>(initialState)

  const setQueueId = useCallback((queueId: string | undefined) => {
    setState((prev) => ({ ...prev, queueId, page: 1 }))
  }, [])

  const setIncludeActivities = useCallback((include: boolean) => {
    setState((prev) => ({ ...prev, includeActivities: include, page: 1 }))
  }, [])

  const setIncludeWorkflows = useCallback((include: boolean) => {
    setState((prev) => ({ ...prev, includeWorkflows: include, page: 1 }))
  }, [])

  const toggleIncludeActivities = useCallback(() => {
    setState((prev) => ({ ...prev, includeActivities: !prev.includeActivities, page: 1 }))
  }, [])

  const toggleIncludeWorkflows = useCallback(() => {
    setState((prev) => ({ ...prev, includeWorkflows: !prev.includeWorkflows, page: 1 }))
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
    <TaskQueueFilterContextProvider
      queueId={state.queueId}
      includeActivities={state.includeActivities}
      includeWorkflows={state.includeWorkflows}
      page={state.page}
      pageSize={state.pageSize}
      setQueueId={setQueueId}
      setIncludeActivities={setIncludeActivities}
      setIncludeWorkflows={setIncludeWorkflows}
      toggleIncludeActivities={toggleIncludeActivities}
      toggleIncludeWorkflows={toggleIncludeWorkflows}
      setPage={setPage}
      setPageSize={setPageSize}
      loadMore={loadMore}
      resetFilters={resetFilters}
    >
      {children}
    </TaskQueueFilterContextProvider>
  )
}

export function useTaskQueueFilterContext() {
  return useTaskQueueFilterContextRaw("useTaskQueueFilterContext")
}
