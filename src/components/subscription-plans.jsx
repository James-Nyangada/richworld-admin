"use client"

import * as React from "react"
import { CheckIcon, EditIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function SubscriptionPlans({ plans, onUpdatePlans }) {
  const [activePlans, setActivePlans] = React.useState(plans.filter((plan) => plan.isActive))
  const [inactivePlans, setInactivePlans] = React.useState(plans.filter((plan) => !plan.isActive))
  const [editingPlan, setEditingPlan] = React.useState(null)
  const [isAddingPlan, setIsAddingPlan] = React.useState(false)

  const handleEditPlan = (plan) => {
    setEditingPlan({ ...plan })
  }

  const handleSavePlan = () => {
    if (editingPlan) {
      const updatedPlans = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p))

      // Update active and inactive plan lists
      setActivePlans(updatedPlans.filter((plan) => plan.isActive))
      setInactivePlans(updatedPlans.filter((plan) => !plan.isActive))

      // Call parent update function if provided
      if (onUpdatePlans) {
        onUpdatePlans(updatedPlans)
      }

      toast.success(`Plan "${editingPlan.name}" updated successfully`)
      setEditingPlan(null)
    }
  }

  const handleAddPlan = () => {
    const newPlan = {
      id: `plan-${plans.length + 1}`,
      name: "New Plan",
      description: "Description for the new plan",
      price: 0,
      billingCycle: "monthly",
      features: ["Feature 1", "Feature 2"],
      isActive: true,
      isPopular: false,
    }

    setEditingPlan(newPlan)
    setIsAddingPlan(true)
  }

  const handleSaveNewPlan = () => {
    const updatedPlans = [...plans, editingPlan]

    // Update active and inactive plan lists
    setActivePlans(updatedPlans.filter((plan) => plan.isActive))
    setInactivePlans(updatedPlans.filter((plan) => !plan.isActive))

    // Call parent update function if provided
    if (onUpdatePlans) {
      onUpdatePlans(updatedPlans)
    }

    toast.success(`Plan "${editingPlan.name}" added successfully`)
    setEditingPlan(null)
    setIsAddingPlan(false)
  }

  const handleTogglePlanStatus = (planId) => {
    const updatedPlans = plans.map((plan) => {
      if (plan.id === planId) {
        return { ...plan, isActive: !plan.isActive }
      }
      return plan
    })

    // Update active and inactive plan lists
    setActivePlans(updatedPlans.filter((plan) => plan.isActive))
    setInactivePlans(updatedPlans.filter((plan) => !plan.isActive))

    // Call parent update function if provided
    if (onUpdatePlans) {
      onUpdatePlans(updatedPlans)
    }

    const plan = plans.find((p) => p.id === planId)
    const action = plan.isActive ? "deactivated" : "activated"
    toast.success(`Plan "${plan.name}" ${action} successfully`)
  }

  const handleDeletePlan = (planId) => {
    const updatedPlans = plans.filter((plan) => plan.id !== planId)

    // Update active and inactive plan lists
    setActivePlans(updatedPlans.filter((plan) => plan.isActive))
    setInactivePlans(updatedPlans.filter((plan) => !plan.isActive))

    // Call parent update function if provided
    if (onUpdatePlans) {
      onUpdatePlans(updatedPlans)
    }

    const plan = plans.find((p) => p.id === planId)
    toast.success(`Plan "${plan.name}" deleted successfully`)
  }

  const handleAddFeature = () => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, "New feature"],
      })
    }
  }

  const handleUpdateFeature = (index, value) => {
    if (editingPlan) {
      const updatedFeatures = [...editingPlan.features]
      updatedFeatures[index] = value
      setEditingPlan({
        ...editingPlan,
        features: updatedFeatures,
      })
    }
  }

  const handleRemoveFeature = (index) => {
    if (editingPlan) {
      const updatedFeatures = [...editingPlan.features]
      updatedFeatures.splice(index, 1)
      setEditingPlan({
        ...editingPlan,
        features: updatedFeatures,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <Button onClick={handleAddPlan}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          {activePlans.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No active plans found</p>
              <Button variant="outline" className="mt-4" onClick={handleAddPlan}>
                Add Plan
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onToggleStatus={handleTogglePlanStatus}
                  onDelete={handleDeletePlan}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          {inactivePlans.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No inactive plans found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inactivePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onToggleStatus={handleTogglePlanStatus}
                  onDelete={handleDeletePlan}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Plan Dialog */}
      <Dialog open={editingPlan !== null} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isAddingPlan ? "Add New Plan" : "Edit Plan"}</DialogTitle>
            <DialogDescription>
              {isAddingPlan
                ? "Create a new subscription plan for your customers."
                : "Make changes to the subscription plan here."}
            </DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="price"
                      type="number"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={editingPlan.isActive}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, isActive: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={editingPlan.isPopular}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, isPopular: checked })}
                  />
                  <Label htmlFor="popular">Mark as Popular</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button variant="outline" size="sm" onClick={handleAddFeature}>
                    <PlusIcon className="mr-2 h-3 w-3" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleUpdateFeature(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeature(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button onClick={isAddingPlan ? handleSaveNewPlan : handleSavePlan}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PlanCard({ plan, onEdit, onToggleStatus, onDelete }) {
  return (
    <Card className="relative overflow-hidden">
      {plan.isPopular && (
        <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Popular
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(plan)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(plan.id)}>
                {plan.isActive ? (
                  <>
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(plan.id)}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="ml-1 text-muted-foreground">/{plan.billingCycle}</span>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={() => onEdit(plan)}>
          Edit Plan
        </Button>
      </CardFooter>
    </Card>
  )
}
