"use client"
import * as React from "react"
import { cn } from "@/lib/cn"

export function Modal({
  open,
  title,
  children,
  onClose,
  className,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  className?: string
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className={cn("w-full max-w-xl rounded-2xl border bg-card shadow-soft", className)}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          <button className="text-mutedForeground hover:text-foreground" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
