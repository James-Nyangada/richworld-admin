"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, MapPin, DollarSign, Calendar, Hotel, FileText, Save, Upload, ImageIcon } from "lucide-react"

export default function AddPackagePage() {
const [packageData, setPackageData] = useState({
    name: "",
    location: "",
    duration: "",
    price: "",
    inclusions: [],
    exclusions: [],
    itinerary: "",
    specialNotes: "",
  })

  const [hotels, setHotels] = useState([{ name: "", price: "" }])
  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [packageImages, setPackageImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // ====== HOTELS ======
  const addHotel = () => setHotels([...hotels, { name: "", price: "" }])
  const removeHotel = (index) => setHotels(hotels.filter((_, i) => i !== index))
  const updateHotel = (index, field, value) => {
    setHotels(hotels.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  // ====== INCLUSIONS ======
  const addInclusion = () => {
    if (newInclusion.trim()) {
      setPackageData({ ...packageData, inclusions: [...packageData.inclusions, newInclusion.trim()] })
      setNewInclusion("")
    }
  }
  const removeInclusion = (index) =>
    setPackageData({ ...packageData, inclusions: packageData.inclusions.filter((_, i) => i !== index) })

  // ====== EXCLUSIONS ======
  const addExclusion = () => {
    if (newExclusion.trim()) {
      setPackageData({ ...packageData, exclusions: [...packageData.exclusions, newExclusion.trim()] })
      setNewExclusion("")
    }
  }
  const removeExclusion = (index) =>
    setPackageData({ ...packageData, exclusions: packageData.exclusions.filter((_, i) => i !== index) })

  // ====== IMAGES ======
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            preview: ev.target?.result,
            name: file.name,
          }
          setPackageImages((prev) => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
    e.target.value = ""
  }
  const removeImage = (id) => setPackageImages((prev) => prev.filter((img) => img.id !== id))
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            preview: ev.target?.result,
            name: file.name,
          }
          setPackageImages((prev) => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // ====== SUBMIT FORM ======
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append("name", packageData.name.trim())
      formData.append("location", packageData.location.trim())
      formData.append("duration", packageData.duration)
      formData.append("price", String(packageData.price))
      formData.append("itinerary", packageData.itinerary)
      formData.append("specialNotes", packageData.specialNotes)
      formData.append("inclusions", JSON.stringify(packageData.inclusions))
      formData.append("exclusions", JSON.stringify(packageData.exclusions))
      formData.append("hotels", JSON.stringify(hotels))

      packageImages.forEach((img) => formData.append("images", img.file))

      const res = await fetch("https://richworld-server.onrender.com/api/packages", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed to add package")
      }

      const data = await res.json()
      setSuccess("✅ Package added successfully!")
      setPackageData({
        name: "",
        location: "",
        duration: "",
        price: "",
        inclusions: [],
        exclusions: [],
        itinerary: "",
        specialNotes: "",
      })
      setHotels([{ name: "", price: "" }])
      setPackageImages([])
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Add New Package</h1>
          <p className="text-muted-foreground">Create a new travel package for your customers</p>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the basic details of your travel package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name *</Label>
                  <Input
                    id="packageName"
                    placeholder="Enter package name"
                    value={packageData.name}
                    onChange={(e) => setPackageData({ ...packageData, name: e.target.value })}
                    className="border-2 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter destination"
                      value={packageData.location}
                      onChange={(e) => setPackageData({ ...packageData, location: e.target.value })}
                      className="pl-10 border-2 focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={packageData.duration}
                    onValueChange={(value) => setPackageData({ ...packageData, duration: value })}
                  >
                    <SelectTrigger className="border-2 focus:border-primary">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 Day</SelectItem>
                      <SelectItem value="2-days">2 Days</SelectItem>
                      <SelectItem value="3-days">3 Days</SelectItem>
                      <SelectItem value="4-days">4 Days</SelectItem>
                      <SelectItem value="5-days">5 Days</SelectItem>
                      <SelectItem value="6-days">6 Days</SelectItem>
                      <SelectItem value="7-days">7 Days</SelectItem>
                      <SelectItem value="10-days">10 Days</SelectItem>
                      <SelectItem value="14-days">14 Days</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={packageData.price}
                      onChange={(e) => setPackageData({ ...packageData, price: e.target.value })}
                      className="pl-10 border-2 focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Package Images
              </CardTitle>
              <CardDescription>Upload multiple images to showcase your package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop images here or click to upload</p>
                    <p className="text-sm text-muted-foreground">Support for JPG, PNG, GIF up to 10MB each</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload").click()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Choose Images
                  </Button>
                </div>
              </div>

              {/* Image Previews */}
              {packageImages.length > 0 && (
                <div className="space-y-4">
                  <Label>Uploaded Images ({packageImages.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {packageImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inclusions */}
          <Card>
            <CardHeader>
              <CardTitle>Package Inclusions</CardTitle>
              <CardDescription>What's included in this package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add inclusion"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                  className="border-2 focus:border-primary"
                />
                <Button type="button" onClick={addInclusion} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {packageData.inclusions.map((inclusion, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {inclusion}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeInclusion(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exclusions */}
          <Card>
            <CardHeader>
              <CardTitle>Package Exclusions</CardTitle>
              <CardDescription>What's not included in this package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add exclusion"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())}
                  className="border-2 focus:border-primary"
                />
                <Button type="button" onClick={addExclusion} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {packageData.exclusions.map((exclusion, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {exclusion}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeExclusion(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hotels and Lounges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hotel className="h-5 w-5 mr-2" />
                Hotels and Lounges
              </CardTitle>
              <CardDescription>Add accommodation options for this package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hotels.map((hotel, index) => (
                <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`hotel-name-${index}`}>Hotel Name</Label>
                    <Input
                      id={`hotel-name-${index}`}
                      placeholder="Enter hotel name"
                      value={hotel.name}
                      onChange={(e) => updateHotel(index, "name", e.target.value)}
                      className="border-2 focus:border-primary"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor={`hotel-price-${index}`}>Price per night</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`hotel-price-${index}`}
                        type="number"
                        placeholder="Price"
                        value={hotel.price}
                        onChange={(e) => updateHotel(index, "price", e.target.value)}
                        className="pl-10 border-2 focus:border-primary"
                      />
                    </div>
                  </div>
                  {hotels.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHotel(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addHotel} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Hotel
              </Button>
            </CardContent>
          </Card>

          {/* Detailed Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Day-wise Itinerary</CardTitle>
              <CardDescription>Provide a comprehensive day-by-day breakdown of the package</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="itinerary">Itinerary Details</Label>
                <Textarea
                  id="itinerary"
                  placeholder="Enter detailed day-wise itinerary..."
                  value={packageData.itinerary}
                  onChange={(e) => setPackageData({ ...packageData, itinerary: e.target.value })}
                  className="min-h-[300px] resize-y border-2 focus:border-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Provide detailed information for each day including activities, meals, and accommodations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Special Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Special Notes</CardTitle>
              <CardDescription>Additional information, terms, and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="specialNotes">Special Notes</Label>
                <Textarea
                  id="specialNotes"
                  placeholder="Enter special notes and terms..."
                  value={packageData.specialNotes}
                  onChange={(e) => setPackageData({ ...packageData, specialNotes: e.target.value })}
                  className="min-h-[120px] resize-y border-2 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={loading}>
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {loading ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Add Package</>}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
