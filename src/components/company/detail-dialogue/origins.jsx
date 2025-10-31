"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, ExternalLink, Filter } from "lucide-react"
import { listOrigins, getDomainCategory } from "./helpers"

export default function Origins({ company }) {
  const originList = company?.diffbotRaw?.origins || []
  const originCategories = useMemo(() => listOrigins(originList), [originList])
  const [selectedOriginFilter, setSelectedOriginFilter] = useState("all")

  const filteredOrigins = useMemo(() => {
    if (selectedOriginFilter === "all") return originList
    return originCategories[selectedOriginFilter] || []
  }, [selectedOriginFilter, originCategories, originList])

  const originFilterOptions = useMemo(() => {
    const categories = Object.keys(originCategories)
    return [
      { value: "all", label: `All (${originList.length})`, count: originList.length },
      ...categories.map((category) => ({ value: category, label: `${category} (${originCategories[category].length})`, count: originCategories[category].length })),
    ]
  }, [originCategories, originList])

  return (
    <div className="space-y-6">
      
      {/* Header and Total Count */}
      <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border shadow-sm">
        <h4 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" /> Origins & Data Sources
        </h4>
        {/* Using primary theme for the count badge */}
        <Badge className="text-sm bg-primary/10 text-primary font-medium">
          {(company.origins || []).length} total links
        </Badge>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {originFilterOptions.map((option) => (
          <Button
            key={option.value}
            // Use 'default' (primary color) for the active filter, 'secondary' for inactive
            variant={selectedOriginFilter === option.value ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedOriginFilter(option.value)}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            {option.label}
          </Button>
        ))}
      </div>

      {/* List of Origins */}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {filteredOrigins.length > 0 ? (
          filteredOrigins.map((origin, index) => (
            <div 
              key={index} 
              // Use card background and theme border for list items
              className="bg-card rounded-lg p-3 border border-border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate font-medium" title={origin}>{origin}</p>
                  {/* Category text uses muted-foreground */}
                  <p className="text-xs text-muted-foreground">{getDomainCategory(origin.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0])}</p>
                </div>
                {/* External link button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => typeof window !== 'undefined' && window.open(origin, "_blank")} 
                  className="ml-2 flex-shrink-0 text-primary hover:bg-primary/10"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Empty state uses muted-foreground colors
          <div className="text-center py-8 bg-card rounded-xl border border-border shadow-md">
            <Globe className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-muted-foreground">No origins found for the selected filter</p>
          </div>
        )}
      </div>
    </div>
  )
}