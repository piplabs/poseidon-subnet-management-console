"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Search as SearchIcon,
  Workflow,
  Activity,
  Users,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/common/hooks/use-search";
import { cn, shortenAddress } from "../../lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "workflow" | "activity" | "worker";
  href: string;
  icon: React.ReactNode;
}

export function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPointerMoving, setIsPointerMoving] = useState(false);
  const pointerTimeoutRef = useRef<NodeJS.Timeout>();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { data: searchData, isLoading } = useSearch(debouncedQuery);

  // Debounce search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Transform API response to SearchResult format
  const searchResults: SearchResult[] = [];

  if (searchData) {
    // Add workflows
    searchData.workflows.forEach((workflow) => {
      searchResults.push({
        id: workflow.workflowId,
        title: workflow.workflowId,
        subtitle: `${workflow.status} • ${workflow.type}`,
        type: "workflow",
        href: `/workflows/${workflow.workflowId}`,
        icon: <Workflow className="h-4 w-4 text-gray-400" />,
      });
    });

    // Add activities
    searchData.activities.forEach((activity) => {
      searchResults.push({
        id: activity.activityId,
        title: activity.activityId,
        subtitle: `${activity.status} • ${activity.type}`,
        type: "activity",
        href: `/workflows/${activity.workflowId}?activity=${activity.activityId}`,
        icon: <Activity className="h-4 w-4 text-gray-400" />,
      });
    });

    // Add workers
    searchData.workers.forEach((worker) => {
      searchResults.push({
        id: worker.workerId,
        title: shortenAddress(worker.workerId),
        subtitle: `${worker.status} • ${worker.activeTasks} active tasks`,
        type: "worker",
        href: `/workers/${worker.workerId}`,
        icon: <Users className="h-4 w-4 text-gray-400" />,
      });
    });
  }

  // TODO: refactor into hooks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setDebouncedQuery("");
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
          setDebouncedQuery("");
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
        setDebouncedQuery("");
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
    <div ref={searchRef} className="relative">
      <AnimatePresence>
        {isSearchOpen ? (
          <div className="fixed inset-0 z-10 flex flex-col items-center justify-start md:items-end pr-4 pt-2">
            <div className="h-screen w-screen md:h-[384px] md:max-w-[329px] md:p-0 p-2 z-30">
              <div className="relative flex flex-col">
                <motion.div
                  initial={{
                    scaleX: 0.91,
                    scaleY: 0.104,
                    // opacity: 0,
                    top: 8,
                    left: 12,
                  }}
                  animate={{
                    scaleX: 1,
                    scaleY: 1,
                    // opacity: 1,
                    top: 0,
                    left: 0,
                  }}
                  exit={{
                    scaleX: 0.91,
                    scaleY: 0.104,
                    // opacity: 0,
                    top: 8,
                    left: 12,
                  }}
                  transition={{
                    duration: 0.2,
                    // duration: 5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="absolute inset-0 top-2 origin-top-left rounded-lg shadow-2xl border"
                  style={{
                    backgroundColor: "#0a0a0a",
                    borderColor: "#292929",
                  }}
                />

                <motion.div className="relative flex flex-col overflow-hidden">
                  <motion.label
                    initial={{ borderColor: "#0a0a0a" }}
                    animate={{ borderColor: "#292929" }}
                    exit={{
                      borderColor: "#0a0a0a",
                      transition: { delay: 0, duration: 0 },
                    }}
                    transition={{
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1],
                      delay: 0.2,
                    }}
                    className={cn(
                      "relative flex flex-row items-center border-0 border-b border-solid"
                    )}
                  >
                    <div className="grid size-12 place-content-center z-10">
                      <motion.div layoutId="search-icon">
                        <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </motion.div>
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { delay: 0 } }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.2,
                      }}
                      className="grid size-12 place-content-center"
                    >
                      <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background/50 px-1.5 font-mono text-[10px] font-medium text-gray-300">
                        <span>Esc</span>
                      </kbd>
                    </motion.div>
                  </motion.label>

                  {isLoading && debouncedQuery && (
                    <div className="px-4 py-8 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    </div>
                  )}

                  {!isLoading && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { delay: 0 } }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.2,
                      }}
                      className="relative max-h-[320px] overflow-y-auto"
                    >
                      <motion.div
                        className="pointer-events-none absolute inset-x-2 top-2 h-[48px] rounded"
                        style={{ backgroundColor: "#1E1F22" }}
                        animate={{ y: selectedIndex * 48 }}
                        transition={{
                          duration: 0.1,
                          ease: [0.4, 0, 0.2, 1],
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
                              setDebouncedQuery("");
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
                            className="relative z-10 flex h-12 cursor-pointer select-none flex-row items-center gap-3 rounded px-2 text-left transition-colors"
                          >
                            <div className="grid size-11 flex-none place-content-center">
                              {result.icon}
                            </div>
                            <div className="flex flex-1 select-none flex-col overflow-hidden pr-2">
                              <div className="h-4 truncate text-[13px] font-medium leading-4">
                                <strong className="text-gray-100">
                                  {result.title}
                                </strong>
                              </div>
                              <div className="h-4 truncate text-[13px] leading-4 text-gray-400">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {!isLoading &&
                    debouncedQuery &&
                    searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-400">
                        No results found for "{debouncedQuery}"
                      </div>
                    )}
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <button
            ref={triggerRef}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center pl-[10px] gap-2 h-[30px] lg:h-8 w-72 rounded-md border border-border bg-background/50 hover:bg-background transition-colors"
          >
            <motion.div layoutId="search-icon">
              <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </motion.div>
            <span className="text-sm text-muted-foreground">Find...</span>
            <div className="ml-auto pr-[6px] flex items-center justify-center">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background/50 px-1.5 font-mono text-[10px] font-medium text-gray-200">
                F
              </kbd>
            </div>
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
