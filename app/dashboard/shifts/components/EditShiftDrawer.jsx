"use client"

import { useState, useEffect } from "react"
import { Clock, Info, Trash2, Building2, Timer, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useUpdateShift, useDeleteShift } from "../hooks/use-shifts"

export default function EditShiftDrawer({ open, onOpenChange, shift }) {
  const updateShift = useUpdateShift()
  const deleteShift = useDeleteShift()
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    start_time: "09:00",
    end_time: "17:00",
    break_duration: 60,
    grace_period: 15,
    half_day_hours: 4,
    full_day_hours: 8,
    is_active: true,
  })

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name || "",
        code: shift.code || "",
        description: shift.description || "",
        start_time: shift.start_time?.substring(0, 5) || "09:00",
        end_time: shift.end_time?.substring(0, 5) || "17:00",
        break_duration: shift.break_duration || 60,
        grace_period: shift.grace_period || 15,
        half_day_hours: shift.half_day_hours || 4,
        full_day_hours: shift.full_day_hours || 8,
        is_active: shift.is_active ?? true,
      })
    }
  }, [shift])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updateShift.mutateAsync({ 
        id: shift.id, 
        data: formData 
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating shift:", error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteShift.mutateAsync(shift.id)
      
      setDeleteDialogOpen(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting shift:", error)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!shift) return null

  const isLoading = updateShift.isPending || deleteShift.isPending
  const hasEmployees = shift.employees_count > 0

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-2xl">Edit Shift</SheetTitle>
                  {hasEmployees && (
                    <Badge variant="secondary" className="font-normal">
                      {shift.employees_count} assigned
                    </Badge>
                  )}
                </div>
                <SheetDescription className="text-base mt-1">
                  Update shift configuration and settings
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-8 pb-6">
            {/* Warning Alert */}
            {hasEmployees && (
              <Alert className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/30">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-sm text-amber-900 dark:text-amber-300 ml-2">
                  <strong>{shift.employees_count} employee{shift.employees_count > 1 ? 's are' : ' is'}</strong> currently assigned to this shift. 
                  Any changes may impact their work schedules and attendance tracking.
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-base">Basic Information</h3>
              </div>
              <Separator />

              <div className="space-y-5 pl-7">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    Shift Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Morning Shift, Day Shift, Night Shift"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-11 text-base"
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Shift Code
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g., MRN-SHIFT"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                    className="h-11 font-mono text-base"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details about this shift..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="resize-none text-base"
                  />
                </div>
              </div>
            </div>

            {/* Shift Timing Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-base">Shift Timing</h3>
              </div>
              <Separator />

              <div className="space-y-5 pl-7">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="start_time" className="text-sm font-medium flex items-center gap-2">
                      Start Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleChange("start_time", e.target.value)}
                      className="h-11 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="end_time" className="text-sm font-medium flex items-center gap-2">
                      End Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleChange("end_time", e.target.value)}
                      className="h-11 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="break_duration" className="text-sm font-medium">
                      Break Duration
                    </Label>
                    <div className="relative">
                      <Input
                        id="break_duration"
                        type="number"
                        min="0"
                        max="480"
                        value={formData.break_duration}
                        onChange={(e) => handleChange("break_duration", parseInt(e.target.value) || 0)}
                        className="h-11 pr-16 text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        minutes
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="grace_period" className="text-sm font-medium">
                      Grace Period
                    </Label>
                    <div className="relative">
                      <Input
                        id="grace_period"
                        type="number"
                        min="0"
                        max="60"
                        value={formData.grace_period}
                        onChange={(e) => handleChange("grace_period", parseInt(e.target.value) || 0)}
                        className="h-11 pr-16 text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        minutes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-base">Working Hours Configuration</h3>
              </div>
              <Separator />

              <div className="space-y-5 pl-7">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="half_day_hours" className="text-sm font-medium">
                      Half Day Hours
                    </Label>
                    <div className="relative">
                      <Input
                        id="half_day_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="12"
                        value={formData.half_day_hours}
                        onChange={(e) => handleChange("half_day_hours", parseFloat(e.target.value) || 0)}
                        className="h-11 pr-14 text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        hours
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="full_day_hours" className="text-sm font-medium">
                      Full Day Hours
                    </Label>
                    <div className="relative">
                      <Input
                        id="full_day_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={formData.full_day_hours}
                        onChange={(e) => handleChange("full_day_hours", parseFloat(e.target.value) || 0)}
                        className="h-11 pr-14 text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-6">
              <Separator />
              <div className="flex items-center justify-between p-5 rounded-xl border-2 border-dashed bg-gradient-to-r from-muted/50 to-transparent hover:border-solid hover:border-primary/30 transition-all">
                <div className="space-y-1">
                  <Label htmlFor="is_active" className="text-base font-semibold cursor-pointer">
                    Shift Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.is_active ? "Active and available for assignments" : "Inactive and hidden from assignments"}
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-teal-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t sticky bottom-0 bg-background pb-6">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-11"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 font-semibold"
                  disabled={isLoading}
                >
                  {updateShift.isPending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-full h-11 font-semibold"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Shift Permanently
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Shift</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base leading-relaxed">
              {hasEmployees ? (
                <div className="space-y-3">
                  <p>
                    This shift cannot be deleted because <strong className="text-foreground">{shift.employees_count} employee{shift.employees_count > 1 ? 's are' : ' is'}</strong> currently assigned to it.
                  </p>
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-sm text-amber-900 dark:text-amber-300">
                      Please reassign all employees to other shifts before deleting.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <p>
                  Are you sure you want to delete <strong className="text-foreground">"{shift.name}"</strong>? 
                  This action cannot be undone and will permanently remove this shift template.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel disabled={isLoading} className="h-10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={hasEmployees || isLoading}
              className="bg-red-600 hover:bg-red-700 h-10"
            >
              {deleteShift.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}