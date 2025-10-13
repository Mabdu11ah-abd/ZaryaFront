"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function formatCurrency(value) {
  if (typeof value !== "number") return "N/A"
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export function listOrigins(origins) {
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

export function getDomainCategory(domain) {
  if (!domain) return "Other"
  domain = domain.toLowerCase()
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

export function DiffbotLink({ diffbotUri, className = "" }) {
  if (!diffbotUri) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(diffbotUri, "_blank")}
      className={className}
    >
      <ExternalLink className="h-3 w-3 mr-1" />
      View Profile
    </Button>
  )
}

export default null
