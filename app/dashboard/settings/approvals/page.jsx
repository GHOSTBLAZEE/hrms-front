// dashboard/settings/approvals/page.jsx
"use client";

import Link from "next/link";

export default function ApprovalsSettingsIndex() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Approval Settings</h1>

      <div className="space-y-2">
        <Link href="/dashboard/settings/approvals/reminders">
          → Reminder Settings
        </Link>

        <Link href="/dashboard/settings/approvals/templates">
          → Approval Templates
        </Link>
      </div>
    </div>
  );
}
