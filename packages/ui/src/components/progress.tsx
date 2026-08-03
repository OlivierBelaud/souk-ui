"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@souk/ui/lib/utils"

function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const normalizedMax = max > 0 ? max : 100
  const normalizedValue =
    value == null ? value : Math.min(normalizedMax, Math.max(0, value))
  const percentage = ((normalizedValue ?? 0) / normalizedMax) * 100

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={normalizedValue}
      max={normalizedMax}
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(${percentage - 100}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
