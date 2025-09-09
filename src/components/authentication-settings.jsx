"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function AuthenticationSettings({ settings, onUpdate }) {
  const [authSettings, setAuthSettings] = React.useState(settings)
  const [showSecrets, setShowSecrets] = React.useState({})

  const handleSave = () => {
    onUpdate(authSettings)
    toast.success("Authentication settings saved successfully")
  }

  const toggleSecretVisibility = (key) => {
    setShowSecrets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const updatePasswordRules = (field, value) => {
    setAuthSettings((prev) => ({
      ...prev,
      passwordRules: {
        ...prev.passwordRules,
        [field]: value,
      },
    }))
  }

  const updateRateLimits = (field, value) => {
    setAuthSettings((prev) => ({
      ...prev,
      rateLimits: {
        ...prev.rateLimits,
        [field]: value,
      },
    }))
  }

  const updateLoginProvider = (provider, field, value) => {
    setAuthSettings((prev) => ({
      ...prev,
      loginProviders: {
        ...prev.loginProviders,
        [provider]: {
          ...prev.loginProviders[provider],
          [field]: value,
        },
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Authentication Settings</h2>
        <p className="text-muted-foreground">Configure login security and authentication providers.</p>
      </div>

      {/* Multi-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>
          <CardDescription>Require users to provide additional verification when logging in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="mfa-enabled"
              checked={authSettings.mfaEnabled}
              onCheckedChange={(checked) =>
                setAuthSettings((prev) => ({
                  ...prev,
                  mfaEnabled: checked,
                }))
              }
            />
            <Label htmlFor="mfa-enabled">Enable Multi-Factor Authentication</Label>
          </div>
        </CardContent>
      </Card>

      {/* Password Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Password Rules</CardTitle>
          <CardDescription>Set password complexity requirements for all users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-length">Minimum Length</Label>
              <Input
                id="min-length"
                type="number"
                value={authSettings.passwordRules.minLength}
                onChange={(e) => updatePasswordRules("minLength", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Input
                id="password-expiry"
                type="number"
                value={authSettings.passwordRules.passwordExpiry}
                onChange={(e) => updatePasswordRules("passwordExpiry", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="require-uppercase"
                checked={authSettings.passwordRules.requireUppercase}
                onCheckedChange={(checked) => updatePasswordRules("requireUppercase", checked)}
              />
              <Label htmlFor="require-uppercase">Require Uppercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="require-lowercase"
                checked={authSettings.passwordRules.requireLowercase}
                onCheckedChange={(checked) => updatePasswordRules("requireLowercase", checked)}
              />
              <Label htmlFor="require-lowercase">Require Lowercase</Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="require-numbers"
                checked={authSettings.passwordRules.requireNumbers}
                onCheckedChange={(checked) => updatePasswordRules("requireNumbers", checked)}
              />
              <Label htmlFor="require-numbers">Require Numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="require-special"
                checked={authSettings.passwordRules.requireSpecialChars}
                onCheckedChange={(checked) => updatePasswordRules("requireSpecialChars", checked)}
              />
              <Label htmlFor="require-special">Require Special Characters</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
          <CardDescription>Configure login attempt limits and lockout policies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="login-attempts">Max Login Attempts</Label>
              <Input
                id="login-attempts"
                type="number"
                value={authSettings.rateLimits.loginAttempts}
                onChange={(e) => updateRateLimits("loginAttempts", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
              <Input
                id="lockout-duration"
                type="number"
                value={authSettings.rateLimits.lockoutDuration}
                onChange={(e) => updateRateLimits("lockoutDuration", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-attempts">Max Reset Attempts</Label>
              <Input
                id="reset-attempts"
                type="number"
                value={authSettings.rateLimits.resetAttempts}
                onChange={(e) => updateRateLimits("resetAttempts", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Login Providers</CardTitle>
          <CardDescription>Configure external authentication providers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Google OAuth</h4>
                <p className="text-sm text-muted-foreground">Allow users to sign in with Google</p>
              </div>
              <Switch
                checked={authSettings.loginProviders.google.enabled}
                onCheckedChange={(checked) => updateLoginProvider("google", "enabled", checked)}
              />
            </div>
            {authSettings.loginProviders.google.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    value={authSettings.loginProviders.google.clientId}
                    onChange={(e) => updateLoginProvider("google", "clientId", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google-client-secret">Client Secret</Label>
                  <div className="relative">
                    <Input
                      id="google-client-secret"
                      type={showSecrets.googleSecret ? "text" : "password"}
                      value={authSettings.loginProviders.google.clientSecret}
                      onChange={(e) => updateLoginProvider("google", "clientSecret", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecretVisibility("googleSecret")}
                    >
                      {showSecrets.googleSecret ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Microsoft */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Microsoft Azure AD</h4>
                <p className="text-sm text-muted-foreground">Allow users to sign in with Microsoft</p>
              </div>
              <Switch
                checked={authSettings.loginProviders.microsoft.enabled}
                onCheckedChange={(checked) => updateLoginProvider("microsoft", "enabled", checked)}
              />
            </div>
            {authSettings.loginProviders.microsoft.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="microsoft-client-id">Client ID</Label>
                  <Input
                    id="microsoft-client-id"
                    value={authSettings.loginProviders.microsoft.clientId}
                    onChange={(e) => updateLoginProvider("microsoft", "clientId", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="microsoft-client-secret">Client Secret</Label>
                  <div className="relative">
                    <Input
                      id="microsoft-client-secret"
                      type={showSecrets.microsoftSecret ? "text" : "password"}
                      value={authSettings.loginProviders.microsoft.clientSecret}
                      onChange={(e) => updateLoginProvider("microsoft", "clientSecret", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecretVisibility("microsoftSecret")}
                    >
                      {showSecrets.microsoftSecret ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Okta */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Okta SSO</h4>
                <p className="text-sm text-muted-foreground">Allow users to sign in with Okta</p>
              </div>
              <Switch
                checked={authSettings.loginProviders.okta.enabled}
                onCheckedChange={(checked) => updateLoginProvider("okta", "enabled", checked)}
              />
            </div>
            {authSettings.loginProviders.okta.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="okta-domain">Okta Domain</Label>
                  <Input
                    id="okta-domain"
                    value={authSettings.loginProviders.okta.domain}
                    onChange={(e) => updateLoginProvider("okta", "domain", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="okta-client-id">Client ID</Label>
                  <Input
                    id="okta-client-id"
                    value={authSettings.loginProviders.okta.clientId}
                    onChange={(e) => updateLoginProvider("okta", "clientId", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Authentication Settings</Button>
      </div>
    </div>
  )
}
