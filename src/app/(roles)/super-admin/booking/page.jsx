"use client"

import { useState, useEffect } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Calendar, MapPin, User, Phone, Mail, CreditCard } from "lucide-react"

import axios from "axios"

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState(null)

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/bookings")
      setBookings(res.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }
  fetchBookings()
}, [])


const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const res = await axios.put(
      `http://localhost:4000/api/bookings/${bookingId}/status`,
      { status: newStatus }
    )
    setBookings(bookings.map(b => (b._id === bookingId ? res.data : b)))
  } catch (error) {
    console.error("Error updating booking status:", error)
  }
}



  const filteredBookings = bookings.filter((booking) => {
  const customerName = booking.customerName || ""
  const packageName = booking.packageName || ""
  const bookingId = booking._id || ""

  const matchesSearch =
    customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookingId.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus = statusFilter === "all" || booking.status === statusFilter
  return matchesSearch && matchesStatus
})


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground">Manage and track all customer bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-primary">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Paid Bookings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "paid").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Unpaid Bookings</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {bookings.filter((b) => b.status === "unpaid").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">
                    ${bookings.reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>View and manage customer bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer name, package, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bookings Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Travel Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{booking._id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.packageName}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.destination}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.travelDate}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${booking.totalAmount}</p>
                          <p className="text-sm text-muted-foreground">Paid: ${booking.paidAmount}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Badge variant={booking.status === "paid" ? "default" : "secondary"}>{booking.status}</Badge>
                          <Select
                            value={booking.status}
                            onValueChange={(value) => updateBookingStatus(booking._id, value)}
                          >
                            <SelectTrigger className="w-20 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="unpaid">Unpaid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View More
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Booking Details - {booking._id}</DialogTitle>
                              <DialogDescription>Complete information for this booking</DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Customer Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Customer Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p className="font-medium">{booking.customerName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2" />
                                      {booking.email}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <p className="flex items-center">
                                      <Phone className="h-4 w-4 mr-2" />
                                      {booking.phone}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Booking Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Booking Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Package</p>
                                    <p className="font-medium">{booking.packageName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Destination</p>
                                    <p className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {booking.destination}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                    <p>{booking.duration}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Guests</p>
                                    <p>{booking.guests} person(s)</p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Payment Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="font-bold text-lg">${booking.totalAmount}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                                    <p className="font-medium text-green-600">${booking.paidAmount}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                                    <p>{booking.paymentMethod}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant={booking.status === "paid" ? "default" : "secondary"}>
                                      {booking.status}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Travel Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg">Travel Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Booking Date</p>
                                    <p>{booking.bookingDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Travel Date</p>
                                    <p className="font-medium">{booking.travelDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Special Requests</p>
                                    <p className="text-sm">{booking.specialRequests}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
