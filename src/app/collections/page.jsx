"use client"

import { useState, useEffect } from "react"
import { Users, Building2, Plus, FolderOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCollections} from "@/lib/mock-api"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [peopleQuery, setPeopleQuery] = useState("")
  const [companyQuery, setCompanyQuery] = useState("")

  useEffect(() => {
    const loadCollections = async () => {
      const data = await fetchCollections()
      setCollections(data)
      setLoading(false)
    }

    loadCollections()
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const peopleCollections = collections
    .filter((c) => c.type === "people")
    .filter((c) => c.name.toLowerCase().includes(peopleQuery.toLowerCase().trim()))
  const companyCollections = collections
    .filter((c) => c.type === "company")
    .filter((c) => c.name.toLowerCase().includes(companyQuery.toLowerCase().trim()))

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Collections</h1>
              <p className="text-muted-foreground mt-1">Organize and manage your saved leads</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Collections Sections */}
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {collections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Start organizing your leads by creating your first collection
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">People</h2>
                    <p className="text-sm text-muted-foreground">
                      {peopleCollections.length} {peopleCollections.length === 1 ? "collection" : "collections"}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-[360px]">
                  <Input
                    value={peopleQuery}
                    onChange={(e) => setPeopleQuery(e.target.value)}
                    placeholder="Search people collections..."
                    className="w-full"
                  />
                </div>
              </div>

              <div role="separator" className="h-px bg-border" />

              {peopleCollections.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-md p-6">
                  No people collections match your search.
                </div>
              ) : (
                <ul className="rounded-md border border-border bg-card/50 divide-y divide-border">
                  {peopleCollections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={`/collections/${collection.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <Badge variant="secondary" className="shrink-0">
                            People
                          </Badge>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{collection.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {collection.description || "No description"} • {collection.itemCount} people
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                          <span>Updated {formatDate(collection.updatedAt)}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Company</h2>
                    <p className="text-sm text-muted-foreground">
                      {companyCollections.length} {companyCollections.length === 1 ? "collection" : "collections"}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-[360px]">
                  <Input
                    value={companyQuery}
                    onChange={(e) => setCompanyQuery(e.target.value)}
                    placeholder="Search company collections..."
                    className="w-full"
                  />
                </div>
              </div>

              <div role="separator" className="h-px bg-border" />

              {companyCollections.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-md p-6">
                  No company collections match your search.
                </div>
              ) : (
                <ul className="rounded-md border border-border bg-card/50 divide-y divide-border">
                  {companyCollections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={`/collections/${collection.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <Badge variant="secondary" className="shrink-0">
                            Companies
                          </Badge>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{collection.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {collection.description || "No description"} • {collection.itemCount} companies
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                          <span>Updated {formatDate(collection.updatedAt)}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
