"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/common/components/tabs"
import { WorkflowTable } from "@/domain/workflow/components/workflow-table"
import { TaskQueueTable } from "@/domain/task/components/task-queue-table"
import { WorkflowFilterArea } from "@/domain/workflow/components/workflow-filter-area"
import { TaskFilterArea } from "@/domain/task/components/task-filter-area"

export function MonitoringTabs() {
  const [activeTab, setActiveTab] = useState("workflow")

  const tabs = [
    { value: "workflow", label: "Workflow" },
    { value: "task-queue", label: "Task Queue" },
  ]

  return (
    <Tabs tabs={tabs} value={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="workflow">
        <div className="space-y-4">
          <WorkflowFilterArea />
          <WorkflowTable />
        </div>
      </TabsContent>

      <TabsContent value="task-queue">
        <div className="space-y-4">
          <TaskFilterArea />
          <TaskQueueTable />
        </div>
      </TabsContent>
    </Tabs>
  )
}
