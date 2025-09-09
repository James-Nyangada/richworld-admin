"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const description = "Radio station active listeners chart"

const radioListenersData = [
  { hour: "00:00", webListeners: 45, mobileApp: 78, totalActive: 123 },
  { hour: "01:00", webListeners: 32, mobileApp: 56, totalActive: 88 },
  { hour: "02:00", webListeners: 28, mobileApp: 42, totalActive: 70 },
  { hour: "03:00", webListeners: 25, mobileApp: 38, totalActive: 63 },
  { hour: "04:00", webListeners: 22, mobileApp: 35, totalActive: 57 },
  { hour: "05:00", webListeners: 35, mobileApp: 48, totalActive: 83 },
  { hour: "06:00", webListeners: 89, mobileApp: 125, totalActive: 214 },
  { hour: "07:00", webListeners: 156, mobileApp: 198, totalActive: 354 },
  { hour: "08:00", webListeners: 234, mobileApp: 287, totalActive: 521 },
  { hour: "09:00", webListeners: 198, mobileApp: 245, totalActive: 443 },
  { hour: "10:00", webListeners: 167, mobileApp: 203, totalActive: 370 },
  { hour: "11:00", webListeners: 145, mobileApp: 178, totalActive: 323 },
  { hour: "12:00", webListeners: 189, mobileApp: 234, totalActive: 423 },
  { hour: "13:00", webListeners: 167, mobileApp: 198, totalActive: 365 },
  { hour: "14:00", webListeners: 134, mobileApp: 167, totalActive: 301 },
  { hour: "15:00", webListeners: 156, mobileApp: 189, totalActive: 345 },
  { hour: "16:00", webListeners: 178, mobileApp: 223, totalActive: 401 },
  { hour: "17:00", webListeners: 234, mobileApp: 298, totalActive: 532 },
  { hour: "18:00", webListeners: 267, mobileApp: 334, totalActive: 601 },
  { hour: "19:00", webListeners: 298, mobileApp: 378, totalActive: 676 },
  { hour: "20:00", webListeners: 312, mobileApp: 398, totalActive: 710 },
  { hour: "21:00", webListeners: 289, mobileApp: 367, totalActive: 656 },
  { hour: "22:00", webListeners: 234, mobileApp: 298, totalActive: 532 },
  { hour: "23:00", webListeners: 156, mobileApp: 198, totalActive: 354 },
]

const chartConfig = {
  listeners: {
    label: "Active Listeners",
  },
  webListeners: {
    label: "Web Listeners",
    color: "hsl(217, 91%, 60%)", // Vibrant blue
  },
  mobileApp: {
    label: "Mobile App",
    color: "hsl(142, 76%, 36%)", // Vibrant green
  },
  totalActive: {
    label: "Total Active",
    color: "hsl(262, 83%, 58%)", // Vibrant purple
  },
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("24h")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("12h")
    }
  }, [isMobile])

  const filteredData = radioListenersData.filter((item, index) => {
    if (timeRange === "24h") return true
    if (timeRange === "12h") return index >= 12
    if (timeRange === "6h") return index >= 18
    return true
  })

  return (
    <Card className="@container/card bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Live Radio Listeners
        </CardTitle>
        <CardDescription className="text-base">
          <span className="hidden @[540px]/card:block">Active listeners across all platforms - Last 24 hours</span>
          <span className="@[540px]/card:hidden">Active listeners today</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="24h">Last 24 hours</ToggleGroupItem>
            <ToggleGroupItem value="12h">Last 12 hours</ToggleGroupItem>
            <ToggleGroupItem value="6h">Last 6 hours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 24 hours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="24h" className="rounded-lg">
                Last 24 hours
              </SelectItem>
              <SelectItem value="12h" className="rounded-lg">
                Last 12 hours
              </SelectItem>
              <SelectItem value="6h" className="rounded-lg">
                Last 6 hours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWebListeners" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobileApp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTotalActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: 12, fill: "hsl(220, 8.9%, 46.1%)" }}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(220, 13%, 91%)", strokeWidth: 1 }}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${value} - Active Listeners`}
                  indicator="dot"
                  className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-xl"
                />
              }
            />
            <Area
              dataKey="webListeners"
              type="natural"
              fill="url(#fillWebListeners)"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="mobileApp"
              type="natural"
              fill="url(#fillMobileApp)"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
