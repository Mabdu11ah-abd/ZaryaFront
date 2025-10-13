"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchCompanies } from "@/lib/mock-company-api"
import { CollectionPickerDialog } from "./collection-picker-dialog"

export function CompanyResults({ query, filters }) {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(12)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState([])
  const [pickerOpen, setPickerOpen] = useState(false)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const res = await fetchCompanies(page, pageSize, query, filters)
      setData(res.data)
      setTotal(res.total)
      setLoading(false)
    }
    run()
  }, [page, pageSize, query, filters])

  useEffect(() => {
    setPage(1)
  }, [query, JSON.stringify(filters)])

  const toggleSelected = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-4">
      {/* Selection toolbar */}
      <div className="sticky top-[64px] z-[5] bg-background/80 backdrop-blur border-b border-border py-2">
        <div className="max-w-7xl mx-auto px-1 sm:px-0 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selected.length} selected · {total} results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={selected.length === 0} onClick={() => setSelected([])}>
              Clear
            </Button>
            <Button disabled={selected.length === 0} onClick={() => setPickerOpen(true)}>
              Add to Collections
            </Button>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Card key={i} className="animate-pulse h-40" />)
          : data.map((c) => {
              const isSelected = selected.includes(c.id)
              return (
                <Card
                  key={c.id}
                  className={`transition border ${isSelected ? "border-primary/50 ring-2 ring-primary/20" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <input
                        aria-label={`Select ${c.name}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(c.id)}
                        className="h-4 w-4 accent-primary"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.nbEmployees?.toLocaleString()} employees ·{" "}
                      {c.revenue ? `~$${(c.revenue.value / 1e6).toFixed(1)}M` : "—"}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                    {c.categories?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.categories.slice(0, 3).map((cat) => (
                          <span key={cat.name} className="text-xs px-2 py-0.5 rounded bg-muted">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>

      <CollectionPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} selectedCompanyIds={selected} />
    </div>
  )
}
