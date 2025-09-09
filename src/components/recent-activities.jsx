"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Play, Users, Calendar, Upload, Settings, UserPlus, Clock } from "lucide-react"

export default function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "stream_start",
      title: "Morning Show started broadcasting",
      description: "John Smith began the 6 AM show",
      time: "2 minutes ago",
      icon: Play,
      color: "from-green-500 to-emerald-600",
      avatar: "/presenter.png",
    },
    {
      id: 2,
      type: "new_show",
      title: "New show scheduled",
      description: "Evening Jazz added to Friday lineup",
      time: "15 minutes ago",
      icon: Calendar,
      color: "from-blue-500 to-cyan-600",
      avatar: "/simple-monthly-calendar.png",
    },
    {
      id: 3,
      type: "presenter_added",
      title: "New presenter joined",
      description: "Sarah Johnson added to the team",
      time: "1 hour ago",
      icon: UserPlus,
      color: "from-purple-500 to-violet-600",
      avatar: "/diverse-woman-portrait.png",
    },
    {
      id: 4,
      type: "content_upload",
      title: "Audio content uploaded",
      description: "3 new jingles added to library",
      time: "2 hours ago",
      icon: Upload,
      color: "from-orange-500 to-red-600",
      avatar: "/audio-waves.png",
    },
    {
      id: 5,
      type: "settings_update",
      title: "Stream settings updated",
      description: "Bitrate increased to 320kbps",
      time: "3 hours ago",
      icon: Settings,
      color: "from-indigo-500 to-blue-600",
      avatar: "/settings-interface.png",
    },
    {
      id: 6,
      type: "listener_milestone",
      title: "Listener milestone reached",
      description: "1,000 concurrent listeners achieved",
      time: "4 hours ago",
      icon: Users,
      color: "from-pink-500 to-rose-600",
      avatar: "/vibrant-city-celebration.png",
    },
  ]

  const getActivityBadge = (type) => {
    const badges = {
      stream_start: { label: "Live", variant: "default" },
      new_show: { label: "Scheduled", variant: "secondary" },
      presenter_added: { label: "Team", variant: "outline" },
      content_upload: { label: "Content", variant: "secondary" },
      settings_update: { label: "Config", variant: "outline" },
      listener_milestone: { label: "Milestone", variant: "default" },
    }
    return badges[type] || { label: "Activity", variant: "secondary" }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg mr-6 ml-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Recent Activities
              </CardTitle>
              <p className="text-sm text-muted-foreground">Latest station updates</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Live Updates
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => {
            const Icon = activity.icon
            const badge = getActivityBadge(activity.type)

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                    <AvatarFallback className={`bg-gradient-to-r ${activity.color} text-white text-xs`}>
                      <Icon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${activity.color} flex items-center justify-center`}
                  >
                    <Icon className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {activity.title}
                    </p>
                    <Badge variant={badge.variant} className="text-xs shrink-0">
                      {badge.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
