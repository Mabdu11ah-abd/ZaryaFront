"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { fetchCampaignById, saveCampaign } from "@/lib/mock-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { CampaignStepCard } from "@/components/campaign/campaign-step"
import { ArrowDivider } from "@/components/campaign/arrow-divider"
import { Loader2, Plus } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

const fetcher = (id) => fetchCampaignById(id)

export default function CampaignEditorPage() {
  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const { data, isLoading } = useSWR(id ? ["campaign", id] : null, () => fetcher(id))
  const initial = data 

  const [name, setName] = useState("Untitled campaign")
  const [steps, setSteps] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setSteps(initial.steps)
    }
  }, [initial])

  const addStepAt = (insertIndex, type) => {
    const newStep =
      type === "template-email"
        ? {
            id: crypto.randomUUID(),
            type: "template-email",
            name: "Template email",
            subject: "Hello {{firstName}}",
            body: "Hi {{firstName}},\n\nThis is a sample email body.\n\nBest,\n{{senderName}}",
            delayDays: steps.length === 0 ? 0 : 2,
          }
        : {
            id: crypto.randomUUID(),
            type: "ai-email",
            name: "AI email",
            prompt: "Write a friendly follow-up email referencing our prior message and the recipient's company.",
            subjectTemplate: "Following up on {{company}}",
            delayDays: steps.length === 0 ? 0 : 3,
          }

    const next = [...steps]
    next.splice(insertIndex, 0, newStep)
    setSteps(next)
  }

  const removeStep = (idx) => {
    const next = steps.filter((_, i) => i !== idx)
    setSteps(next)
  }

  const updateStep = (idx, next) => {
    const draft = [...steps]
    draft[idx] = next
    setSteps(draft)
  }

  const handleSave = async () => {
    setSaving(true)
    const saved = await saveCampaign(id, { name, steps, active: false })
    setSaving(false)
    Toaster({ title: "Campaign saved", description: saved.name })
    if (id === "new") {
      router.replace(`/campaigns/${saved.id}`)
    }
  }

  const AddStepSlot = ({ index }) => {
    return (
      <div className="flex flex-col items-center">
        <ArrowDivider delayDays={index > 0 ? steps[index - 1]?.delayDays : undefined} />
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => addStepAt(index, "template-email")}>
            <Plus className="h-4 w-4 mr-2" />
            Add template email
          </Button>
          <Button variant="outline" onClick={() => addStepAt(index, "ai-email")}>
            <Plus className="h-4 w-4 mr-2" />
            Add AI email
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !initial) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading campaign...
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-72" />
          <span className="text-xs text-muted-foreground">
            {steps.length} step{steps.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save changes
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="leads" disabled>
            Leads (soon)
          </TabsTrigger>
          <TabsTrigger value="emails" disabled>
            Emails sent (soon)
          </TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics (soon)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-6">
          {/* First slot to add a step */}
          <AddStepSlot index={0} />

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((s, idx) => (
              <div key={s.id} className="space-y-4">
                <CampaignStepCard
                  step={s}
                  index={idx}
                  onChange={(next) => updateStep(idx, next)}
                  onRemove={() => removeStep(idx)}
                />
                {/* Slot to add a step under this one */}
                <AddStepSlot index={idx + 1} />
              </div>
            ))}
          </div>

          {/* In case there are no steps yet */}
          {steps.length === 0 && (
            <Card className="p-6 bg-muted/20 border-dashed text-sm text-muted-foreground">
              No steps yet. Use the buttons above to add your first step.
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
