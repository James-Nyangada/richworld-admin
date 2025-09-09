"use client"

import * as React from "react"
import { PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function CompanyDefaultsSettings({ settings, onUpdate }) {
  const [companySettings, setCompanySettings] = React.useState(settings)

  const handleSave = () => {
    onUpdate(companySettings)
    toast.success("Company defaults saved successfully")
  }

  const updateDataRetention = (field, value) => {
    setCompanySettings((prev) => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        [field]: value,
      },
    }))
  }

  const updateFeature = (feature, enabled) => {
    setCompanySettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: enabled,
      },
    }))
  }

  const addRole = () => {
    const newRole = {
      name: "New Role",
      permissions: ["read"],
    }
    setCompanySettings((prev) => ({
      ...prev,
      defaultRoles: [...prev.defaultRoles, newRole],
    }))
  }

  const updateRole = (index, field, value) => {
    setCompanySettings((prev) => ({
      ...prev,
      defaultRoles: prev.defaultRoles.map((role, i) => (i === index ? { ...role, [field]: value } : role)),
    }))
  }

  const updateRolePermission = (roleIndex, permission, checked) => {
    setCompanySettings((prev) => ({
      ...prev,
      defaultRoles: prev.defaultRoles.map((role, i) => {
        if (i === roleIndex) {
          const permissions = checked
            ? [...role.permissions, permission]
            : role.permissions.filter((p) => p !== permission)
          return { ...role, permissions }
        }
        return role
      }),
    }))
  }

  const removeRole = (index) => {
    setCompanySettings((prev) => ({
      ...prev,
      defaultRoles: prev.defaultRoles.filter((_, i) => i !== index),
    }))
  }

  const availablePermissions = ["read", "write", "delete", "manage_users", "manage_team", "admin"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Company Defaults</h2>
        <p className="text-muted-foreground">Set default configurations for new companies.</p>
      </div>

      {/* Data Retention Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Data Retention Policy</CardTitle>
          <CardDescription>Default data retention settings for new companies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retention-period">Default Retention Period (days)</Label>
              <Input
                id="retention-period"
                type="number"
                value={companySettings.dataRetention.defaultPeriod}
                onChange={(e) => updateDataRetention("defaultPeriod", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification-days">Notification Before Deletion (days)</Label>
              <Input
                id="notification-days"
                type="number"
                value={companySettings.dataRetention.notificationDays}
                onChange={(e) => updateDataRetention("notificationDays", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-delete"
              checked={companySettings.dataRetention.autoDelete}
              onCheckedChange={(checked) => updateDataRetention("autoDelete", checked)}
            />
            <Label htmlFor="auto-delete">Enable Automatic Deletion</Label>
          </div>
        </CardContent>
      </Card>

      {/* Default Roles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Default Roles</CardTitle>
              <CardDescription>Default user roles created for new companies.</CardDescription>
            </div>
            <Button onClick={addRole} size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {companySettings.defaultRoles.map((role, index) => (
            <div key={index} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Label htmlFor={`role-name-${index}`}>Role Name</Label>
                  <Input
                    id={`role-name-${index}`}
                    value={role.name}
                    onChange={(e) => updateRole(index, "name", e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeRole(index)} className="ml-4">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${index}-${permission}`}
                        checked={role.permissions.includes(permission)}
                        onCheckedChange={(checked) => updateRolePermission(index, permission, checked)}
                      />
                      <Label htmlFor={`${index}-${permission}`} className="text-sm capitalize">
                        {permission.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feature Access */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Access</CardTitle>
          <CardDescription>Default feature availability for new companies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dpia-enabled"
                checked={companySettings.features.dpiaEnabled}
                onCheckedChange={(checked) => updateFeature("dpiaEnabled", checked)}
              />
              <Label htmlFor="dpia-enabled">Data Protection Impact Assessment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="breach-alerting"
                checked={companySettings.features.breachAlerting}
                onCheckedChange={(checked) => updateFeature("breachAlerting", checked)}
              />
              <Label htmlFor="breach-alerting">Breach Alerting</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="consent-management"
                checked={companySettings.features.consentManagement}
                onCheckedChange={(checked) => updateFeature("consentManagement", checked)}
              />
              <Label htmlFor="consent-management">Consent Management</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="data-mapping"
                checked={companySettings.features.dataMapping}
                onCheckedChange={(checked) => updateFeature("dataMapping", checked)}
              />
              <Label htmlFor="data-mapping">Data Mapping</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="risk-assessment"
                checked={companySettings.features.riskAssessment}
                onCheckedChange={(checked) => updateFeature("riskAssessment", checked)}
              />
              <Label htmlFor="risk-assessment">Risk Assessment</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Company Defaults</Button>
      </div>
    </div>
  )
}
