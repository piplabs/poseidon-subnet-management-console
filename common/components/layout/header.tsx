"use client"

import { Button } from "@/common/components/button"
import { Wallet, Search } from "lucide-react"
import { Input } from "@/common/components/input"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6 gap-6">
        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by address / txn hash / block / token..."
            className="w-full pl-10 pr-12 bg-background/50 border-border/50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            /
          </kbd>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}
