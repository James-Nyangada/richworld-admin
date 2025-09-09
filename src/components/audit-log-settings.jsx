"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function AuditLogSettings({ settings, onUpdate }) {
  const [auditSettings, setAuditSettings] = React.useState(settings)

  const handleSave = () => {
    onUpdate(auditSettings)
    toast.success("Audit log settings saved successfully")
  }

  const updateSetting = (field, value) => {
    setAuditSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Audit Log Settings</h2>
        <p className="text-muted-foreground">Configure audit logging and retention policies.</p>
      </div>

      {/* Audit Logging */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logging</CardTitle>
          <CardDescription>Control what activities are logged and tracked.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="audit-enabled"
              checked={auditSettings.enabled}
              onCheckedChange={(checked) => updateSetting("enabled", checked)}
            />
            <Label htmlFor="audit-enabled">Enable Audit Logging</Label>
          </div>

          {auditSettings.enabled && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="log-level">Log Level</Label>
                <Select value={auditSettings.logLevel} onValueChange={(value) => updateSetting("logLevel", value)}>
                  <SelectTrigger id="log-level">
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="verbose">Verbose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Log Categories</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="user-actions"
                      checked={auditSettings.includeUserActions}
                      onCheckedChange={(checked) => updateSetting("includeUserActions", checked)}
                    />
                    <Label htmlFor="user-actions">User Actions</Label>
                    <span className="text-sm text-muted-foreground">(Login, logout, data access, modifications)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="system-events"
                      checked={auditSettings.includeSystemEvents}
                      onCheckedChange={(checked) => updateSetting("includeSystemEvents", checked)}
                    />
                    <Label htmlFor="system-events">System Events</Label>
                    <span className="text-sm text-muted-foreground">
                      (Configuration changes, system errors, maintenance)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="api-calls"
                      checked={auditSettings.includeApiCalls}
                      onCheckedChange={(checked) => updateSetting("includeApiCalls", checked)}
                    />
                    <Label htmlFor="api-calls">API Calls</Label>
                    <span className="text-sm text-muted-foreground">(External API requests and responses)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Log Retention</CardTitle>
          <CardDescription>Configure how long audit logs are stored.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retention-duration">Retention Duration (days)</Label>
            <Input
              id="retention-duration"
              type="number"
              value={auditSettings.retentionDuration}
              onChange={(e) => updateSetting("retentionDuration", Number.parseInt(e.target.value))}
              disabled={!auditSettings.enabled}
            />
            <p className="text-sm text-muted-foreground">
              Logs older than this duration will be automatically deleted. Minimum: 30 days, Maximum: 2555 days (7
              years)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Log Export */}
      <Card>
        <CardHeader>
          <CardTitle>Log Export</CardTitle>
          <CardDescription>Export audit logs for external analysis or compliance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => toast.success("Audit logs exported successfully")}
              disabled={!auditSettings.enabled}
            >
              Export All Logs
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Recent logs exported successfully")}
              disabled={!auditSettings.enabled}
            >
              Export Last 30 Days
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Custom export initiated")}
              disabled={!auditSettings.enabled}
            >
              Custom Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Audit Settings</Button>
      </div>
    </div>
  )
}
