import * as React from "react"
import { cn } from "@/lib/cn"

export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "secondary" | "danger" | "success" | "warning" }) {
  const variants: Record<string, string> = {
    secondary: "bg-muted text-foreground",
    danger: "bg-danger/20 text-foreground border-danger/40",
    success: "bg-success/20 text-foreground border-success/40",
    warning: "bg-warning/20 text-foreground border-warning/40",
  }
  return (
    <span className={cn("inline-flex items-center rounded-xl px-2 py-1 text-xs border", variants[variant], className)} {...props} />
  )
}
