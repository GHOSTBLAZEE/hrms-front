"use client";

import ApprovalsPage from "../../approvals/ApprovalsPage";



export default function AttendanceApprovalsPage() {
  return (
    <ApprovalsPage
      defaultType="attendance_correction"
      hideTabs
    />
  );
}
