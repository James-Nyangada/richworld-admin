"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Star, MessageSquare, Calendar, MapPin, Trash2 } from "lucide-react"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const API = process.env.NEXT_PUBLIC_API_URL;

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

// ✅ Update testimonial status
const updateTestimonialStatus = async (testimonialId, newStatus) => {
  try {
    await axios.patch(`${API}/api/testimonials/${testimonialId}/status`, { status: newStatus })
    setTestimonials((prev) =>
      prev.map((t) => (t._id === testimonialId ? { ...t, status: newStatus } : t)),
    )
  } catch (error) {
    console.error("❌ Error updating status:", error)
  }
}


  // ✅ Delete testimonial
  const deleteTestimonial = async (testimonialId) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await axios.delete(`${API}/api/testimonials/${testimonialId}`)
      setTestimonials((prev) => prev.filter((t) => t._id !== testimonialId))
    } catch (error) {
      console.error("❌ Error deleting testimonial:", error)
    }
  }

  // ✅ Filtering
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial._id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || testimonial.status === statusFilter
    const matchesRating = ratingFilter === "all" || testimonial.rating.toString() === ratingFilter

    return matchesSearch && matchesStatus && matchesRating
  })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "default"
      case "inactive":
        return "secondary"
      case "pending":
        return "warning"
      case "approved":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
      
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Testimonials Management</h1>
          <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Reviews</p>
                  <p className="text-2xl font-bold text-primary">{testimonials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {testimonials.filter((t) => t.status === "published").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {testimonials.length > 0
                      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-600 fill-current" />
                <div>
                  <p className="text-sm font-medium">5-Star Reviews</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {testimonials.filter((t) => t.rating === 5).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials List */}
        <Card>
          <CardHeader>
            <CardTitle>All Testimonials</CardTitle>
            <CardDescription>View and manage customer testimonials</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, package, or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Star className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <Card key={testimonial._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.images?.[0] || "/placeholder.svg"} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.email}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(testimonial.status)}>{testimonial.status}</Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                        <span className="text-sm text-muted-foreground">({testimonial.rating}/5)</span>
                      </div>
                      <h3 className="font-semibold text-lg">{testimonial.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{testimonial.comment}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <Select
                        value={testimonial.status}
                        onValueChange={(value) => updateTestimonialStatus(testimonial._id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>

                        </SelectContent>
                      </Select>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => deleteTestimonial(testimonial._id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Testimonial Preview</DialogTitle>
                              <DialogDescription>How this testimonial will appear on the website</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-lg font-semibold">{testimonial.title}</p>
                              <p className="text-sm">{testimonial.comment}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTestimonials.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No testimonials found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
