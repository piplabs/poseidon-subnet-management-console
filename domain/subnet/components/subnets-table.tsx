"use client"

import { Card } from "@/common/components/card"
import { Badge } from "@/common/components/badge"
import { Button } from "@/common/components/button"
import Link from "next/link"
import { useState } from "react"

// Mock subnet data
const subnets = [
  { id: "subnet-001", name: "Chutes", status: "active", workflows: 234, successRate: 96.5 },
  { id: "subnet-002", name: "Affine", status: "active", workflows: 189, successRate: 94.2 },
  { id: "subnet-003", name: "Ridges", status: "active", workflows: 156, successRate: 97.1 },
  { id: "subnet-004", name: "Ilium", status: "active", workflows: 142, successRate: 93.8 },
  { id: "subnet-005", name: "Targon", status: "active", workflows: 128, successRate: 95.4 },
  { id: "subnet-006", name: "Gradients", status: "active", workflows: 98, successRate: 92.7 },
  { id: "subnet-007", name: "Proprietary Trading", status: "idle", workflows: 67, successRate: 91.2 },
  { id: "subnet-008", name: "Templar", status: "active", workflows: 45, successRate: 98.3 },
]

export function SubnetsTable() {
  // Mock wallet connection state
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Subnets</h2>
          {isWalletConnected && (
            <Button variant="secondary" size="sm" className="h-7 text-xs px-3">
              My Subnets
            </Button>
          )}
        </div>
        {/* Mock wallet connection toggle for demo */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsWalletConnected(!isWalletConnected)}
          className="text-xs"
        >
          {isWalletConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Workflows (24h)</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {subnets.map((subnet) => (
              <tr key={subnet.id} className="border-b border-border/50 hover:bg-[#1E1F22FF] transition-colors">
                <td className="py-3 px-4">
                  <Link href={`/subnet/${subnet.id}`} className="block">
                    <span className="font-mono text-xs text-muted-foreground">{subnet.id}</span>
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/subnet/${subnet.id}`} className="block font-medium">
                    {subnet.name}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/subnet/${subnet.id}`} className="block">
                    <Badge
                      variant="outline"
                      className={`${subnet.status === "active" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}
                    >
                      {subnet.status}
                    </Badge>
                  </Link>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/subnet/${subnet.id}`} className="block font-mono text-sm">
                    {subnet.workflows}
                  </Link>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/subnet/${subnet.id}`} className="block">
                    <span className="font-mono text-sm">{subnet.successRate}%</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
