import * as React from "react"
import { cn } from "@/lib/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-xl bg-background/30 border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/60",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"
