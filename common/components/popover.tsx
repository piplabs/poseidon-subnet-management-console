"use client"

import * as React from "react"

export interface PopoverProps {
  children: React.ReactNode
  content: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({ children, content, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const popoverRef = React.useRef<HTMLDivElement>(null)

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        handleOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => handleOpenChange(!open)}>{children}</div>
      {open && (
        <div className="absolute z-50 mt-2 min-w-[200px] rounded-md border border-border bg-popover p-1 shadow-lg">
          {content}
        </div>
      )}
    </div>
  )
}

export interface PopoverItemProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
}

export function PopoverItem({ children, onClick, icon }: PopoverItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
