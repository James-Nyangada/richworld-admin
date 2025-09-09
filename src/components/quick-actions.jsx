"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Play, Users, Calendar, Settings, Radio, Upload } from "lucide-react"

export default function QuickActions() {
  const actions = [
    {
      title: "Start Live Stream",
      description: "Begin broadcasting",
      icon: Play,
      variant: "default",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Add New Show",
      description: "Schedule a program",
      icon: Plus,
      variant: "outline",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Manage Presenters",
      description: "Team management",
      icon: Users,
      variant: "outline",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "Upload Content",
      description: "Add media files",
      icon: Upload,
      variant: "outline",
      gradient: "from-orange-500 to-red-600",
    },
    {
      title: "View Schedule",
      description: "Today's lineup",
      icon: Calendar,
      variant: "outline",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      title: "Stream Settings",
      description: "Configure broadcast",
      icon: Settings,
      variant: "outline",
      gradient: "from-indigo-500 to-blue-600",
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg mr-6 ml-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-muted-foreground">Manage your radio station</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start gap-2 hover:scale-105 transition-all duration-200 group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
                />
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-1.5 rounded-md bg-gradient-to-r ${action.gradient} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">{action.description}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
