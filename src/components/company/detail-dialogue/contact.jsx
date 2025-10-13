"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Phone } from "lucide-react"
import { DiffbotLink } from "./helpers" // Assuming DiffbotLink is defined in helpers or imported correctly

export default function Contact({ company }) {
  if (!company) return null

  // Reusable component for key-value pairs (like in Overview)
  const DataBlock = ({ label, value, className = "" }) => (
    <div className={className}>
      <span className="text-muted-foreground text-xs">{label}:</span>
      <p className="text-foreground font-medium text-sm mt-0.5">{value}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Location Details Card */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
            <ExternalLink className="h-5 w-5 rotate-90" /> Location Details
          </h4>
          <div className="space-y-3 text-sm">
            {company.location ? (
              <>
                <DataBlock label="Address" value={company.location.address || "N/A"} />
                <DataBlock label="City" value={company.location.city?.name || "N/A"} />
                <DataBlock label="Region" value={company.location.region?.name || "N/A"} />
                <DataBlock label="Country" value={company.location.country?.name || "N/A"} />
                <DataBlock label="Postal Code" value={company.location.postalCode || "N/A"} />
              </>
            ) : (
              <p className="text-muted-foreground">Location data not available.</p>
            )}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h4 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
            <Phone className="h-5 w-5" /> Contact Information
          </h4>
          <div className="space-y-4 text-sm">
            {company.phoneNumbers?.length > 0 && (
              <div>
                <span className="text-foreground font-medium">Phone Numbers:</span>
                <div className="mt-2 space-y-2">
                  {company.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-secondary rounded p-2 border border-border">
                      <Phone className="h-4 w-4 text-primary" />
                      <p className="text-foreground">{phone.string}</p>
                      {phone.digits && phone.digits !== phone.string && (
                        <span className="text-xs text-muted-foreground">({phone.digits})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {company.emailAddresses?.length > 0 && (
              <div>
                <span className="text-foreground font-medium">Email Addresses:</span>
                <div className="mt-2 space-y-1">
                  {company.emailAddresses.map((email, index) => (
                    <div key={index} className="bg-secondary rounded p-2 border border-border">
                      <p className="text-foreground font-mono text-xs">{email.contactString || email}</p>
                      {email.type && (
                        <Badge variant="outline" className="text-xs mt-1 border-muted-foreground/30 text-muted-foreground">
                          {email.type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(company.phoneNumbers?.length === 0 && company.emailAddresses?.length === 0) && (
                <p className="text-muted-foreground">No phone numbers or emails available.</p>
            )}
          </div>
        </div>
      </div>

      {/* External Links & Profiles Section */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-md">
        <h4 className="font-semibold text-lg mb-4 text-foreground">External Links & Profiles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {/* Standard Profile Links */}
            {[
              { label: "AngelList", uri: company.angellistUri },
              { label: "Crunchbase", uri: company.crunchbaseUri },
              { label: "GitHub", uri: company.githubUri },
              { label: "Facebook", uri: company.facebookUri },
            ].map(({ label, uri }, index) => uri && (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border">
                <span className="text-foreground font-medium">{label}:</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={uri} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {company.allUris?.length > 0 && (
            <div>
              <span className="text-foreground font-medium">All Associated URIs:</span>
              <div className="mt-2 max-h-52 overflow-y-auto space-y-1 rounded-lg border border-border p-2 bg-secondary">
                {company.allUris.map((uri, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-card rounded text-xs border border-border/50">
                    <span className="truncate flex-1 text-muted-foreground" title={uri}>{uri}</span>
                    <Button variant="ghost" size="sm" onClick={() => typeof window !== 'undefined' && window.open(uri, "_blank")} className="ml-2 h-6 w-6 p-0 text-primary hover:bg-primary/10">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
