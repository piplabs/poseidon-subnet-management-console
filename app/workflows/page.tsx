import { WorkflowTable } from "@/domain/workflow/components/workflow-table";
import { WorkflowFilterArea } from "@/domain/workflow/components/workflow-filter-area";
import { WorkflowFilterProvider } from "@/domain/workflow/contexts/workflow-filter-context";
import { Button } from "@/common/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MainContent } from "@/common/components/layout/main-content";

export default function WorkflowsPage() {
  return (
    <MainContent>
      <div>
        <h1 className="text-3xl font-bold">Workflows</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all workflow executions
        </p>
      </div>

      <WorkflowFilterProvider>
        <div className="space-y-4">
          <WorkflowFilterArea />
          <WorkflowTable />
        </div>
      </WorkflowFilterProvider>
    </MainContent>
  );
}
