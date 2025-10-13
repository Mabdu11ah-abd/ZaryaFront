"use client"

import { useState, useMemo } from "react"
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
}) {
  const [selectedOriginFilter, setSelectedOriginFilter] = useState("all")
  const [jobCategorySearch, setJobCategorySearch] = useState("")

  const originCategories = useMemo(() => {
    return listOrigins(company.origins || [])
  }, [company.origins])

  const filteredOrigins = useMemo(() => {
    if (selectedOriginFilter === "all") {
      return company.origins || []
    }
    return originCategories[selectedOriginFilter] || []
  }, [selectedOriginFilter, originCategories, company.origins])

  const originFilterOptions = useMemo(() => {
    const categories = Object.keys(originCategories)
    return [
      {
        value: "all",
        label: `All (${(company.origins || []).length})`,
        count: (company.origins || []).length,
      },
      ...categories.map((category) => ({
        value: category,
        label: `${category} (${originCategories[category].length})`,
        count: originCategories[category].length,
      })),
    ]
  }, [originCategories, company.origins])

  const filteredJobCategories = useMemo(() => {
    if (!company.employeeCategories) return []

    return company.employeeCategories.filter((category) =>
      category.category.toLowerCase().includes(jobCategorySearch.toLowerCase()),
    )
  }, [company.employeeCategories, jobCategorySearch])

  return (
    <Dialog>
      {/* NOTE: In a real app, this trigger would likely be in the parent component 
        that renders the CompanyDetails dialog, but it's included here for completeness.
      */}
      <DialogTrigger asChild>
        <Button variant="outline">View Company Details</Button>
      </DialogTrigger>

      <DialogContent className="bg-background sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Use the company name as the title */}
          <DialogTitle>{company.name || "Company Details"}</DialogTitle>
          <DialogDescription>
            Comprehensive data and insights for this organization.
          </DialogDescription>
        </DialogHeader>

        {/* Existing CompanyDetails content moved inside DialogContent */}
        <div className="w-full bg-white rounded-lg shadow-sm">
          <Tabs
            defaultValue="overview"
            className="w-full bg-background"
            onValueChange={(value) => {
              // Add any necessary logic for tab change here
            }}
          >
            <TabsList className=" bg-background grid w-full grid-cols-8  sticky top-0 z-10">
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
                Customers ({company.customers?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="origins" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Origins ({(company.origins || []).length})
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="job-categories" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Job Categories ({company.employeeCategories?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="employees"  className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employees
                {company.hasEmployees && <Badge className="bg-green-100 text-green-800 text-xs ml-1">✓</Badge>}
              </TabsTrigger>
              <TabsTrigger value="emails"  className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Emails
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 p-6">
              <Overview company={company} />
            </TabsContent>

            <TabsContent value="leadership" className="space-y-6 p-6">
              <Leadership company={company} />
            </TabsContent>

            <TabsContent value="customers" className="p-6">
              <Customers company={company} />
            </TabsContent>

            <TabsContent value="origins" className="p-6">
              {/* Added the Origins component back in, which was commented out in your original code */}
              <Origins
                company={company}
                originFilterOptions={originFilterOptions}
                selectedOriginFilter={selectedOriginFilter}
                setSelectedOriginFilter={setSelectedOriginFilter}
                filteredOrigins={filteredOrigins}
                getDomainCategory={getDomainCategory}
                DiffbotLink={DiffbotLink}
              />
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 p-6">
              <Contact company={company} />
            </TabsContent>

            <TabsContent value="job-categories" className="p-6">
              <JobCategories
                company={company}
                jobCategorySearch={jobCategorySearch}
                setJobCategorySearch={setJobCategorySearch}
                filteredJobCategories={filteredJobCategories}
                Search={Search}
              />
            </TabsContent>

            <TabsContent value="employees" className="p-6">
              <Employees company={company} />
            </TabsContent>

            <TabsContent value="emails" className="p-6">
              <Emails company={company} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Optional footer for dialog, e.g., a close button */}
        <DialogFooter>
          {/* You can add a button here, but the dialog typically closes when clicking outside or pressing ESC */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}