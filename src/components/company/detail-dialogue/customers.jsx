"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Building } from "lucide-react"

export default function Customers({ company }) {
  if (!company) return null

  return company.customers?.length > 0 ? (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border shadow-sm">
        <h4 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" /> Customer Portfolio
        </h4>
        {/* Using a theme-aware badge for the count */}
        <Badge className="text-sm bg-primary/10 text-primary font-medium">
          {company.customers.length} customers
        </Badge>
      </div>
      
      {/* List of Customers */}
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {company.customers.map((customer, index) => (
          <div
            key={index}
            // Use card background and theme border for customer items
            className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h5 className="font-semibold text-lg text-foreground">{customer.name || "N/A"}</h5>
              {customer.type && (
                // Use primary theme for the main type badge
                <Badge className="text-xs bg-primary text-primary-foreground font-medium">
                  {customer.type}
                </Badge>
              )}
            </div>
            
            {/* Summary text uses muted-foreground for secondary information */}
            {customer.summary && <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{customer.summary}</p>}
            
            {customer.types?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50 mt-3">
                {customer.types.map((type, typeIndex) => (
                  // Use secondary/accent style for additional types
                  <Badge key={typeIndex} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground font-normal">
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
    // Empty state uses muted-foreground colors
    <div className="text-center py-12 bg-card rounded-xl border border-border shadow-md">
      <Building className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
      <p className="text-muted-foreground text-lg">No customer information available</p>
    </div>
  )
}
