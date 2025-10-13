"use client"

import { ChevronDown, Clock } from "lucide-react"

export function ArrowDivider({ delayDays }) {
  return (
    <div className="flex flex-col items-center my-4">
      {typeof delayDays === "number" && delayDays > 0 ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {delayDays} day{delayDays === 1 ? "" : "s"} later
          </span>
        </div>
      ) : null}
      <div className="h-8 w-px bg-border relative">
        <ChevronDown className="h-4 w-4 absolute -bottom-2 left-1/2 -translate-x-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}
