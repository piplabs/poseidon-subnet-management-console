"use client";

import { Button } from "@/common/components/button";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet,
  Search,
  Workflow,
  Activity,
  ListTodo,
  Users,
  Sparkles,
} from "lucide-react";
import { Input } from "@/common/components/input";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "workflow" | "activity" | "queue" | "worker";
  href: string;
  icon: React.ReactNode;
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPointerMoving, setIsPointerMoving] = useState(false);
  const pointerTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const defaultResults: SearchResult[] = [
    {
      id: "wf-001",
      title: "Workflow wf-001",
      subtitle: "Running • Started 2h ago",
      type: "workflow",
      href: `/workflows/wf-001`,
      icon: <Workflow className="h-5 w-5 text-gray-400" />,
    },
    {
      id: "wf-002",
      title: "Workflow wf-002",
      subtitle: "Completed • Finished 1h ago",
      type: "workflow",
      href: `/workflows/wf-002`,
      icon: <Workflow className="h-5 w-5 text-gray-400" />,
    },
    {
      id: "act-001",
      title: "Activity act-001",
      subtitle: "Completed • Workflow wf-001",
      type: "activity",
      href: `/activities/act-001`,
      icon: <Activity className="h-5 w-5 text-gray-400" />,
    },
    {
      id: "queue-001",
      title: "Task Queue queue-001",
      subtitle: "45 pending activities",
      type: "queue",
      href: `/task-queue/queue-001`,
      icon: <ListTodo className="h-5 w-5 text-gray-400" />,
    },
    {
      id: "worker-001",
      title: "Worker worker-001",
      subtitle: "Active • Processing 3 tasks",
      type: "worker",
      href: `/workers/worker-001`,
      icon: <Users className="h-5 w-5 text-gray-400" />,
    },
    {
      id: "nav-001",
      title: '"subnet-001 activity monitoring"',
      subtitle: "Navigation Assistant",
      type: "workflow",
      href: `/`,
      icon: <Sparkles className="h-5 w-5 text-gray-400" />,
    },
  ];

  const searchResults: SearchResult[] = searchQuery
    ? defaultResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : defaultResults;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
      }
      if (isSearchOpen && searchResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % searchResults.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + searchResults.length) % searchResults.length
          );
        }
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(searchResults[selectedIndex].href);
          setIsSearchOpen(false);
          setSearchQuery("");
          setSelectedIndex(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex, router]);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchQuery) {
      setIsPointerMoving(false);
    }
  }, [searchQuery]);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center px-6 gap-6">
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
          <div ref={searchRef} className="relative">
            <button
              ref={triggerRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-2 px-3 h-[30px] lg:h-8 w-40 xl:w-48 rounded-md border border-border bg-background/50 hover:bg-background transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Find...</span>
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                F
              </kbd>
            </button>

            <AnimatePresence>
              {isSearchOpen && (
                <div className="absolute top-0 right-0 w-[400px] z-50">
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0, originX: 1, originY: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0, originX: 1, originY: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="absolute inset-0 rounded-lg shadow-2xl border"
                    style={{
                      transformOrigin: "top right",
                      backgroundColor: "#0a0a0a",
                      borderColor: "#292929",
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative flex flex-col overflow-hidden"
                  >
                    <label
                      className="relative flex flex-row items-center border-0 border-b border-solid"
                      style={{ borderColor: "#292929" }}
                    >
                      <div className="grid size-12 place-content-center">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Find…"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedIndex(0);
                        }}
                        className="h-12 flex-1 border-0 border-none bg-transparent py-4 pl-0 pr-4 outline-none text-sm text-gray-100 placeholder:text-gray-500"
                      />
                      <div className="grid size-12 place-content-center">
                        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-300">
                          <span>Esc</span>
                        </kbd>
                      </div>
                    </label>

                    {searchResults.length > 0 && (
                      <div className="relative max-h-[320px] overflow-y-auto">
                        <motion.div
                          className="pointer-events-none absolute inset-x-2 top-2 h-[48px] rounded"
                          style={{ backgroundColor: "#1E1F22" }}
                          animate={{ y: selectedIndex * 48 }}
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 400,
                          }}
                        />
                        <div className="relative flex flex-col p-2">
                          {searchResults.map((result, index) => (
                            <button
                              key={result.id}
                              onClick={() => {
                                router.push(result.href);
                                setIsSearchOpen(false);
                                setSearchQuery("");
                                setSelectedIndex(0);
                              }}
                              onPointerMove={() => {
                                if (!isPointerMoving) {
                                  setIsPointerMoving(true);
                                }
                                if (pointerTimeoutRef.current) {
                                  clearTimeout(pointerTimeoutRef.current);
                                }
                                pointerTimeoutRef.current = setTimeout(() => {
                                  setIsPointerMoving(false);
                                }, 100);

                                if (isPointerMoving) {
                                  setSelectedIndex(index);
                                }
                              }}
                              className="relative z-10 flex cursor-pointer select-none flex-row items-center gap-3 rounded px-2 py-2 text-left transition-colors"
                            >
                              <div className="flex-shrink-0">{result.icon}</div>
                              <div className="flex flex-1 select-none flex-col overflow-hidden pr-2">
                                <div className="h-4 truncate text-[13px] font-medium leading-4">
                                  <strong>
                                    <span className="text-gray-100">
                                      {result.title}
                                    </span>
                                  </strong>
                                </div>
                                <div className="h-4 truncate text-[13px] leading-4 text-gray-400">
                                  {result.subtitle}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-400">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
