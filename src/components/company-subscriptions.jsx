"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CreditCardIcon,
  PencilIcon,
  SearchIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CompanySubscriptions({ subscriptions, plans }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [planFilter, setPlanFilter] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(10)
  const [editingSubscription, setEditingSubscription] = React.useState(null)

  // Filter subscriptions based on search query, status, and plan
  const filteredSubscriptions = React.useMemo(() => {
    return subscriptions.filter((subscription) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" || subscription.companyName.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by status
      const matchesStatus = statusFilter === "all" || subscription.status === statusFilter

      // Filter by plan
      const matchesPlan = planFilter === "all" || subscription.planId === planFilter

      return matchesSearch && matchesStatus && matchesPlan
    })
  }, [subscriptions, searchQuery, statusFilter, planFilter])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)

  const handleEditSubscription = (subscription) => {
    setEditingSubscription({ ...subscription })
  }

  const handleSaveSubscription = () => {
    if (editingSubscription) {
      // In a real app, you would update the subscription in the database
      toast.success(`Subscription for ${editingSubscription.companyName} updated successfully`)
      setEditingSubscription(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Company Subscriptions</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Assign Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Plan to Company</DialogTitle>
              <DialogDescription>Select a company and a plan to assign.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company-1">Acme Corporation</SelectItem>
                    <SelectItem value="company-2">Globex Industries</SelectItem>
                    <SelectItem value="company-3">Initech Solutions</SelectItem>
                    <SelectItem value="company-4">Umbrella Corporation</SelectItem>
                    <SelectItem value="company-5">Stark Industries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans
                      .filter((plan) => plan.isActive)
                      .map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} (${plan.price}/{plan.billingCycle})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => toast.success("Plan assigned successfully")}>Assign Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.companyName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscription.planName}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subscription.status === "active"
                          ? "success"
                          : subscription.status === "past_due"
                            ? "destructive"
                            : "outline"
                      }
                      className="flex w-fit items-center gap-1"
                    >
                      {subscription.status === "active" ? (
                        <CheckCircleIcon className="h-3 w-3" />
                      ) : (
                        <AlertCircleIcon className="h-3 w-3" />
                      )}
                      {subscription.status === "active"
                        ? "Active"
                        : subscription.status === "past_due"
                          ? "Past Due"
                          : "Canceled"}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(subscription.startDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(subscription.renewalDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    ${subscription.amount}/{subscription.billingCycle}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {subscription.paymentMethod === "credit_card" ? (
                        <>
                          <CreditCardIcon className="h-4 w-4" />
                          <span>•••• {subscription.lastFour}</span>
                        </>
                      ) : (
                        "Bank Transfer"
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditSubscription(subscription)}>
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Subscription Dialog */}
      <Dialog open={editingSubscription !== null} onOpenChange={(open) => !open && setEditingSubscription(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Make changes to the subscription for {editingSubscription?.companyName}.
            </DialogDescription>
          </DialogHeader>
          {editingSubscription && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Subscription Plan</Label>
                <Select
                  defaultValue={editingSubscription.planId}
                  onValueChange={(value) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      planId: value,
                      planName: plans.find((p) => p.id === value)?.name || "",
                    })
                  }
                >
                  <SelectTrigger id="edit-plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans
                      .filter((plan) => plan.isActive)
                      .map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} (${plan.price}/{plan.billingCycle})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  defaultValue={editingSubscription.status}
                  onValueChange={(value) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start-date">Start Date</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={editingSubscription.startDate}
                    onChange={(e) =>
                      setEditingSubscription({
                        ...editingSubscription,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-renewal-date">Renewal Date</Label>
                  <Input
                    id="edit-renewal-date"
                    type="date"
                    value={editingSubscription.renewalDate}
                    onChange={(e) =>
                      setEditingSubscription({
                        ...editingSubscription,
                        renewalDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubscription(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSubscription}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
