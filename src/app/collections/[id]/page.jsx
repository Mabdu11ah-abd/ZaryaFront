"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Users, Building2, Calendar, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchCollectionById, fetchCollectionCompanies } from "@/lib/mock-api"
import { PeopleTable } from "@/components/people/people-table"

export default function CollectionDetailPage() {
  const params = useParams()  
  const router = useRouter()
  const collectionId = params.id 

  const [collection, setCollection] = useState(null)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCollection = async () => {
      const data = await fetchCollectionById(collectionId)
      setCollection(data)

      if (data?.type === "company") {
        const companyData = await fetchCollectionCompanies(collectionId)
        setCompanies(companyData)
      }

      setLoading(false)
    }

    loadCollection()
  }, [collectionId])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Collection not found</h2>
          <p className="text-muted-foreground mb-4">The collection you're looking for doesn't exist</p>
          <Button onClick={() => router.push("/collections")}>Back to Collections</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/collections")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  collection.type === "people"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}
              >
                {collection.type === "people" ? <Users className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{collection.name}</h1>
                  <Badge variant="secondary">{collection.type === "people" ? "People" : "Companies"}</Badge>
                </div>
                <p className="text-muted-foreground">{collection.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>
                    {collection.itemCount} {collection.type === "people" ? "people" : "companies"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {formatDate(collection.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Collection</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Collection</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {collection.type === "people" ? (
          <PeopleTable collectionId={collectionId} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover:border-primary/50 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{company.name}</h3>
                      {company.domain && <p className="text-sm text-muted-foreground">{company.domain}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{company.summary}</p>
                  <div className="space-y-2 text-sm">
                    {company.nbEmployees && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Employees</span>
                        <span className="font-medium">{company.nbEmployees}</span>
                      </div>
                    )}
                    {company.revenue && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium">
                          {company.revenue.currency} {(company.revenue.value / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    )}
                    {company.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {company.categories.slice(0, 2).map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
