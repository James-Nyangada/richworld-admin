"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Settings,
  MessageSquare,
} from "lucide-react"

// Sample data for charts
const bookingTrendData = [
  { month: "Jan", bookings: 45, revenue: 67500 },
  { month: "Feb", bookings: 52, revenue: 78000 },
  { month: "Mar", bookings: 48, revenue: 72000 },
  { month: "Apr", bookings: 61, revenue: 91500 },
  { month: "May", bookings: 55, revenue: 82500 },
  { month: "Jun", bookings: 67, revenue: 100500 },
  { month: "Jul", bookings: 73, revenue: 109500 },
  { month: "Aug", bookings: 69, revenue: 103500 },
  { month: "Sep", bookings: 58, revenue: 87000 },
  { month: "Oct", bookings: 64, revenue: 96000 },
  { month: "Nov", bookings: 71, revenue: 106500 },
  { month: "Dec", bookings: 78, revenue: 117000 },
]

const packagePerformanceData = [
  { name: "Bali Adventure", bookings: 45, revenue: 67500 },
  { name: "Tokyo Explorer", bookings: 32, revenue: 57600 },
  { name: "Paris Romance", bookings: 28, revenue: 61600 },
  { name: "Swiss Alps", bookings: 15, revenue: 42000 },
  { name: "Dubai Luxury", bookings: 22, revenue: 66000 },
]

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState("12months")
  const [packages, setPackages] = useState([])
  const [bookings, setBookings] = useState([])
  const [testimonials, setTestimonials] = useState([])

  const API = process.env.NEXT_PUBLIC_API_URL;
    // 🔹 Fetch packages from backend
    useEffect(() => {
      fetchPackages()
    }, [])
  
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`${API}/api/packages`)
        setPackages(res.data)
      } catch (err) {
        console.error("Error fetching packages:", err)
      }
    }

    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const res = await axios.get(`${API}/api/bookings`)
          setBookings(res.data)
        } catch (error) {
          console.error("Error fetching bookings:", error)
        }
      }
      fetchBookings()
    }, [])

      // ✅ Fetch testimonials from backend
      useEffect(() => {
        const fetchTestimonials = async () => {
          try {
            const res = await axios.get(`${API}/api/testimonials`)
            setTestimonials(res.data)
          } catch (error) {
            console.error("❌ Error fetching testimonials:", error)
          } finally {
            setLoading(false)
          }
        }
        fetchTestimonials()
      }, [])

  const quickActions = [
    {
      title: "View Bookings",
      description: "Manage customer bookings",
      icon: Calendar,
      href: "/super-admin/booking",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Add Package",
      description: "Create new travel package",
      icon: Plus,
      href: "/super-admin/packages/add",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Manage Packages",
      description: "Edit existing packages",
      icon: Package,
      href: "/super-admin/packages",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "View Testimonials",
      description: "Customer reviews",
      icon: MessageSquare,
      href: "/super-admin/testimonials",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your travel business.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Packages</p>
                  <p className="text-3xl font-bold text-primary mb-2">{packages.length}</p>
                  {/* <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                  </div> */}
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{bookings.length}</p>
                  {/* <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+8% from last month</span>
                  </div> */}
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Paid Bookings</p>
                  <p className="text-3xl font-bold text-green-600 mb-2">{bookings.filter((b) => b.status === "paid").length}</p>
                  
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Testimonials</p>
                  <p className="text-3xl font-bold text-purple-600 mb-2">{testimonials.length}</p>
                  {/* <div className="flex items-center">
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600 font-medium">-3% from last month</span>
                  </div> */}
                </div>
                <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions to manage your travel business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow duration-200 bg-transparent"
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className={`h-10 w-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Monthly booking patterns to track peak and non-peak months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Package Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Package Performance</CardTitle>
              <CardDescription>Top performing packages by booking volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={packagePerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis dataKey="name" type="category" width={100} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="bookings" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest customer bookings and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "BK001",
                    customer: "John Smith",
                    package: "Bali Adventure Package",
                    amount: "$2,500",
                    status: "paid",
                    date: "2024-01-15",
                  },
                  {
                    id: "BK002",
                    customer: "Sarah Johnson",
                    package: "Tokyo City Explorer",
                    amount: "$1,800",
                    status: "unpaid",
                    date: "2024-01-18",
                  },
                  {
                    id: "BK003",
                    customer: "Mike Wilson",
                    package: "Paris Romance Getaway",
                    amount: "$3,200",
                    status: "paid",
                    date: "2024-01-20",
                  },
                ].map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground truncate">{booking.customer}</p>
                        <Badge
                          variant={booking.status === "paid" ? "default" : "secondary"}
                          className="ml-2 flex-shrink-0"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{booking.package}</p>
                      <p className="text-xs text-muted-foreground">{booking.date}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="font-bold text-primary">{booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent"
                onClick={() => (window.location.href = "/bookings")}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Bookings
              </Button>
            </CardContent>
          </Card>

          {/* Business Health */}
          <Card>
            <CardHeader>
              <CardTitle>Business Health</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Booking Conversion</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Payment Success Rate</span>
                  <span className="text-sm text-muted-foreground">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Package Utilization</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => (window.location.href = "/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                View Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
