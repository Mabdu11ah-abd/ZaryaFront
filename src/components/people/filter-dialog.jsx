"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FilterSelect } from "./filter-select"

export function FilterDialog({ filters, updateNested, resetFilters, activeFilterCount, onApply }) {
  const [open, setOpen] = useState(false)

  const handleApply = () => {
    onApply()
    setOpen(false)
  }

  const handleReset = () => {
    resetFilters()
    onApply()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Filter Leads</DialogTitle>
          <DialogDescription>Refine your search with advanced filters to find the perfect leads</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6 py-4">
            {/* People Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">People</h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              <FilterSelect
                filterType="role"
                value={filters.people.role}
                onChange={(value) => updateNested("people.role", value)}
                placeholder="Select roles..."
                label="Role"
              />

              <FilterSelect
                filterType="tags"
                value={filters.people.tags}
                onChange={(value) => updateNested("people.tags", value)}
                placeholder="Select tags..."
                label="Tags"
              />
            </div>

            <Separator />

            {/* Company Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Company</h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              <FilterSelect
                filterType="company"
                value={filters.name ? [filters.name] : []}
                onChange={(value) => updateNested("name", value[value.length - 1] || "")}
                placeholder="Select companies..."
                label="Company Name"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Min Employees</label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="0"
                    value={filters.nbEmployees.min || ""}
                    onChange={(e) =>
                      updateNested("nbEmployees.min", e.target.value ? Number.parseInt(e.target.value) : null)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Max Employees</label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="1000"
                    value={filters.nbEmployees.max || ""}
                    onChange={(e) =>
                      updateNested("nbEmployees.max", e.target.value ? Number.parseInt(e.target.value) : null)
                    }
                  />
                </div>
              </div>

              <FilterSelect
                filterType="tags"
                value={filters.tags}
                onChange={(value) => updateNested("tags", value)}
                placeholder="Select industries..."
                label="Industry Tags"
              />
            </div>

            <Separator />

            {/* Location Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Location</h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Country</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="United States"
                    value={filters.location.country}
                    onChange={(e) => updateNested("location.country", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">City</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="San Francisco"
                    value={filters.location.city}
                    onChange={(e) => updateNested("location.city", e.target.value)}
                  />
                </div>
              </div>
            </div>  
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
