"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { fetchFilterSuggestions } from "@/lib/mock-api"


export function FilterSelect({ filterType, value, onChange, placeholder = "Select...", label }) {
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true)
      const results = await fetchFilterSuggestions(filterType, searchQuery)
      setSuggestions(results)
      setLoading(false)
    }

    loadSuggestions()
  }, [filterType, searchQuery])

  const handleSelect = (item) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item))
    } else {
      onChange([...value, item])
    }
  }

  const handleRemove = (item) => {
    onChange(value.filter((v) => v !== item))
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 py-2 bg-transparent"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(item)
                    }}
                  >
                    {item}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${filterType}...`} value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>{loading ? "Loading..." : "No results found."}</CommandEmpty>
              <CommandGroup>
                {suggestions.map((item) => (
                  <CommandItem key={item} value={item} onSelect={() => handleSelect(item)}>
                    <Check className={cn("mr-2 h-4 w-4", value.includes(item) ? "opacity-100" : "opacity-0")} />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
