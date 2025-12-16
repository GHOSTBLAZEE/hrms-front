"use client";

import { Button } from "@/components/ui/button";
import { useLeaves } from "@/hooks/useLeaves";

export default function PendingApprovals({ leaves }) {
  const { approve } = useLeaves();

  if (!leaves.length) return null;

  return (
    <div className="border rounded p-4 space-y-3">
      <h2 className="font-semibold">Pending Leave Approvals</h2>

      {leaves.map((l) => (
        <div key={l.id} className="flex justify-between">
          <span>{l.employee.user.name}</span>
          <Button size="sm" onClick={() => approve.mutate(l.id)}>
            Approve
          </Button>
        </div>
      ))}
    </div>
  );
}
