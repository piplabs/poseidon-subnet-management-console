import { useQuery } from "@tanstack/react-query";
import type { SearchResponse, WorkflowListResponse } from "@/lib/api/types";
import { useMemo } from "react";

async function fetchWorkflowList(): Promise<WorkflowListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("page", "1");
  queryParams.append("pageSize", "10");

  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`/api/v1/workflows?${queryParams.toString()}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch workflows");
  // }
  // return await response.json();

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // MOCK DATA - Recent workflows
  return {
    items: [
      {
        workflowId: "wf-001",
        type: "VideoTranscode",
        definition: "0xdef456contract",
        creator: "0xuser123456789abcdef",
        status: "Running",
        startedAt: "2025-10-16T10:21:00Z",
        endedAt: "",
        durationSec: 0,
        currentStep: 3,
        totalSteps: 8,
        latestActivityId: "act-001",
      },
      {
        workflowId: "wf-002",
        type: "DataProcessing",
        definition: "0xdef457contract",
        creator: "0xuser124456789abcdef",
        status: "Completed",
        startedAt: "2025-10-16T10:15:00Z",
        endedAt: "2025-10-16T10:18:45Z",
        durationSec: 225,
        currentStep: 5,
        totalSteps: 5,
        latestActivityId: "act-002",
      },
      {
        workflowId: "wf-003",
        type: "ReportGeneration",
        definition: "0xdef458contract",
        creator: "0xuser125456789abcdef",
        status: "Failed",
        startedAt: "2025-10-16T10:10:00Z",
        endedAt: "2025-10-16T10:12:10Z",
        durationSec: 130,
        currentStep: 2,
        totalSteps: 6,
        latestActivityId: "act-003",
      },
      {
        workflowId: "wf-004",
        type: "ImageProcessing",
        definition: "0xdef459contract",
        creator: "0xuser126456789abcdef",
        status: "Pending",
        startedAt: "2025-10-16T10:25:00Z",
        endedAt: "",
        durationSec: 0,
        currentStep: 0,
        totalSteps: 4,
        latestActivityId: "",
      },
      {
        workflowId: "wf-005",
        type: "DataValidation",
        definition: "0xdef460contract",
        creator: "0xuser127456789abcdef",
        status: "Terminated",
        startedAt: "2025-10-16T09:45:00Z",
        endedAt: "2025-10-16T09:50:30Z",
        durationSec: 330,
        currentStep: 4,
        totalSteps: 10,
        latestActivityId: "act-005",
      },
    ],
    page: 1,
    pageSize: 10,
    total: 4021,
  };
}

async function fetchSearch(query: string): Promise<SearchResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);

  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`/api/v1/search?${queryParams.toString()}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch search results");
  // }
  // return await response.json();

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // MOCK DATA - Returns search results based on query
  const mockResponse: SearchResponse = {
    workflows: [
      {
        workflowId: "wf-001",
        type: "VideoTranscode",
        definition: "0xdef456contract",
        creator: "0xuser123456789abcdef",
        status: "Running",
        startedAt: "2025-10-16T10:21:00Z",
        endedAt: "",
        durationSec: 0,
        currentStep: 3,
        totalSteps: 8,
        latestActivityId: "act-001",
      },
      {
        workflowId: "wf-002",
        type: "DataProcessing",
        definition: "0xdef457contract",
        creator: "0xuser124456789abcdef",
        status: "Completed",
        startedAt: "2025-10-16T10:15:00Z",
        endedAt: "2025-10-16T10:18:45Z",
        durationSec: 225,
        currentStep: 5,
        totalSteps: 5,
        latestActivityId: "act-002",
      },
    ],
    activities: [
      {
        activityId: "act-001",
        type: "TranscodeVideo",
        status: "Running",
        workflowId: "wf-001",
        worker: "0xworker123456789abcdef",
        startedAt: "2025-10-16T10:21:05Z",
      },
      {
        activityId: "act-002",
        type: "ProcessData",
        status: "Completed",
        workflowId: "wf-002",
        worker: "0xworker234567890abcdef",
        startedAt: "2025-10-16T10:18:00Z",
      },
    ],
    workers: [
      {
        workerId: "0xworker123456789abcdef",
        stakedAmount: "1000",
        status: "Active",
        jailed: false,
        lastHeartbeat: "2025-10-16T10:20:55Z",
        activeTasks: 3,
      },
      {
        workerId: "0xworker234567890abcdef",
        stakedAmount: "2000",
        status: "Active",
        jailed: false,
        lastHeartbeat: "2025-10-16T10:20:50Z",
        activeTasks: 5,
      },
    ],
  };

  // Filter mock data based on query
  const lowerQuery = query.toLowerCase();

  return {
    workflows: mockResponse.workflows.filter(
      (w) =>
        w.workflowId.toLowerCase().includes(lowerQuery) ||
        w.type.toLowerCase().includes(lowerQuery)
    ),
    activities: mockResponse.activities.filter(
      (a) =>
        a.activityId.toLowerCase().includes(lowerQuery) ||
        a.type.toLowerCase().includes(lowerQuery)
    ),
    workers: mockResponse.workers.filter((w) =>
      w.workerId.toLowerCase().includes(lowerQuery)
    ),
  };
}

export function useSearch(query: string) {
  const hasQuery = query.trim().length > 0;

  // Fetch search results when there's a query
  const searchQuery = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: hasQuery,
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  // Fetch recent workflows when there's no query
  const workflowsQuery = useQuery({
    queryKey: ["search-workflows-default"],
    queryFn: fetchWorkflowList,
    enabled: !hasQuery,
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  // Transform workflows to search response format when no query
  const defaultData: SearchResponse | undefined = useMemo(() => {
    if (!hasQuery && workflowsQuery.data) {
      return {
        workflows: workflowsQuery.data.items,
        activities: [],
        workers: [],
      };
    }
    return undefined;
  }, [hasQuery, workflowsQuery.data]);

  const data = hasQuery ? searchQuery.data : defaultData;
  const isLoading = hasQuery ? searchQuery.isLoading : workflowsQuery.isLoading;
  const error = hasQuery ? searchQuery.error : workflowsQuery.error;

  const totalResults = useMemo(() => {
    if (!data) return 0;
    return (
      data.workflows.length + data.activities.length + data.workers.length
    );
  }, [data]);

  return {
    data,
    isLoading,
    error,
    totalResults,
  };
}
