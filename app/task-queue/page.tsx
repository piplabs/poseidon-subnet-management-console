import { TaskQueueTable } from "@/domain/task/components/task-queue-table"
import { Button } from "@/common/components/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function TaskQueuePage() {
  return (
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Task Queues</h1>
          <p className="text-muted-foreground mt-1">View and manage all task queues</p>
        </div>

        <TaskQueueTable showViewAll={false} showTitle={false} />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1-5 of 50 task queues</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" className="w-8 h-8 p-0">
                1
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                2
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                3
              </Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                10
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
  )
}
