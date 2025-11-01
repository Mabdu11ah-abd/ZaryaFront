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

// Utility function for formatting currency
function formatCurrency(value) {
  if (typeof value !== "number") return "N/A"
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

// Enhanced listOrigins function
function listOrigins(origins) {
  if (!Array.isArray(origins)) return []  
  const originMap = {}

  origins.forEach((origin) => {
    const firstPart = origin.split("/")[0]
    const domain = firstPart.replace(/^https?:\/\//, "").replace(/^www\./, "")
    const category = getDomainCategory(domain)

    if (!originMap[category]) {
      originMap[category] = []
    }
    originMap[category].push(origin)
  })

  return originMap
}

function getDomainCategory(domain) {
  if (domain.includes("linkedin")) return "LinkedIn"
  if (domain.includes("github")) return "GitHub"
  if (domain.includes("crunchbase")) return "Crunchbase"
  if (domain.includes("angellist") || domain.includes("angel.co")) return "AngelList"
  if (domain.includes("facebook") || domain.includes("fb.com")) return "Facebook"
  if (domain.includes("twitter") || domain.includes("x.com")) return "Twitter"
  if (domain.includes("instagram")) return "Instagram"
  if (domain.includes("youtube")) return "YouTube"
  if (domain.includes("medium")) return "Medium"
  if (domain.includes("bloomberg") || domain.includes("reuters") || domain.includes("forbes")) return "News & Media"
  return "Other"
}

// Enhanced Diffbot link component
function DiffbotLink({ diffbotUri, className = "" }) {
  if (!diffbotUri) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(diffbotUri, "_blank")}
      className={`text-blue-600 hover:text-blue-700 ${className}`}
    >
      <ExternalLink className="h-3 w-3 mr-1" />
      View Profile
    </Button>
  )
}

