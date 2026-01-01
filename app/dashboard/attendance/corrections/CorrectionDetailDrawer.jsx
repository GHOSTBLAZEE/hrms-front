import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ApprovalActions from "./ApprovalActions";

export default function CorrectionDetailDrawer({
  open,
  onClose,
  correction,
  canApprove,
}) {
  if (!correction) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Correction Request</SheetTitle>
        </SheetHeader>

        <div className="space-y-2 text-sm mt-4">
          <p><strong>Employee:</strong> {correction.employee.name}</p>
          <p><strong>Date:</strong> {correction.attendance_date}</p>
          <p><strong>Requested IN:</strong> {correction.requested_check_in ?? "-"}</p>
          <p><strong>Requested OUT:</strong> {correction.requested_check_out ?? "-"}</p>
          <p><strong>Reason:</strong> {correction.reason}</p>
          <p><strong>Status:</strong> {correction.status}</p>

          {correction.attendance?.is_locked && (
            <p className="text-xs text-red-600">
              Attendance locked by payroll
            </p>
          )}
        </div>

        {canApprove && (
          <ApprovalActions
            correction={correction}
            onDone={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
