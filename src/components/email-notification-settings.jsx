"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon, TestTubeIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function EmailNotificationSettings({ settings, onUpdate }) {
  const [emailSettings, setEmailSettings] = React.useState(settings)
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSave = () => {
    onUpdate(emailSettings)
    toast.success("Email and notification settings saved successfully")
  }

  const handleTestEmail = () => {
    toast.success("Test email sent successfully")
  }

  const updateProvider = (provider) => {
    setEmailSettings((prev) => ({
      ...prev,
      provider,
    }))
  }

  const updateSmtpSettings = (field, value) => {
    setEmailSettings((prev) => ({
      ...prev,
      smtpSettings: {
        ...prev.smtpSettings,
        [field]: value,
      },
    }))
  }

  const updateSesSettings = (field, value) => {
    setEmailSettings((prev) => ({
      ...prev,
      sesSettings: {
        ...prev.sesSettings,
        [field]: value,
      },
    }))
  }

  const updateTemplate = (templateName, field, value) => {
    setEmailSettings((prev) => ({
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

  const updateNotifications = (field, value) => {
    setEmailSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Email & Notification Settings</h2>
        <p className="text-muted-foreground">Configure email providers, templates, and notification preferences.</p>
      </div>

      {/* Email Provider */}
      <Card>
        <CardHeader>
          <CardTitle>Email Provider</CardTitle>
          <CardDescription>Choose your email service provider for sending notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-provider">Provider</Label>
            <Select value={emailSettings.provider} onValueChange={updateProvider}>
              <SelectTrigger id="email-provider">
                <SelectValue placeholder="Select email provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smtp">SMTP</SelectItem>
                <SelectItem value="ses">Amazon SES</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {emailSettings.provider === "smtp" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    value={emailSettings.smtpSettings.host}
                    onChange={(e) => updateSmtpSettings("host", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={emailSettings.smtpSettings.port}
                    onChange={(e) => updateSmtpSettings("port", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input
                    id="smtp-username"
                    value={emailSettings.smtpSettings.username}
                    onChange={(e) => updateSmtpSettings("username", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="smtp-password"
                      type={showPassword ? "text" : "password"}
                      value={emailSettings.smtpSettings.password}
                      onChange={(e) => updateSmtpSettings("password", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-encryption">Encryption</Label>
                <Select
                  value={emailSettings.smtpSettings.encryption}
                  onValueChange={(value) => updateSmtpSettings("encryption", value)}
                >
                  <SelectTrigger id="smtp-encryption">
                    <SelectValue placeholder="Select encryption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {emailSettings.provider === "ses" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ses-region">Region</Label>
                  <Select
                    value={emailSettings.sesSettings.region}
                    onValueChange={(value) => updateSesSettings("region", value)}
                  >
                    <SelectTrigger id="ses-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ses-access-key">Access Key</Label>
                  <Input
                    id="ses-access-key"
                    value={emailSettings.sesSettings.accessKey}
                    onChange={(e) => updateSesSettings("accessKey", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ses-secret-key">Secret Key</Label>
                  <Input
                    id="ses-secret-key"
                    type="password"
                    value={emailSettings.sesSettings.secretKey}
                    onChange={(e) => updateSesSettings("secretKey", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleTestEmail}>
              <TestTubeIcon className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Customize default email templates for various notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consent Granted Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Consent Granted</h4>
            <div className="space-y-2">
              <Label htmlFor="consent-subject">Subject</Label>
              <Input
                id="consent-subject"
                value={emailSettings.templates.consentGranted.subject}
                onChange={(e) => updateTemplate("consentGranted", "subject", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consent-body">Body</Label>
              <Textarea
                id="consent-body"
                rows={3}
                value={emailSettings.templates.consentGranted.body}
                onChange={(e) => updateTemplate("consentGranted", "body", e.target.value)}
              />
            </div>
          </div>

          {/* Breach Alert Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Breach Alert</h4>
            <div className="space-y-2">
              <Label htmlFor="breach-subject">Subject</Label>
              <Input
                id="breach-subject"
                value={emailSettings.templates.breachAlert.subject}
                onChange={(e) => updateTemplate("breachAlert", "subject", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breach-body">Body</Label>
              <Textarea
                id="breach-body"
                rows={3}
                value={emailSettings.templates.breachAlert.body}
                onChange={(e) => updateTemplate("breachAlert", "body", e.target.value)}
              />
            </div>
          </div>

          {/* Password Reset Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Password Reset</h4>
            <div className="space-y-2">
              <Label htmlFor="reset-subject">Subject</Label>
              <Input
                id="reset-subject"
                value={emailSettings.templates.passwordReset.subject}
                onChange={(e) => updateTemplate("passwordReset", "subject", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-body">Body</Label>
              <Textarea
                id="reset-body"
                rows={3}
                value={emailSettings.templates.passwordReset.body}
                onChange={(e) => updateTemplate("passwordReset", "body", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure when and how notifications are sent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notification-frequency">Notification Frequency</Label>
              <Select
                value={emailSettings.notifications.frequency}
                onValueChange={(value) => updateNotifications("frequency", value)}
              >
                <SelectTrigger id="notification-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="digest-time">Daily Digest Time</Label>
              <Input
                id="digest-time"
                type="time"
                value={emailSettings.notifications.digestTime}
                onChange={(e) => updateNotifications("digestTime", e.target.value)}
                disabled={!emailSettings.notifications.digestEnabled}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="digest-enabled"
              checked={emailSettings.notifications.digestEnabled}
              onCheckedChange={(checked) => updateNotifications("digestEnabled", checked)}
            />
            <Label htmlFor="digest-enabled">Enable Daily Digest</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Email Settings</Button>
      </div>
    </div>
  )
}
