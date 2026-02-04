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
import { CalendarIcon, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PromoteEmployeeDialog({ open, onOpenChange, employee, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [newDesignation, setNewDesignation] = useState("");
  const [notes, setNotes] = useState("");

  const handlePromote = async () => {
    setLoading(true);
    try {
      // Add your promotion API call here
      // await promoteEmployee({ employeeId: employee.id, newDesignation, effectiveDate, notes });
      
      console.log("Promoting employee:", {
        employeeId: employee.id,
        newDesignation,
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
      setNewDesignation("");
      setNotes("");
      setEffectiveDate(new Date());
    } catch (error) {
      console.error("Error promoting employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>Promote Employee</DialogTitle>
              <DialogDescription>
                Promote {employee?.user?.name} to a new designation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Designation */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-500">Current Designation</Label>
            <div className="p-3 bg-slate-50 rounded-lg border">
              <p className="font-medium text-slate-900">
                {employee?.designation?.name || "No Designation"}
              </p>
              <p className="text-sm text-slate-500">
                {employee?.department?.name || "No Department"}
              </p>
            </div>
          </div>

          {/* New Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation">
              New Designation <span className="text-red-500">*</span>
            </Label>
            <Select value={newDesignation} onValueChange={setNewDesignation}>
              <SelectTrigger id="designation">
                <SelectValue placeholder="Select new designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="senior-developer">Senior Developer</SelectItem>
                <SelectItem value="lead-developer">Lead Developer</SelectItem>
                <SelectItem value="tech-lead">Tech Lead</SelectItem>
                <SelectItem value="engineering-manager">Engineering Manager</SelectItem>
                <SelectItem value="senior-manager">Senior Manager</SelectItem>
                <SelectItem value="director">Director</SelectItem>
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
              placeholder="Add any notes about this promotion..."
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
            onClick={handlePromote}
            disabled={loading || !newDesignation}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {loading ? "Processing..." : "Confirm Promotion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}