export default function CompanyDetails({
  company,
  onLoadPeople,
  onLoadEmails,
  people,
  emails,
  loadingPeople,
  loadingEmails,
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

    return company.employeeCategories.filter((category) => {
      const label =
        typeof category.category === "string"
          ? category.category
          : category.category?.name || category.category?.label || ""
      return label.toLowerCase().includes(jobCategorySearch.toLowerCase())
    })
  }, [company.employeeCategories, jobCategorySearch])

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <Tabs
        defaultValue="overview"
        className="w-full"
        onValueChange={(value) => {
          if (value === "employees") onLoadPeople()
          if (value === "emails") onLoadEmails()
        }}
      >
        <TabsList className="grid w-full grid-cols-8 bg-gray-50">
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
          <TabsTrigger value="employees" onClick={onLoadPeople} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employees
            {company.hasEmployees && <Badge className="bg-green-100 text-green-800 text-xs ml-1">✓</Badge>}
          </TabsTrigger>
          <TabsTrigger value="emails" onClick={onLoadEmails} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-lg mb-4 text-blue-900 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Full Name:</span>
                  <p className="font-medium text-gray-900">{company.fullName || company.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Domain:</span>
                  <p className="text-gray-900">{company.domain?.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Homepage:</span>
                  {company.homepageUri ? (
                    <a
                      href={company.homepageUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      {company.homepageUri}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div>
                  <span className="text-gray-600">LinkedIn:</span>
                  {company.linkedinUrl ? (
                    <a
                      href={company.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      View Profile
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
                {company.diffbotUri && (
                  <div>
                    <span className="text-gray-600">Diffbot Profile:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <DiffbotLink diffbotUri={company.diffbotUri} />
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Data Available</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h4 className="font-semibold text-lg mb-4 text-green-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Size & Revenue
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Employees:</span>
                  <p className="text-gray-900 font-medium">
                    {company.nbEmployees ? company.nbEmployees.toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Employee Range:</span>
                  <p className="text-gray-900">
                    {company.nbEmployeesMin && company.nbEmployeesMax
                      ? `${company.nbEmployeesMin.toLocaleString()} - ${company.nbEmployeesMax.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <p className="text-gray-900 font-medium">{formatCurrency(company.revenue?.value)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Size Category:</span>
                  <p className="text-gray-900">{company.size || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
              <h4 className="font-semibold text-lg mb-4 text-purple-900">Company Status</h4>
              <div className="flex flex-wrap gap-2">
                {company.isPublic && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Public</Badge>}
                {company.isNonProfit && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Non-Profit</Badge>
                )}
                {company.isAcquired && <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Acquired</Badge>}
                {company.isDissolved && (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Dissolved</Badge>
                )}
                {!company.isPublic && !company.isNonProfit && !company.isAcquired && !company.isDissolved && (
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Private</Badge>
                )}
              </div>
            </div>
          </div>

          {company.categories?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-lg mb-4 text-gray-900">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {company.categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant={category.isPrimary ? "default" : "outline"}
                    className="text-sm cursor-pointer hover:scale-105 transition-transform"
                    title={
                      category.summary
                        ? `${category.summary} (Type: ${category.type || "N/A"}, Level: ${category.level || "N/A"})`
                        : undefined
                    }
                  >
                    {category.name}
                    {category.isPrimary && " ⭐"}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {company.allNames?.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-lg mb-4 text-gray-900">All Known Names</h4>
              <div className="flex flex-wrap gap-2">
                {company.allNames.map((name, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(company.description || company.summary) && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-lg mb-4 text-gray-900">Description</h4>
              <div className="space-y-4">
                {company.summary && (
                  <div>
                    <span className="text-gray-600 font-medium">Summary:</span>
                    <p className="text-gray-800 mt-1 leading-relaxed">{company.summary}</p>
                  </div>
                )}
                {company.description && company.description !== company.summary && (
                  <div>
                    <span className="text-gray-600 font-medium">Description:</span>
                    <p className="text-gray-800 mt-1 leading-relaxed">{company.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leadership" className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6">
            {company.ceo && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-lg mb-4 text-blue-900">Chief Executive Officer</h4>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-xl text-gray-900">{company.ceo.name || "N/A"}</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">CEO</Badge>
                    </div>
                    {company.ceo.diffbotUri && <DiffbotLink diffbotUri={company.ceo.diffbotUri} />}
                  </div>
                  {company.ceo.summary && <p className="text-gray-700 leading-relaxed">{company.ceo.summary}</p>}
                  {company.ceo.targetDiffbotId && (
                    <p className="text-xs text-gray-500 mt-2">Diffbot ID: {company.ceo.targetDiffbotId}</p>
                  )}
                </div>
              </div>
            )}

            {company.founders?.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-900">Founders ({company.founders.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.founders.map((founder, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg text-gray-900">{founder.name || "N/A"}</p>
                          <Badge variant="secondary" className="mt-2">
                            Founder
                          </Badge>
                        </div>
                        {founder.diffbotUri && <DiffbotLink diffbotUri={founder.diffbotUri} />}
                      </div>
                      {founder.summary && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">{founder.summary}</p>
                      )}
                      {founder.targetDiffbotId && (
                        <p className="text-xs text-gray-500">Diffbot ID: {founder.targetDiffbotId}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="p-6">
          {company.customers?.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg text-gray-900">Customer Portfolio</h4>
                <Badge variant="outline" className="text-sm">
                  {company.customers.length} customers
                </Badge>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {company.customers.map((customer, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{customer.name || "N/A"}</h5>
                      {customer.type && (
                        <Badge variant="outline" className="text-xs">
                          {customer.type}
                        </Badge>
                      )}
                    </div>
                    {customer.summary && (
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{customer.summary}</p>
                    )}
                    {customer.types?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {customer.types.map((type, typeIndex) => (
                          <Badge key={typeIndex} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No customer information available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="origins" className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-900">Origins & Data Sources</h4>
              <Badge variant="outline" className="text-sm">
                {(company.origins || []).length} total links
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {originFilterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedOriginFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedOriginFilter(option.value)}
                  className="text-xs"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {filteredOrigins.length > 0 ? (
                filteredOrigins.map((origin, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate" title={origin}>
                          {origin}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getDomainCategory(
                            origin
                              .replace(/^https?:\/\//, "")
                              .replace(/^www\./, "")
                              .split("/")[0],
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(origin, "_blank")}
                        className="ml-2 flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Globe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No origins found for the selected filter</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h4 className="font-semibold text-lg mb-4 text-green-900">Location Details</h4>
              <div className="space-y-3 text-sm">
                {company.location && (
                  <>
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="text-gray-900">{company.location.address || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">City:</span>
                      <p className="text-gray-900">{company.location.city?.name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Region:</span>
                      <p className="text-gray-900">{company.location.region?.name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Country:</span>
                      <p className="text-gray-900">{company.location.country?.name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Postal Code:</span>
                      <p className="text-gray-900">{company.location.postalCode || "N/A"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-lg mb-4 text-blue-900">Contact Information</h4>
              <div className="space-y-4 text-sm">
                {company.phoneNumbers?.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Phone Numbers:</span>
                    <div className="mt-2 space-y-2">
                      {company.phoneNumbers.map((phone, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-white rounded p-2 border border-blue-100"
                        >
                          <Phone className="h-4 w-4 text-blue-600" />
                          <p className="text-gray-900">{phone.string}</p>
                          {phone.digits && phone.digits !== phone.string && (
                            <span className="text-xs text-gray-500">({phone.digits})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {company.emailAddresses?.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Email Addresses:</span>
                    <div className="mt-2 space-y-1">
                      {company.emailAddresses.map((email, index) => (
                        <div key={index} className="bg-white rounded p-2 border border-blue-100">
                          <p className="text-gray-900">{email.contactString || email}</p>
                          {email.type && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {email.type}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-lg mb-4 text-gray-900">External Links & Profiles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {company.angellistUri && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">AngelList:</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={company.angellistUri} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                )}
                {company.crunchbaseUri && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Crunchbase:</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={company.crunchbaseUri} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                )}
                {company.githubUri && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">GitHub:</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={company.githubUri} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                )}
                {company.facebookUri && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Facebook:</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={company.facebookUri} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {company.allUris?.length > 0 && (
                <div>
                  <span className="text-gray-700 font-medium">All Associated URIs:</span>
                  <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                    {company.allUris.map((uri, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <span className="truncate flex-1 text-gray-600" title={uri}>
                          {uri}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(uri, "_blank")}
                          className="ml-2 h-6 w-6 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job-categories" className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-900">Employee Job Categories</h4>
              <Badge variant="outline" className="text-sm">
                {company.employeeCategories?.length || 0} categories
              </Badge>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search job categories..."
                value={jobCategorySearch}
                onChange={(e) => setJobCategorySearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredJobCategories.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {filteredJobCategories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2">{category.category}</h5>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {category.nbEmployees} employees
                            </span>
                            {category.firstHireDate && (
                              <span>
                                First hired: {new Date(category.firstHireDate.timestamp * 1000).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.nbEmployees} people
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : company.employeeCategories?.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No job categories found</p>
                <p className="text-gray-400 text-sm">Employee data needs to be scraped to see job categories</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No categories match your search</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="employees" className="p-6">
          <div className="space-y-4">
            {!company.hasEmployees && !loadingPeople && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">Employees not yet fetched for this company</p>
                </div>
                <p className="text-yellow-700 text-sm mt-1">Use the scrape people feature to fetch employee data</p>
              </div>
            )}

            {loadingPeople ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading employees...</p>
              </div>
            ) : people.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-gray-900">Employees</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      {people.length} employees
                    </Badge>
                    {company.hasEmployees && (
                      <Badge className="bg-green-100 text-green-800 text-xs">Data Available</Badge>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {people.map((person, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {person.firstName} {person.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{person.role?.join(", ") || "N/A"}</p>
                          {person.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {person.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {person.linkedInUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={person.linkedInUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No employees found</p>
                <p className="text-gray-400 text-sm">Scrape LinkedIn data to find employees</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="emails" className="p-6">
          <div className="space-y-4">
            {loadingEmails ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading emails...</p>
              </div>
            ) : emails.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-gray-900">Email Addresses</h4>
                  <Badge variant="outline" className="text-sm">
                    {emails.length} emails
                  </Badge>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{email.address}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={email.status === "Valid" ? "default" : "secondary"} className="text-xs">
                              {email.status || "Unknown"}
                            </Badge>
                            {email.isVerified && (
                              <Badge className="text-xs bg-green-100 text-green-800">Verified</Badge>
                            )}
                            {email.isCatchAll && (
                              <Badge variant="outline" className="text-xs">
                                Catch-All
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Method: {email.verificationMethod || "N/A"}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No emails found</p>
                <p className="text-gray-400 text-sm">Use the email discovery tools to find emails</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
