"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import ApprovalsHeader from "./components/ApprovalsHeader";
import ApprovalTabs from "./components/ApprovalTabs";
import ApprovalFilters from "./components/ApprovalFilters";
import { DataTable } from "@/components/data-table/DataTable";
import { approvalColumns } from "./columns";
import EmptyApprovals from "./components/EmptyApprovals";
import BulkApprovalBar from "./components/BulkApprovalBar";
import RejectApprovalDialog from "./components/RejectApprovalDialog";

import { useApprovals } from "./hooks/useApprovals";
import { useApprovalActions } from "./hooks/useApprovalActions";

export default function ApprovalsPage({
  defaultType,
  hideTabs = false,
}) {
  const { permissions = [] } = useAuth();

  const [status, setStatus] = useState("pending");
  const [selected, setSelected] = useState([]);
  const [openBulkReject, setOpenBulkReject] = useState(false);

  /* --------------------------------
   | Permission guard
   |---------------------------------*/
  const canApprove =
    permissions.includes("approve leave") ||
    permissions.includes("approve attendance correction") ||
    permissions.includes("approve unlock attendance");

  if (!canApprove) {
    return (
      <div className="p-6">
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          You don’t have permission to view approvals.
        </div>
      </div>
    );
  }

  /* --------------------------------
   | Data
   |---------------------------------*/
  const { data = [], isLoading } = useApprovals({ status });

  const pendingQ = useApprovals({ status: "pending" });
  const approvedQ = useApprovals({ status: "approved" });
  const rejectedQ = useApprovals({ status: "rejected" });

  const counts = {
    pending: pendingQ.data?.length ?? 0,
    approved: approvedQ.data?.length ?? 0,
    rejected: rejectedQ.data?.length ?? 0,
  };

  /* --------------------------------
   | Actions
   |---------------------------------*/
  const { approve, reject } = useApprovalActions();

  const isActionLoading =
    approve.isLoading || reject.isLoading;

  const selectedApprovalIds = selected;

  const bulkApprove = async () => {
    for (const approvalId of selectedApprovalIds) {
      await approve.mutateAsync({ approvalId });
    }
    setSelected([]);
  };

  const bulkRejectConfirm = async (reason) => {
    for (const approvalId of selectedApprovalIds) {
      await reject.mutateAsync({
        approvalId,
        reason,
      });
    }
    setSelected([]);
    setOpenBulkReject(false);
  };

  return (
    <div className="p-6 space-y-6">
      <ApprovalsHeader />

      <div className="flex items-center justify-between">
        {!hideTabs && (
          <ApprovalTabs
            value={status}
            onChange={setStatus}
            counts={counts}
          />
        )}

        {/* 🔒 Module filter removed — unified inbox */}
        {!defaultType && (
          <ApprovalFilters
            value="all"
            onChange={() => {}}
            disabled
          />
        )}
      </div>

      {/* 🔥 Bulk action bar */}
      {status === "pending" && (
        <BulkApprovalBar
          count={selectedApprovalIds.length}
          disabled={isActionLoading}
          isApproving={approve.isLoading}
          isRejecting={reject.isLoading}
          onApprove={bulkApprove}
          onReject={() => setOpenBulkReject(true)}
        />
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading approvals…
        </div>
      ) : data.length === 0 ? (
        <EmptyApprovals />
      ) : (
        <DataTable
          columns={approvalColumns}
          data={data}
          selectable
          selected={selected}
          onSelect={setSelected}
          globalFilterKeys={["status"]}
        />
      )}

      {/* 🔥 Bulk reject dialog */}
      <RejectApprovalDialog
        open={openBulkReject}
        onClose={() => setOpenBulkReject(false)}
        isLoading={reject.isLoading}
        onConfirm={bulkRejectConfirm}
      />
    </div>
  );
}
