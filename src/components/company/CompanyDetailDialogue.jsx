"use client"

import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Phone,
  RefreshCw,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
  Building,
  Globe,
  Users,
  Mail,
  Search,
  Loader2,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Alert, AlertDescription } from '@/components/ui/alert'

// new tab components
import Overview from "./detail-dialogue/overview"
import Leadership from "./detail-dialogue/leadership"
import Customers from "./detail-dialogue/customers"
import Origins from "./detail-dialogue/origins"
import Contact from "./detail-dialogue/contact"
import JobCategories from "./detail-dialogue/job-categories"
import Employees from "./detail-dialogue/employees"
import Emails from "./detail-dialogue/emails"
import { listOrigins, getDomainCategory, formatCurrency, DiffbotLink } from "./detail-dialogue/helpers"

export default function CompanyDetails({
  company,
  onCompanyUpdate, // Optional callback to update parent component
}) {
  const [selectedOriginFilter, setSelectedOriginFilter] = useState("all")
  const [jobCategorySearch, setJobCategorySearch] = useState("")
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichmentError, setEnrichmentError] = useState(null)
  const [enrichedCompany, setEnrichedCompany] = useState(company)
  const [isOpen, setIsOpen] = useState(false)

  // Reset enriched company when company prop changes
  useEffect(() => {
    setEnrichedCompany(company)
    setEnrichmentError(null)
  }, [company])

  // Enrich company data when dialog opens if not on Diffbot
  useEffect(() => {
    console.log("Enriching company data effect triggered");
    const enrichCompany = async () => {
        console.log("trying")
        console.log('company', company)
        console.log(company.onDiffbot, isOpen)
      if (
        isOpen &&
        company.linkedinUrl &&
        (company.onDiffbot === false || company.onDiffbot === null)
      ) {
        console.log("enriching...")
        setIsEnriching(true)
        setEnrichmentError(null)
        console.log("got response")

        try {
          const response = await fetch('http://localhost:3003/companies/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedinUrl: company.linkedinUrl,
        }),
          })

          if (!response.ok) {
        throw new Error(`Enrichment failed: ${response.statusText}`)
          }

          const enrichedData = await response.json()
          const updatedCompany = { ...company, ...enrichedData, onDiffbot: true }
          setEnrichedCompany(updatedCompany)
          
          // Notify parent component of the update
          if (onCompanyUpdate) {
        onCompanyUpdate(updatedCompany)
          }
        } catch (error) {
          console.error('Error enriching company:', error)
          setEnrichmentError(error.message)
        } finally {
          setIsEnriching(false)
        }
      }
    }

    enrichCompany()
  }, [isOpen, company, onCompanyUpdate])

  const originCategories = useMemo(() => {
    return listOrigins(enrichedCompany.origins || [])
  }, [enrichedCompany.origins])

  const filteredOrigins = useMemo(() => {
    if (selectedOriginFilter === "all") {
      return enrichedCompany.origins || []
    }
    return originCategories[selectedOriginFilter] || []
  }, [selectedOriginFilter, originCategories, enrichedCompany.origins])

  const originFilterOptions = useMemo(() => {
    const categories = Object.keys(originCategories)
    return [
      {
        value: "all",
        label: `All (${(enrichedCompany.origins || []).length})`,
        count: (enrichedCompany.origins || []).length,
      },
      ...categories.map((category) => ({
        value: category,
        label: `${category} (${originCategories[category].length})`,
        count: originCategories[category].length,
      })),
    ]
  }, [originCategories, enrichedCompany.origins])

  const filteredJobCategories = useMemo(() => {
    if (!enrichedCompany.employeeCategories) return []

    return enrichedCompany.employeeCategories.filter((category) => {
      const label =
        typeof category.category === "string"
          ? category.category
          : category.category?.name || category.category?.label || ""
      return label.toLowerCase().includes(jobCategorySearch.toLowerCase())
    })
  }, [enrichedCompany.employeeCategories, jobCategorySearch])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Company Details</Button>
      </DialogTrigger>

      <DialogContent className="bg-background sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{enrichedCompany.name || "Company Details"}</DialogTitle>
          <DialogDescription>
            Comprehensive data and insights for this organization.
          </DialogDescription>
        </DialogHeader>

        {/* Enrichment Status */}
        {isEnriching && (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription className="ml-2">
              Enriching company data from Diffbot... This may take a moment.
            </AlertDescription>
          </Alert>
        )}

        {enrichmentError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Failed to enrich company data: {enrichmentError}
            </AlertDescription>
          </Alert>
        )}

        {!company.linkedinUrl && company.onDiffbot === false && (
          <Alert className="mb-4">
            <AlertDescription>
              LinkedIn URL is required to enrich company data.
            </AlertDescription>
          </Alert>
        )}

        <div className="w-full bg-white rounded-lg shadow-sm">
          <Tabs
            defaultValue="overview"
            className="w-full bg-background"
            onValueChange={(value) => {
              // Add any necessary logic for tab change here
            }}
          >
            <TabsList className="bg-background grid w-full grid-cols-8 sticky top-0 z-10">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="leadership" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Leadership
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Customers ({enrichedCompany.customers?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="origins" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Origins ({(enrichedCompany.origins || []).length})
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="job-categories" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Job Categories ({enrichedCompany.employeeCategories?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employees
                {enrichedCompany.hasEmployees && <Badge className="bg-green-100 text-green-800 text-xs ml-1">✓</Badge>}
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Emails
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 p-6">
              <Overview company={enrichedCompany} />
            </TabsContent>

            <TabsContent value="leadership" className="space-y-6 p-6">
              <Leadership company={enrichedCompany} />
            </TabsContent>

            <TabsContent value="customers" className="p-6">
              <Customers company={enrichedCompany} />
            </TabsContent>

            <TabsContent value="origins" className="p-6">
              <Origins
                company={enrichedCompany}
                originFilterOptions={originFilterOptions}
                selectedOriginFilter={selectedOriginFilter}
                setSelectedOriginFilter={setSelectedOriginFilter}
                filteredOrigins={filteredOrigins}
                getDomainCategory={getDomainCategory}
                DiffbotLink={DiffbotLink}
              />
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 p-6">
              <Contact company={enrichedCompany} />
            </TabsContent>

            <TabsContent value="job-categories" className="p-6">
              <JobCategories
                company={enrichedCompany}
                jobCategorySearch={jobCategorySearch}
                setJobCategorySearch={setJobCategorySearch}
                filteredJobCategories={filteredJobCategories}
                Search={Search}
              />
            </TabsContent>

            <TabsContent value="employees" className="p-6">
              <Employees company={enrichedCompany} />
            </TabsContent>

            <TabsContent value="emails" className="p-6">
              <Emails company={enrichedCompany} />
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          {/* You can add a button here, but the dialog typically closes when clicking outside or pressing ESC */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}