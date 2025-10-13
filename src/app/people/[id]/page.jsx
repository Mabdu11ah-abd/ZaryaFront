"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  MailX,
  ExternalLink,
  Building2,
  Users,
  DollarSign,
  Tag,
  Briefcase,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { fetchPersonDetail} from "@/lib/mock-api"

export default function PersonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const personId = params.id 

  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPerson = async () => {
      const data = await fetchPersonDetail(personId)
      setPerson(data)
      setLoading(false)
    }

    loadPerson()
  }, [personId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Person not found</h2>
          <p className="text-muted-foreground mb-4">The person you're looking for doesn't exist</p>
          <Button onClick={() => router.push("/")}>Back to Leads</Button>
        </div>
      </div>
    )
  }

  const company = person.companyDetails

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {person.firstName} {person.lastName}
              </h1>
              <div className="flex items-center gap-3">
                {person.hasEmail ? (
                  <Badge
                    variant="default"
                    className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20"
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    Email Available
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    <MailX className="mr-1 h-3 w-3" />
                    Email Not Found
                  </Badge>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={person.linkedInUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </a>
                </Button>
              </div>
            </div>
            <Button>Add to Collection</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Person Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            {person.description && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">About</h3>
                </div>
                <p className="text-muted-foreground">{person.description}</p>
              </div>
            )}

            <Separator />

            {/* Roles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Roles</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {person.role.map((role, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            {person.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {person.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Company Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Name & Domain */}
            <div>
              <h3 className="font-semibold text-xl mb-1">{company.name}</h3>
              {company.fullName && company.fullName !== company.name && (
                <p className="text-sm text-muted-foreground mb-2">{company.fullName}</p>
              )}
              {company.domain && (
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  {company.domain}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <Separator />

            {/* Company Description */}
            {company.description && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Description</h3>
                <p className="text-muted-foreground">{company.description}</p>
              </div>
            )}

            <Separator />

            {/* Company Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employees */}
              {company.nbEmployees && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="text-xl font-semibold">{company.nbEmployees.toLocaleString()}</p>
                    {company.nbEmployeesMin && company.nbEmployeesMax && (
                      <p className="text-xs text-muted-foreground">
                        Range: {company.nbEmployeesMin}-{company.nbEmployeesMax}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Revenue */}
              {company.revenue && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Revenue</p>
                    <p className="text-xl font-semibold">
                      {company.revenue.currency} {(company.revenue.value / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Categories/Industry */}
            {company.categories.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm mb-3">Industry & Categories</h3>
                  <div className="space-y-2">
                    {company.categories.map((category, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Badge variant={category.isPrimary ? "default" : "secondary"} className="text-sm">
                          {category.name}
                        </Badge>
                        {category.summary && <span className="text-sm text-muted-foreground">{category.summary}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
