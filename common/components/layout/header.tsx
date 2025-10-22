"use client";

import { Button } from "@/common/components/button";
import Link from "next/link";
import { Search } from "@/common/components/search";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center px-11 gap-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold text-white">CONSOLE</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/workflows">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Workflows
            </Button>
          </Link>
          <Link href="/task-queue">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Task Queue
            </Button>
          </Link>
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <Search />
        </div>
      </div>
    </header>
  );
}
