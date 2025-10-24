"use client";
import { Skeleton } from "@/common/components/skeleton";
import { useWorkflows } from "@/domain/workflow/hooks";
import Link from "next/link";
import {
  formatShortRelativeTime,
  getWorkflowStatusBgColor,
  shortenAddress,
} from "../../../lib/utils";

export function WorkflowTable({ subnetId }: { subnetId?: string }) {
  const {
    data: workflows,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useWorkflows(subnetId);

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Column 1: ID and Type */}
                    <div className="min-w-[140px]">
                      {/* <Skeleton className="h-4 w-28 mb-1" /> */}
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Column 2: Status and Time */}
                    <div className="min-w-[180px]">
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Column 3: Activities count */}
                    <div className="min-w-[120px]">
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Column 4: User */}
                    <div className="flex-1 text-right">
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border rounded-lg p-6">
        <div className="text-destructive">
          Error loading workflows: {error.message}
        </div>
      </div>
    );
  }

  if (!workflows || workflows.length === 0) {
    return (
      <div className="border border-border rounded-lg p-6">
        <div className="text-muted-foreground">No workflows found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {workflows.map((workflow, index) => (
              <tr
                key={workflow.id}
                className={`border-b border-border last:border-b-0 hover:bg-[#1E1F22FF] transition-colors ${
                  index === 0 ? "" : ""
                }`}
              >
                <td className="p-4">
                  <Link href={`/workflows/${workflow.id}`} className="block">
                    <div className="flex items-center gap-4">
                      {/* Column 1: ID and Type */}
                      <div className="w-[200px]">
                        <div
                          className="font-mono text-sm font-medium truncate"
                          title={workflow.id}
                        >
                          {workflow.id}
                        </div>
                        <div
                          className="text-xs text-muted-foreground mt-0.5 truncate"
                          title={workflow.type}
                        >
                          {workflow.type}
                        </div>
                      </div>

                      {/* Column 2: Status and Time */}
                      <div className="min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getWorkflowStatusBgColor(
                              workflow.status
                            )}`}
                          />
                          <span className="text-sm capitalize">
                            {workflow.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground tabular-nums mt-0.5">
                          <span className="mr-[1px]">{workflow.duration}</span>{" "}
                          ({formatShortRelativeTime(workflow.startTime)})
                        </div>
                      </div>

                      {/* Column 3: Progress and Duration */}
                      <div className="min-w-[140px]">
                        <div className="text-sm">
                          {workflow.totalSteps > 0
                            ? `${workflow.currentStep}/${workflow.totalSteps} steps`
                            : workflow.totalSteps === 0
                            ? "No steps"
                            : "-"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {workflow.definition != null
                            ? workflow.definition
                            : "-"}
                        </div>
                      </div>

                      {/* Column 4: Creator */}
                      <div className="flex-1 text-right">
                        <div
                          className="font-mono text-xs text-muted-foreground mt-0.5 truncate"
                          title={workflow.user ?? undefined}
                        >
                          {workflow.user ? shortenAddress(workflow.user) : "-"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-3 border border-border rounded-lg hover:bg-[#1E1F22FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm text-muted-foreground">
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </span>
        </button>
      )}
    </div>
  );
}
