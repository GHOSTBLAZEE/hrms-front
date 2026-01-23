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
  const [type, setType] = useState(defaultType ?? "all");
  const [selected, setSelected] = useState([]);
  const [openBulkReject, setOpenBulkReject] = useState(false);

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

  /* -------------------------------
   | Data
   |--------------------------------*/
  const { data = [] ,isLoading} = useApprovals({ status: "all", type });

  const pending = useApprovals({ status: "pending", type: "all" });
const approved = useApprovals({ status: "approved", type: "all" });
const rejected = useApprovals({ status: "rejected", type: "all" });


  const counts = {
  pending: data.filter(d => d.status === "pending").length,
  approved: data.filter(d => d.status === "approved").length,
  rejected: data.filter(d => d.status === "rejected").length,
};
  /* -------------------------------
   | Actions
   |--------------------------------*/
  const { approve, reject } = useApprovalActions();

  const isActionLoading =
    approve.isLoading || reject.isLoading;

  const bulkApprove = async () => {
      for (const item of data) {
        if (
          selected.includes(item.id) &&
          item.status === "pending"
        ) {
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
      if (
        selected.includes(item.id) &&
        item.status === "pending"
      ) {
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
        {!hideTabs && (
          <ApprovalTabs
            value={status}
            onChange={setStatus}
            counts={counts}
          />
        )}

        {!defaultType && (
          <ApprovalFilters
            value={type}
            onChange={setType}
          />
        )}

      </div>

      {/* 🔥 Bulk action bar */}
      {status === "pending" && (
        <BulkApprovalBar
          count={selected.length}
          onApprove={bulkApprove}
          onReject={() => setOpenBulkReject(true)}
          disabled={isActionLoading}
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
