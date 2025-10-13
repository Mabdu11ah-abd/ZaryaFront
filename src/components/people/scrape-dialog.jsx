"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FilterSelect } from "./filter-select"
import { scrapePeople } from "@/lib/mock-api"
import { useSonner } from "sonner"

export function ScrapeDialog() {
  const [open, setOpen] = useState(false)
  const [companyPrompt, setCompanyPrompt] = useState("")
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const { Sonner } = useSonner()

  const handleScrape = async () => {
    if (!companyPrompt.trim()) {
      Sonner({
        title: "Missing information",
        description: "Please provide a company search prompt",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await scrapePeople(companyPrompt, roles)
      Sonner({
        title: "Scraping complete!",
        description: `Found ${result.count} new leads matching your criteria`,
      })
      setOpen(false)
      setCompanyPrompt("")
      setRoles([])
    } catch (error) {
      Sonner({
        title: "Scraping failed",
        description: "An error occurred while scraping leads",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Find Leads
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Scrape New Leads</DialogTitle>
          <DialogDescription>Use AI to find and scrape leads from companies matching your criteria</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Company Search Prompt</label>
            <Textarea
              placeholder="E.g., Find B2B SaaS companies in the US with 50-500 employees that raised Series A funding in the last 2 years..."
              value={companyPrompt}
              onChange={(e) => setCompanyPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Describe the type of companies you want to target. Be as specific as possible.
            </p>
          </div>

          <FilterSelect
            filterType="role"
            value={roles}
            onChange={setRoles}
            placeholder="Select target roles..."
            label="Target Roles (Optional)"
          />

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">How it works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• AI analyzes your prompt to identify target companies</li>
              <li>• Scrapes LinkedIn and other sources for matching profiles</li>
              <li>• Finds contact information and enriches lead data</li>
              <li>• New leads are added to your database automatically</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleScrape} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Scraping
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
