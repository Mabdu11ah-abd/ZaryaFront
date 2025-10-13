"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DiffbotLink } from "./helpers" // Assuming DiffbotLink is defined in helpers or imported correctly
import { Users, ExternalLink } from "lucide-react"

export default function Leadership({ company }) {
  if (!company) return null

  // Helper component for DiffbotLink since it was locally defined in Overview
  const ThemedDiffbotLink = ({ diffbotUri }) => {
    if (typeof window === 'undefined' || !diffbotUri) return null
    return (
      <Button variant="outline" size="sm" onClick={() => window.open(diffbotUri, "_blank")}>
        <ExternalLink className="h-3 w-3 mr-1" />
        View Profile
      </Button>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {company.ceo && (
        // CEO Card: Highlighted container using secondary theme color
        <div className="bg-secondary rounded-xl p-6 border border-border shadow-lg">
          <h4 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Chief Executive Officer
          </h4>
          
          {/* Inner CEO Details box */}
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-xl text-foreground">{company.ceo.name || "N/A"}</p>
                {/* Primary colored badge for CEO role */}
                <Badge className="mt-2 bg-primary/10 text-primary font-medium">CEO</Badge>
              </div>
              {company.ceo.diffbotUri && <ThemedDiffbotLink diffbotUri={company.ceo.diffbotUri} />}
            </div>
            {company.ceo.summary && <p className="text-foreground/80 leading-relaxed text-sm">{company.ceo.summary}</p>}
            {company.ceo.targetDiffbotId && (
              <p className="text-xs text-muted-foreground mt-2">Diffbot ID: {company.ceo.targetDiffbotId}</p>
            )}
          </div>
        </div>
      )}

      {company.founders?.length > 0 && (
        <div>
          <h4 className="font-semibold text-lg mb-4 text-foreground">Founders ({company.founders.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.founders.map((founder, index) => (
              // Founder Card: Standard card background
              <div
                key={index}
                className="bg-card rounded-xl p-4 border border-border shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg text-foreground">{founder.name || "N/A"}</p>
                    {/* Secondary badge style for Founder role */}
                    <Badge variant="secondary" className="mt-2 bg-accent/10 text-accent-foreground font-medium">
                      Founder
                    </Badge>
                  </div>
                  {founder.diffbotUri && <ThemedDiffbotLink diffbotUri={founder.diffbotUri} />}
                </div>
                {founder.summary && <p className="text-foreground/80 text-sm leading-relaxed mb-2">{founder.summary}</p>}
                {founder.targetDiffbotId && (
                  <p className="text-xs text-muted-foreground">Diffbot ID: {founder.targetDiffbotId}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
