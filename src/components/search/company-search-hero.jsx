"use client"

import { useEffect, useState } from "react"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fetchFilterSuggestions } from "@/lib/mock-api"

export function CompanySearchHero({ value, onChange, onSubmit }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(true)
      const res = await fetchFilterSuggestions("company", value)
      if (active) setSuggestions(res.slice(0, 7))
      setLoading(false)
    }
    run()
    return () => {
      active = false
    }
  }, [value])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background to-background/60">
      {/* Animated background */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(1200px_600px_at_50%_-40%,hsl(var(--primary)/0.15),transparent_55%)]",
          "animate-pulse",
        )}
      />
      <Card className="relative bg-transparent border-none shadow-none p-6 md:p-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center text-balance text-3xl md:text-4xl font-bold mb-3">Find companies faster</h1>
          <p className="text-center text-muted-foreground mb-6">
            Type a company, market, or attribute. We’ll refine with filters below.
          </p>
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <Command shouldFilter={false}>
              <CommandInput
                value={value}
                onValueChange={onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmit()
                }}
                placeholder="Search companies, e.g. B2B SaaS in the US..."
              />
              <CommandList>
                <CommandEmpty>{loading ? "Searching..." : "No suggestions"}</CommandEmpty>
                {suggestions.map((s) => (
                  <CommandItem key={s} value={s} onSelect={(v) => onChange(v)}>
                    {s}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
        </div>
      </Card>
    </div>
  )
}
