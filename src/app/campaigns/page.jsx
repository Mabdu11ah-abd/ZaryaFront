"use client"

import useSWR from "swr"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchCampaigns, toggleCampaignActive} from "@/lib/mock-api"

const fetcher = () => fetchCampaigns()

export default function CampaignsPage() {
  const { data, isLoading, mutate } = useSWR("campaigns", fetcher)

  const onToggle = async (id, active) => {
    await toggleCampaignActive(id, active)
    mutate()
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Create and manage your outreach sequences.</p>
        </div>
        <Link href="/campaigns/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New campaign
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading campaigns...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((c) => (
            <Card key={c.id} className="p-5 bg-card/60 border-border/60">
              <div className="flex items-center justify-between">
                <Link href={`/campaigns/${c.id}`} className="font-medium hover:underline">
                  {c.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs", c.active ? "text-emerald-400" : "text-muted-foreground")}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                  <Switch checked={c.active} onCheckedChange={(v) => onToggle(c.id, v)} />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary">Leads {c.metrics?.leads ?? 0}</Badge>
                <Badge variant="secondary">Sent {c.metrics?.emailsSent ?? 0}</Badge>
                <Badge variant="secondary">Replies {c.metrics?.replies ?? 0}</Badge>
              </div>
              <div className="mt-4">
                <Link
                  href={`/campaigns/${c.id}`}
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  Open editor <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
