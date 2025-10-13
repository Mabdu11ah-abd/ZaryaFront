"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  addCompaniesToCollection,
  fetchCompanyCollections,
  fetchMembershipForCompanies,
} from "@/lib/mock-api"

export function CollectionPickerDialog({ open, onOpenChange, selectedCompanyIds }) {
  const [collections, setCollections] = useState([])
  const [query, setQuery] = useState("")
  const [membership, setMembership] = useState({})
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    const load = async () => {
      const cols = await fetchCompanyCollections()
      setCollections(cols)
    }
    load()
  }, [])

  useEffect(() => {
    if (!open || selectedCompanyIds.length === 0) return
    const run = async () => {
      const map = await fetchMembershipForCompanies(selectedCompanyIds)
      setMembership(map)
    }
    run()
  }, [open, selectedCompanyIds])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return collections
    return collections.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q),
    )
  }, [collections, query])

  const countAlreadyIn = (collectionId) => {
    let count = 0
    for (const cid of selectedCompanyIds) {
      if (membership[cid]?.includes(collectionId)) count++
    }
    return count
  }

  const handleAdd = async (collectionId) => {
    setSaving(collectionId)
    await addCompaniesToCollection(collectionId, selectedCompanyIds)
    const map = await fetchMembershipForCompanies(selectedCompanyIds)
    setMembership(map)
    setSaving(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Bigger dialog with client-side search */}
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add selected companies to lists</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search lists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">{selectedCompanyIds.length} selected</div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {filtered.map((c) => {
            const already = countAlreadyIn(c.id)
            const total = selectedCompanyIds.length
            const ratio = total ? Math.round((already / total) * 100) : 0
            return (
              <Card key={c.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription>{c.type === "company" ? "Company list" : "People list"}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground line-clamp-2">{c.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.itemCount} items · {already}/{total} selected already in
                    </div>
                    <div className="h-2 w-full rounded bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${ratio}%` }}
                        aria-label={`${ratio}% already in`}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(c.id)}
                    disabled={saving === c.id || total === 0}
                    variant="default"
                  >
                    {saving === c.id ? "Adding..." : "Add"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && <div className="text-sm text-muted-foreground">No lists match “{query}”.</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
