"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EditProfileForm from "./EditProfileForm";

export default function EditProfileDrawer({
  open,
  onClose,
  employee,
}) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>

        <EditProfileForm
          employee={employee}
          onSuccess={onClose}
        />
      </SheetContent>
    </Sheet>
  );
}
