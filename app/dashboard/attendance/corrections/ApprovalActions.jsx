"use client";

import { Button } from "@/components/ui/button";

export default function ApprovalActions({ correction }) {
  const handleApprove = () => {
    // POST /attendance-corrections/{id}/approve
  };

  const handleReject = () => {
    // POST /attendance-corrections/{id}/reject
  };

  return (
    <div className="flex gap-2 mt-6">
      <Button onClick={handleApprove}>
        Approve
      </Button>
      <Button variant="destructive" onClick={handleReject}>
        Reject
      </Button>
    </div>
  );
}
