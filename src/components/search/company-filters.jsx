"use client"

import { FilterSelect } from "@/components/people/filter-select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function CompanyFilters({ filters, onChange, onApply }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Industry & Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterSelect
            filterType="tags"
            value={filters.tags}
            onChange={(v) => onChange("tags", v)}
            placeholder="Select industries..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Employees</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Min</label>
            <input
              type="number"
              className="flex h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={filters.nbEmployees.min ?? ""}
              placeholder="50"
              onChange={(e) => onChange("nbEmployees.min", e.target.value ? Number.parseInt(e.target.value) : null)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Max</label>
            <input
              type="number"
              className="flex h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={filters.nbEmployees.max ?? ""}
              placeholder="500"
              onChange={(e) => onChange("nbEmployees.max", e.target.value ? Number.parseInt(e.target.value) : null)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Revenue (USD)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Min</label>
            <input
              type="number"
              className="flex h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={filters.revenue.min ?? ""}
              placeholder="1,000,000"
              onChange={(e) => onChange("revenue.min", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Max</label>
            <input
              type="number"
              className="flex h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={filters.revenue.max ?? ""}
              placeholder="100,000,000"
              onChange={(e) => onChange("revenue.max", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm">Location</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Country</label>
            <input
              type="text"
              className="flex h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={filters.location.country}
              placeholder="United States"
              onChange={(e) => onChange("location.country", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">City</label>
            <input
              type="text"
              className="flex h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={filters.location.city}
              placeholder="San Francisco"
              onChange={(e) => onChange("location.city", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-3">
        <button
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          onClick={onApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
