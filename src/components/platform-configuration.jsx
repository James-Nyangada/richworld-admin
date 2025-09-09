"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon, PaletteIcon, TestTubeIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function PlatformConfiguration({ settings, onUpdate }) {
  const [platformSettings, setPlatformSettings] = React.useState(settings)
  const [showApiKeys, setShowApiKeys] = React.useState({})

  const handleSave = () => {
    onUpdate(platformSettings)
    toast.success("Platform configuration saved successfully")
  }

  const updateBranding = (field, value) => {
    setPlatformSettings((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value,
      },
    }))
  }

  const updateApiKey = (service, value) => {
    setPlatformSettings((prev) => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [service]: value,
      },
    }))
  }

  const updateMonitoring = (field, value) => {
    setPlatformSettings((prev) => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [field]: value,
      },
    }))
  }

  const toggleApiKeyVisibility = (service) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [service]: !prev[service],
    }))
  }

  const handleLogoUpload = () => {
    toast.success("Logo uploaded successfully")
  }

  const testApiKey = (service) => {
    toast.success(`${service} API key tested successfully`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Platform Configuration</h2>
        <p className="text-muted-foreground">Customize platform branding, integrations, and monitoring.</p>
      </div>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize your platform's appearance and branding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={platformSettings.branding.companyName}
                onChange={(e) => updateBranding("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-domain">Custom Domain</Label>
              <Input
                id="custom-domain"
                value={platformSettings.branding.customDomain}
                onChange={(e) => updateBranding("customDomain", e.target.value)}
                placeholder="app.yourcompany.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <img
                src={platformSettings.branding.logo || "/placeholder.svg"}
                alt="Company Logo"
                className="h-10 w-auto rounded border"
              />
              <Button variant="outline" onClick={handleLogoUpload}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload New Logo
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={platformSettings.branding.primaryColor}
                  onChange={(e) => updateBranding("primaryColor", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={platformSettings.branding.primaryColor}
                  onChange={(e) => updateBranding("primaryColor", e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={platformSettings.branding.secondaryColor}
                  onChange={(e) => updateBranding("secondaryColor", e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={platformSettings.branding.secondaryColor}
                  onChange={(e) => updateBranding("secondaryColor", e.target.value)}
                  placeholder="#64748b"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline">
              <PaletteIcon className="mr-2 h-4 w-4" />
              Preview Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for third-party integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stripe */}
          <div className="space-y-2">
            <Label htmlFor="stripe-key">Stripe API Key</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="stripe-key"
                  type={showApiKeys.stripe ? "text" : "password"}
                  value={platformSettings.apiKeys.stripe}
                  onChange={(e) => updateApiKey("stripe", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleApiKeyVisibility("stripe")}
                >
                  {showApiKeys.stripe ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" onClick={() => testApiKey("Stripe")}>
                <TestTubeIcon className="mr-2 h-4 w-4" />
                Test
              </Button>
            </div>
          </div>

          {/* SendGrid */}
          <div className="space-y-2">
            <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="sendgrid-key"
                  type={showApiKeys.sendgrid ? "text" : "password"}
                  value={platformSettings.apiKeys.sendgrid}
                  onChange={(e) => updateApiKey("sendgrid", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleApiKeyVisibility("sendgrid")}
                >
                  {showApiKeys.sendgrid ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" onClick={() => testApiKey("SendGrid")}>
                <TestTubeIcon className="mr-2 h-4 w-4" />
                Test
              </Button>
            </div>
          </div>

          {/* Slack */}
          <div className="space-y-2">
            <Label htmlFor="slack-key">Slack Bot Token</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="slack-key"
                  type={showApiKeys.slack ? "text" : "password"}
                  value={platformSettings.apiKeys.slack}
                  onChange={(e) => updateApiKey("slack", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleApiKeyVisibility("slack")}
                >
                  {showApiKeys.slack ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" onClick={() => testApiKey("Slack")}>
                <TestTubeIcon className="mr-2 h-4 w-4" />
                Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Health Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Server Health Monitoring</CardTitle>
          <CardDescription>Configure monitoring and alerting for platform health.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="health-checks"
                checked={platformSettings.monitoring.healthChecks}
                onCheckedChange={(checked) => updateMonitoring("healthChecks", checked)}
              />
              <Label htmlFor="health-checks">Health Checks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="uptime-monitoring"
                checked={platformSettings.monitoring.uptimeMonitoring}
                onCheckedChange={(checked) => updateMonitoring("uptimeMonitoring", checked)}
              />
              <Label htmlFor="uptime-monitoring">Uptime Monitoring</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="error-tracking"
                checked={platformSettings.monitoring.errorTracking}
                onCheckedChange={(checked) => updateMonitoring("errorTracking", checked)}
              />
              <Label htmlFor="error-tracking">Error Tracking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="performance-monitoring"
                checked={platformSettings.monitoring.performanceMonitoring}
                onCheckedChange={(checked) => updateMonitoring("performanceMonitoring", checked)}
              />
              <Label htmlFor="performance-monitoring">Performance Monitoring</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Platform Configuration</Button>
      </div>
    </div>
  )
}
