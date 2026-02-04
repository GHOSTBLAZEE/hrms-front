"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, UserPlus, Building2, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TransferEmployeeDialog({ open, onOpenChange, employee, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [newDepartment, setNewDepartment] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newManager, setNewManager] = useState("");
  const [notes, setNotes] = useState("");

  const handleTransfer = async () => {
    setLoading(true);
    try {
      // Add your transfer API call here
      // await transferEmployee({ employeeId: employee.id, newDepartment, newLocation, newManager, effectiveDate, notes });
      
      console.log("Transferring employee:", {
        employeeId: employee.id,
        newDepartment,
        newLocation,
        newManager,
        effectiveDate,
        notes,
      });

      // Call onUpdate to refresh employee data
      if (onUpdate) {
        await onUpdate();
      }

      // Close dialog
      onOpenChange(false);
      
      // Reset form
      setNewDepartment("");
      setNewLocation("");
      setNewManager("");
      setNotes("");
      setEffectiveDate(new Date());
    } catch (error) {
      console.error("Error transferring employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>Transfer Employee</DialogTitle>
              <DialogDescription>
                Transfer {employee?.user?.name} to a new department or location
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Details */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-500">Current Assignment</Label>
            <div className="p-3 bg-slate-50 rounded-lg border space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-900">
                  {employee?.department?.name || "No Department"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  {employee?.location?.name || "No Location"}
                </span>
              </div>
            </div>
          </div>

          {/* New Department */}
          <div className="space-y-2">
            <Label htmlFor="department">
              New Department <span className="text-red-500">*</span>
            </Label>
            <Select value={newDepartment} onValueChange={setNewDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              New Location <span className="text-red-500">*</span>
            </Label>
            <Select value={newLocation} onValueChange={setNewLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hq-sf">HQ - San Francisco</SelectItem>
                <SelectItem value="ny-office">New York Office</SelectItem>
                <SelectItem value="austin-office">Austin Office</SelectItem>
                <SelectItem value="london-office">London Office</SelectItem>
                <SelectItem value="tokyo-office">Tokyo Office</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New Manager */}
          <div className="space-y-2">
            <Label htmlFor="manager">New Manager (Optional)</Label>
            <Select value={newManager} onValueChange={setNewManager}>
              <SelectTrigger id="manager">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager-1">John Smith</SelectItem>
                <SelectItem value="manager-2">Sarah Johnson</SelectItem>
                <SelectItem value="manager-3">Michael Chen</SelectItem>
                <SelectItem value="manager-4">Emily Rodriguez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Effective Date */}
          <div className="space-y-2">
            <Label>
              Effective Date <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !effectiveDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {effectiveDate ? (
                    format(effectiveDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={effectiveDate}
                  onSelect={setEffectiveDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this transfer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={loading || !newDepartment || !newLocation}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {loading ? "Processing..." : "Confirm Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}