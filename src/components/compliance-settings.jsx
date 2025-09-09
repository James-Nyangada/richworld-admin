"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, DownloadIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ComplianceSettings({ settings, onUpdate }) {
  const [complianceSettings, setComplianceSettings] = React.useState(settings)

  const handleSave = () => {
    onUpdate(complianceSettings)
    toast.success("Compliance settings saved successfully")
  }

  const updateGlobalPolicy = (policy, enabled) => {
    setComplianceSettings((prev) => ({
      ...prev,
      globalPolicies: {
        ...prev.globalPolicies,
        [policy]: enabled,
      },
    }))
  }

  const updateTemplate = (templateName, field, value) => {
    setComplianceSettings((prev) => ({
      ...prev,
      templates: {
        ...prev.templates,
        [templateName]: {
          ...prev.templates[templateName],
          [field]: value,
        },
      },
    }))
  }

  const handleTemplateUpload = (templateName) => {
    toast.success(`${templateName} template uploaded successfully`)
  }

  const handleTemplateDownload = (templateName) => {
    toast.success(`${templateName} template downloaded successfully`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Compliance Configuration</h2>
        <p className="text-muted-foreground">Configure global compliance policies and templates.</p>
      </div>

      {/* Global Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Global Compliance Policies</CardTitle>
          <CardDescription>Enable compliance frameworks that apply across all tenants.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">GDPR (General Data Protection Regulation)</h4>
                <p className="text-sm text-muted-foreground">European Union data protection regulation</p>
              </div>
              <Switch
                checked={complianceSettings.globalPolicies.gdprEnabled}
                onCheckedChange={(checked) => updateGlobalPolicy("gdprEnabled", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">CCPA (California Consumer Privacy Act)</h4>
                <p className="text-sm text-muted-foreground">California state privacy law</p>
              </div>
              <Switch
                checked={complianceSettings.globalPolicies.ccpaEnabled}
                onCheckedChange={(checked) => updateGlobalPolicy("ccpaEnabled", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">HIPAA (Health Insurance Portability and Accountability Act)</h4>
                <p className="text-sm text-muted-foreground">US healthcare data protection regulation</p>
              </div>
              <Switch
                checked={complianceSettings.globalPolicies.hipaaEnabled}
                onCheckedChange={(checked) => updateGlobalPolicy("hipaaEnabled", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Default Templates</CardTitle>
          <CardDescription>Manage default compliance templates used across all companies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consent Form Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Consent Form Template</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consent-name">Template Name</Label>
                <Input
                  id="consent-name"
                  value={complianceSettings.templates.consentForm.name}
                  onChange={(e) => updateTemplate("consentForm", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consent-version">Version</Label>
                <Input
                  id="consent-version"
                  value={complianceSettings.templates.consentForm.version}
                  onChange={(e) => updateTemplate("consentForm", "version", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !complianceSettings.templates.consentForm.lastUpdated && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {complianceSettings.templates.consentForm.lastUpdated
                      ? format(new Date(complianceSettings.templates.consentForm.lastUpdated), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(complianceSettings.templates.consentForm.lastUpdated)}
                    onSelect={(date) => updateTemplate("consentForm", "lastUpdated", date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleTemplateUpload("Consent Form")}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Template
              </Button>
              <Button variant="outline" onClick={() => handleTemplateDownload("Consent Form")}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {/* DPIA Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Data Protection Impact Assessment (DPIA)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dpia-name">Template Name</Label>
                <Input
                  id="dpia-name"
                  value={complianceSettings.templates.dpia.name}
                  onChange={(e) => updateTemplate("dpia", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dpia-version">Version</Label>
                <Input
                  id="dpia-version"
                  value={complianceSettings.templates.dpia.version}
                  onChange={(e) => updateTemplate("dpia", "version", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !complianceSettings.templates.dpia.lastUpdated && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {complianceSettings.templates.dpia.lastUpdated
                      ? format(new Date(complianceSettings.templates.dpia.lastUpdated), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(complianceSettings.templates.dpia.lastUpdated)}
                    onSelect={(date) => updateTemplate("dpia", "lastUpdated", date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleTemplateUpload("DPIA")}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Template
              </Button>
              <Button variant="outline" onClick={() => handleTemplateDownload("DPIA")}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Retention Policy Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Data Retention Policy</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retention-name">Template Name</Label>
                <Input
                  id="retention-name"
                  value={complianceSettings.templates.retentionPolicy.name}
                  onChange={(e) => updateTemplate("retentionPolicy", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-version">Version</Label>
                <Input
                  id="retention-version"
                  value={complianceSettings.templates.retentionPolicy.version}
                  onChange={(e) => updateTemplate("retentionPolicy", "version", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !complianceSettings.templates.retentionPolicy.lastUpdated && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {complianceSettings.templates.retentionPolicy.lastUpdated
                      ? format(new Date(complianceSettings.templates.retentionPolicy.lastUpdated), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(complianceSettings.templates.retentionPolicy.lastUpdated)}
                    onSelect={(date) => updateTemplate("retentionPolicy", "lastUpdated", date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleTemplateUpload("Retention Policy")}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Template
              </Button>
              <Button variant="outline" onClick={() => handleTemplateDownload("Retention Policy")}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Compliance Settings</Button>
      </div>
    </div>
  )
}
