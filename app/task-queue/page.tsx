import { TaskQueueTable } from "@/domain/task/components/task-queue-table";
import { TaskFilterArea } from "@/domain/task/components/task-filter-area";
import { TaskQueueFilterProvider } from "@/domain/task/contexts/task-queue-filter-context";
import { Button } from "@/common/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MainContent } from "@/common/components/layout/main-content";

export default function TaskQueuePage() {
  return (
    <MainContent>
      <div>
        <h1 className="text-3xl font-bold">Task Queues</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all task queues
        </p>
      </div>

      <TaskQueueFilterProvider>
        <div className="space-y-4">
          <TaskFilterArea />
          <TaskQueueTable />
        </div>
      </TaskQueueFilterProvider>
    </MainContent>
  );
}
