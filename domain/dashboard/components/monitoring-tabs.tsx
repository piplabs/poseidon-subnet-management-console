"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/common/components/tabs";
import { WorkflowTable } from "@/domain/workflow/components/workflow-table";
import { TaskQueueTable } from "@/domain/task/components/task-queue-table";
import { WorkflowFilterArea } from "@/domain/workflow/components/workflow-filter-area";
import { TaskFilterArea } from "@/domain/task/components/task-filter-area";
import { WorkflowFilterProvider } from "@/domain/workflow/contexts/workflow-filter-context";
import { TaskQueueFilterProvider } from "@/domain/task/contexts/task-queue-filter-context";

export function MonitoringTabs() {
  const [activeTab, setActiveTab] = useState("workflow");

  const tabs = [
    { value: "workflow", label: "Workflow" },
    { value: "task-queue", label: "Task Queue" },
  ];

  return (
    <Tabs tabs={tabs} value={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="workflow">
        <WorkflowFilterProvider>
          <div className="space-y-4">
            <WorkflowFilterArea />
            <WorkflowTable />
          </div>
        </WorkflowFilterProvider>
      </TabsContent>

      <TabsContent value="task-queue">
        <TaskQueueFilterProvider>
          <div className="space-y-4">
            <TaskFilterArea />
            <TaskQueueTable />
          </div>
        </TaskQueueFilterProvider>
      </TabsContent>
    </Tabs>
  );
}
