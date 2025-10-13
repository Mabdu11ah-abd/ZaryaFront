"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Users, ExternalLink } from "lucide-react"

// Helper function definitions remain the same
function formatCurrency(value) {
  if (typeof value !== "number") return "N/A"
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function DiffbotLink({ diffbotUri }) {
  if (!diffbotUri) return null
  // The button's look is handled by the component library, which respects the primary color
  return (
    <Button variant="outline" size="sm" onClick={() => window.open(diffbotUri, "_blank")}>
      <ExternalLink className="h-3 w-3 mr-1" />
      View Profile
    </Button>
  )
}

export default function Overview({ company = {} }) {
  const name = company.fullName || company.name || "Unknown Company"
  const domain = company.domain?.name || "N/A"
  const homepage = company.homepageUri || null
  const linkedin = company.linkedinUrl || null
  const diffbotUri = company.diffbotUri || null

  // Helper component to display key-value pairs
  const DataBlock = ({ label, value, className = "" }) => (
    <div className={className}>
      <span className="text-muted-foreground text-xs">{label}:</span>
      <p className="font-medium text-foreground text-sm mt-0.5">{value}</p>
    </div>
  )

  return (
    <div className="space-y-6 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Basic Information Card - Unified background with primary focus color */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" /> Basic Information
          </h4>
          <div className="space-y-4">
            <DataBlock label="Full Name" value={name} />
            <DataBlock label="Domain" value={domain} />

            <DataBlock label="Homepage" value={
              homepage ? (
                <a href={homepage} target="_blank" rel="noreferrer" className="text-primary hover:underline block">
                  {homepage}
                </a>
              ) : (
                "N/A"
              )
            } />

            <DataBlock label="LinkedIn" value={
              linkedin ? (
                <a href={linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline block">
                  View Profile
                </a>
              ) : (
                "N/A"
              )
            } />

            {diffbotUri && (
              <div className="pt-2">
                <span className="text-muted-foreground text-xs">Diffbot Profile:</span>
                <div className="mt-1 flex items-center gap-2">
                  <DiffbotLink diffbotUri={diffbotUri} />
                  {/* Badge using primary color scheme */}
                  <Badge className="bg-primary/10 text-primary text-xs font-normal">Data Available</Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Size & Revenue Card - Unified background with primary focus color */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Size & Revenue
          </h4>
          <div className="space-y-4">
            <DataBlock label="Employees" value={company.nbEmployees ? company.nbEmployees.toLocaleString() : "N/A"} />
            <DataBlock label="Employee Range" value={
              company.nbEmployeesMin && company.nbEmployeesMax ? `${company.nbEmployeesMin.toLocaleString()} - ${company.nbEmployeesMax.toLocaleString()}` : "N/A"
            } />
            <DataBlock label="Revenue" value={formatCurrency(company.revenue?.value)} className="font-semibold" />
            <DataBlock label="Size Category" value={company.size || "N/A"} />
          </div>
        </div>

        {/* 3. Company Status Card - Unified background with primary focus color */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-primary">Status Indicators</h4>
          <div className="flex flex-wrap gap-2">
            {/* Using theme colors for status badges */}
            {company.isPublic && <Badge className="bg-primary text-primary-foreground text-sm font-medium">Public</Badge>}
            {company.isNonProfit && <Badge className="bg-secondary text-secondary-foreground text-sm font-medium">Non-Profit</Badge>}
            {/* Destructive color for acquired/negative status */}
            {company.isAcquired && <Badge className="bg-destructive/90 text-destructive-foreground text-sm font-medium">Acquired</Badge>}
            {/* Muted color for dissolved/inactive status */}
            {company.isDissolved && <Badge className="bg-muted text-muted-foreground text-sm font-medium">Dissolved</Badge>}
            {/* Default/Accent for Private */}
            {!company.isPublic && !company.isNonProfit && !company.isAcquired && !company.isDissolved && (
              <Badge className="bg-accent text-accent-foreground text-sm font-medium">Private</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {company.categories?.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-foreground">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {company.categories.map((category, index) => (
              <Badge
                key={index}
                // Use primary for default (primary category) and outline for others
                variant={category.isPrimary ? "default" : "outline"}
                className={category.isPrimary ? "bg-primary text-primary-foreground text-sm" : "border-border text-foreground text-sm"}
              >
                {category.name}
                {category.isPrimary && " ⭐"}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* All Known Names Section */}
      {company.allNames?.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-foreground">All Known Names</h4>
          <div className="flex flex-wrap gap-2">
            {company.allNames.map((name, index) => (
              // Using outline badge for alternative names
              <Badge key={index} variant="outline" className="text-sm border-muted-foreground/30 text-muted-foreground">{name}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Description/Summary Section */}
      {(company.description || company.summary) && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-foreground">Description</h4>
          <div className="space-y-4">
            {company.summary && (
              <div>
                <span className="text-muted-foreground font-medium text-sm">Summary:</span>
                <p className="text-foreground mt-1 leading-relaxed">{company.summary}</p>
              </div>
            )}
            {company.description && company.description !== company.summary && (
              <div>
                <span className="text-muted-foreground font-medium text-sm">Description:</span>
                <p className="text-foreground mt-1 leading-relaxed">{company.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
