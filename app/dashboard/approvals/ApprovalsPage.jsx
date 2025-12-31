"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import ApprovalsHeader from "./components/ApprovalsHeader";
import ApprovalTabs from "./components/ApprovalTabs";
import ApprovalFilters from "./components/ApprovalFilters";
import ApprovalTable from "./components/ApprovalTable";
import BulkApprovalBar from "./components/BulkApprovalBar";
import RejectApprovalDialog from "./components/RejectApprovalDialog";

import { useApprovals } from "./hooks/useApprovals";
import { useApprovalActions } from "./hooks/useApprovalActions";

export default function ApprovalsPage() {
  const { permissions = [] } = useAuth();

  const [status, setStatus] = useState("pending");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState([]);
  const [openBulkReject, setOpenBulkReject] = useState(false);

  const canApprove =
    permissions.includes("approve leave") ||
    permissions.includes("approve attendance correction");

  if (!canApprove) {
    return (
      <div className="p-6">
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          You don’t have permission to view approvals.
        </div>
      </div>
    );
  }

  /* -------------------------------
   | Data
   |--------------------------------*/
  const { data = [], isLoading } = useApprovals({
    status,
    type,
  });

  const pending = useApprovals({ status: "pending", type });
  const approved = useApprovals({ status: "approved", type });
  const rejected = useApprovals({ status: "rejected", type });

  const counts = {
    pending: pending.data?.length ?? 0,
    approved: approved.data?.length ?? 0,
    rejected: rejected.data?.length ?? 0,
  };

  /* -------------------------------
   | Actions
   |--------------------------------*/
  const { approve, reject } = useApprovalActions();

  const isActionLoading =
    approve.isLoading || reject.isLoading;

  const bulkApprove = async () => {
    for (const item of data) {
      if (selected.includes(item.id)) {
        await approve.mutateAsync({
          type: item.type,
          id: item.id,
        });
      }
    }
    setSelected([]);
  };

  const bulkRejectConfirm = async (reason) => {
    for (const item of data) {
      if (selected.includes(item.id)) {
        await reject.mutateAsync({
          type: item.type,
          id: item.id,
          reason,
        });
      }
    }
    setSelected([]);
    setOpenBulkReject(false);
  };

  return (
    <div className="p-6 space-y-6">
      <ApprovalsHeader />

      <div className="flex items-center justify-between">
        <ApprovalTabs
          value={status}
          onChange={setStatus}
          counts={counts}
        />

        <ApprovalFilters
          value={type}
          onChange={setType}
        />
      </div>

      {/* 🔥 Bulk action bar */}
      <BulkApprovalBar
        count={selected.length}
        onApprove={bulkApprove}
        onReject={() => setOpenBulkReject(true)}
        disabled={isActionLoading}
      />

      <ApprovalTable
        data={data}
        isLoading={isLoading}
        selected={selected}
        onSelect={setSelected}
      />

      {/* 🔥 Bulk reject modal */}
      <RejectApprovalDialog
        open={openBulkReject}
        onClose={() => setOpenBulkReject(false)}
        isLoading={reject.isLoading}
        onConfirm={bulkRejectConfirm}
      />
    </div>
  );
}
