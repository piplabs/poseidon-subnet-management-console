"use client"

import * as React from "react"

export interface Tab {
  value: string
  label: string
}

export interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

export function Tabs({ tabs, defaultValue, value: controlledValue, onValueChange, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || tabs[0]?.value || "")
  const value = controlledValue ?? internalValue

  const handleValueChange = (newValue: string) => {
    if (!controlledValue) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className="w-full">
        <div className="border-b border-border">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleValueChange(tab.value)}
                className={`px-1 py-3 text-sm font-medium transition-colors relative ${
                  value === tab.value
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {value === tab.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </TabsContext.Provider>
  )
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("TabsContent must be used within Tabs")
  }

  if (context.value !== value) {
    return null
  }

  return <>{children}</>
}
