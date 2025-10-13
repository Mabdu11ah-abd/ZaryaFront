"use client"

import { useId } from "react"
import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"




export function CampaignStepCard({ step, index, onChange, onRemove }) {
  const htmlId = useId()

  return (
    <Card className="bg-card/60 border-border/60 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Step {index + 1}</span>
          <Input
            value={step.name}
            onChange={(e) => onChange({ ...step, name: e.target.value })}
            placeholder="Step name"
            className="h-8 w-56"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={step.type}
            onValueChange={(v) => onChange({ ...step, type: v })}
          >
            <SelectTrigger className="h-8 w-44">
              <SelectValue placeholder="Step type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template-email">Template email</SelectItem>
              <SelectItem value="ai-email">AI-generated email</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove step">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {step.type === "template-email" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`${htmlId}-subject`}>Subject</Label>
              <Input
                id={`${htmlId}-subject`}
                value={step.subject}
                onChange={(e) => onChange({ ...step, subject: e.target.value })}
                placeholder="Subject e.g. Quick intro for {{company}}"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${htmlId}-body`}>Email body</Label>
              <Textarea
                id={`${htmlId}-body`}
                value={step.body}
                onChange={(e) => onChange({ ...step, body: e.target.value })}
                rows={8}
                placeholder="Use {{firstName}}, {{company}}, {{senderName}} templating..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preview (static)</Label>
            <div className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground leading-6">
              <p>To: Example Contact example@company.com</p>
              <p>Subject: {step.subject || "(no subject)"}</p>
              <p>
                <br />
              </p>
              {step.body ? (
                step.body.split("\n").map((ln, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {ln}
                  </p>
                ))
              ) : (
                <p>Body will appear here...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {step.type === "ai-email" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Subject template</Label>
              <Input
                value={step.subjectTemplate || ""}
                onChange={(e) => onChange({ ...step, subjectTemplate: e.target.value })}
                placeholder="e.g. Following up on potential fit"
              />
            </div>
            <div className="space-y-2">
              <Label>Prompt (no AI call yet)</Label>
              <Textarea
                value={step.prompt}
                onChange={(e) => onChange({ ...step, prompt: e.target.value })}
                rows={8}
                placeholder="Describe what the email should say. We'll use mock data for now."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preview (mock)</Label>
            <div className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground leading-6">
              <p className="mb-2">Subject: {step.subjectTemplate || "(no subject)"}</p>
              <p>AI would generate content here based on your prompt. This is a static preview for now.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 md:max-w-md">
        <div className="space-y-2">
          <Label>Delay after previous step (days)</Label>
          <Input
            type="number"
            min={0}
            value={step.delayDays}
            onChange={(e) => onChange({ ...step, delayDays: Math.max(0, Number(e.target.value || 0)) })}
          />
        </div>
      </div>
    </Card>
  )
}
