import { Header } from "@/common/components/layout/header"
import { Button } from "@/common/components/button"
import { Card } from "@/common/components/card"
import { ArrowLeft, Activity, Clock, Cpu, HardDrive } from "lucide-react"
import Link from "next/link"

// Mock worker data
const workerData = {
  id: "worker-node-05",
  status: "active",
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  uptime: "5d 12h 34m",
  tasksCompleted: 1247,
  currentTask: "Processing workflow wf-001",
  taskQueue: "default-queue",
  lastHeartbeat: "2025-01-15 14:35:42",
  version: "v1.2.3",
  resources: {
    cpu: "45%",
    memory: "2.3 GB / 8 GB",
    disk: "45 GB / 100 GB",
  },
  recentActivities: [
    { id: "act-015", workflow: "wf-001", name: "Process Data", status: "running", startTime: "14:30:15" },
    { id: "act-014", workflow: "wf-008", name: "Validate Results", status: "completed", startTime: "14:25:10" },
    { id: "act-013", workflow: "wf-007", name: "Store Output", status: "completed", startTime: "14:20:05" },
    { id: "act-012", workflow: "wf-006", name: "Fetch Data", status: "completed", startTime: "14:15:00" },
    { id: "act-011", workflow: "wf-005", name: "Initialize", status: "completed", startTime: "14:10:55" },
  ],
}

export default function WorkerDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Worker Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Worker Details</h1>
              <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono">{workerData.id}</span>
              <span>•</span>
              <span>Uptime: {workerData.uptime}</span>
              <span>•</span>
              <span>Version: {workerData.version}</span>
            </div>
          </div>
        </div>

        {/* Worker Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
                <div className="text-2xl font-bold">{workerData.tasksCompleted}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">CPU Usage</div>
                <div className="text-2xl font-bold">{workerData.resources.cpu}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <HardDrive className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Memory</div>
                <div className="text-xl font-bold">{workerData.resources.memory.split(" / ")[0]}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Heartbeat</div>
                <div className="text-sm font-mono">{workerData.lastHeartbeat.split(" ")[1]}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Worker Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-sm font-medium mb-4">Worker Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Worker ID</span>
                <span className="text-sm font-mono">{workerData.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Wallet Address</span>
                <span className="text-sm font-mono">{workerData.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Task Queue</span>
                <span className="text-sm">{workerData.taskQueue}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Current Task</span>
                <span className="text-sm">{workerData.currentTask}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-mono">{workerData.version}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium mb-4">Resource Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">CPU</span>
                  <span className="text-sm font-mono">{workerData.resources.cpu}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: workerData.resources.cpu }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Memory</span>
                  <span className="text-sm font-mono">{workerData.resources.memory}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "29%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Disk</span>
                  <span className="text-sm font-mono">{workerData.resources.disk}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-sm font-medium mb-4">Recent Activities</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-[100px,100px,1fr,120px,100px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              <div>Activity ID</div>
              <div>Workflow</div>
              <div>Name</div>
              <div>Status</div>
              <div>Start Time</div>
            </div>
            {workerData.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="grid grid-cols-[100px,100px,1fr,120px,100px] gap-4 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div className="font-mono text-sm">{activity.id}</div>
                <Link
                  href={`/workflows/${activity.workflow}`}
                  className="font-mono text-sm text-primary hover:underline"
                >
                  {activity.workflow}
                </Link>
                <div className="text-sm">{activity.name}</div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      activity.status === "running" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
                <div className="font-mono text-sm text-muted-foreground">{activity.startTime}</div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
