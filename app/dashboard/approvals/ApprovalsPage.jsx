"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import ApprovalsHeader from "./components/ApprovalsHeader";
import ApprovalTabs from "./components/ApprovalTabs";
import { DataTable } from "@/components/data-table/DataTable";
import { approvalColumns } from "./columns";
import EmptyApprovals from "./components/EmptyApprovals";
import BulkApprovalBar from "./components/BulkApprovalBar";
import RejectApprovalDialog from "./components/RejectApprovalDialog";
import ApprovalDrawer from "./components/ApprovalDrawer";

import { useApprovals } from "./hooks/useApprovals";
import { useApprovalActions } from "./hooks/useApprovalActions";
import { useApprovalDetails } from "./hooks/useApprovalDetails";
import { toastInfo, toastSuccess, toastError } from "@/lib/toast";

export default function ApprovalsPage({
  defaultType,
  hideTabs = false,
}) {
  const { permissions = [] } = useAuth();

  /* --------------------------------
   | Permission guard
   |---------------------------------*/
  const canApprove = useMemo(
    () =>
      permissions.includes("approve leave") ||
      permissions.includes("approve attendance correction") ||
      permissions.includes("approve unlock attendance"),
    [permissions]
  );

  if (!canApprove) {
    return (
      <div className="p-6">
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          You don't have permission to view approvals.
        </div>
      </div>
    );
  }

  /* --------------------------------
   | Local state
   |---------------------------------*/
  const [status, setStatus] = useState("pending");
  const [rowSelection, setRowSelection] = useState({});
  const [openBulkReject, setOpenBulkReject] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeApprovalId, setActiveApprovalId] = useState(null);

  /* --------------------------------
   | Queries
   |---------------------------------*/
  const approvalsQ = useApprovals({ status });
  const pendingQ = useApprovals({ status: "pending" });
  const approvedQ = useApprovals({ status: "approved" });
  const rejectedQ = useApprovals({ status: "rejected" });

  const approvals = approvalsQ.data ?? [];
  const isLoading = approvalsQ.isLoading;

  const counts = useMemo(
    () => ({
      pending: pendingQ.data?.length ?? 0,
      approved: approvedQ.data?.length ?? 0,
      rejected: rejectedQ.data?.length ?? 0,
    }),
    [pendingQ.data, approvedQ.data, rejectedQ.data]
  );

  const approvalDetailsQ = useApprovalDetails(
    activeApprovalId,
    drawerOpen
  );

  /* --------------------------------
   | Selected items
   |---------------------------------*/
  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(index => approvals[parseInt(index)]?.id)
      .filter(Boolean);
  }, [rowSelection, approvals]);

  /* --------------------------------
   | Mutations
   |---------------------------------*/
  const { approve, reject } = useApprovalActions();
  
  // Support both React Query v4 (isLoading) and v5 (isPending)
  const isBusy = (approve.isPending ?? approve.isLoading) || 
                 (reject.isPending ?? reject.isLoading);

  /* --------------------------------
   | Effects
   |---------------------------------*/
  useEffect(() => {
    setRowSelection({});
    setDrawerOpen(false);
    setActiveApprovalId(null);
  }, [status]);

  /* --------------------------------
   | Bulk actions
   |---------------------------------*/
  const bulkApprove = async () => {
    if (!selectedIds.length) return;

    const ids = [...selectedIds];
    setRowSelection({});

    toastInfo(`Processing ${ids.length} approval${ids.length > 1 ? 's' : ''}…`);

    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await approve.mutateAsync({ approvalId: id });
        success++;
      } catch (err) {
        console.error('Approval failed:', err);
        failed++;
      }
    }

    if (failed === 0) {
      toastSuccess(`${success} approval${success > 1 ? 's' : ''} completed`);
    } else {
      toastError(`${success} approved, ${failed} failed`);
    }
  };

  const bulkRejectConfirm = async (reason) => {
    if (!selectedIds.length) return;

    const ids = [...selectedIds];
    setRowSelection({});
    setOpenBulkReject(false);

    toastInfo(`Rejecting ${ids.length} request${ids.length > 1 ? 's' : ''}…`);

    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await reject.mutateAsync({ approvalId: id, reason });
        success++;
      } catch (err) {
        console.error('Rejection failed:', err);
        failed++;
      }
    }

    if (failed === 0) {
      toastSuccess(`${success} request${success > 1 ? 's' : ''} rejected`);
    } else {
      toastError(`${success} rejected, ${failed} failed`);
    }
  };

  /* --------------------------------
   | Single actions (DRAWER)
   |---------------------------------*/
  const approveSingle = async () => {
    if (!activeApprovalId) return;

    toastInfo("Approving request…");

    try {
      await approve.mutateAsync({
        approvalId: activeApprovalId,
      });

      toastSuccess("Request approved");
      setDrawerOpen(false);
      setActiveApprovalId(null);
    } catch (err) {
      console.error('Approval failed:', err);
      toastError("Failed to approve request");
    }
  };

  const rejectSingle = async (reason) => {
    if (!activeApprovalId) return;

    toastInfo("Rejecting request…");

    try {
      await reject.mutateAsync({
        approvalId: activeApprovalId,
        reason,
      });

      toastSuccess("Request rejected");
      setOpenBulkReject(false);
      setDrawerOpen(false);
      setActiveApprovalId(null);
    } catch (err) {
      console.error('Rejection failed:', err);
      toastError("Failed to reject request");
    }
  };

  /* --------------------------------
   | Render
   |---------------------------------*/
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-6 pt-6 pb-4 space-y-6">
        <ApprovalsHeader />

        <div className="flex items-center justify-between">
          {!hideTabs && (
            <ApprovalTabs
              value={status}
              onChange={setStatus}
              counts={counts}
            />
          )}
        </div>

        {status === "pending" && selectedIds.length > 0 && (
          <BulkApprovalBar
            count={selectedIds.length}
            disabled={isBusy}
            isApproving={approve.isPending ?? approve.isLoading}
            isRejecting={reject.isPending ?? reject.isLoading}
            onApprove={bulkApprove}
            onReject={() => setOpenBulkReject(true)}
          />
        )}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">
              Loading approvals…
            </div>
          </div>
        ) : approvals.length === 0 ? (
          <EmptyApprovals />
        ) : (
          <DataTable
            columns={approvalColumns}
            data={approvals}
            selectable={status === "pending"}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            globalSearchKeys={[
              "employee.name",
              "type",
              "status",
            ]}
            onRowClick={(row) => {
              if (isBusy) return;
              setActiveApprovalId(row.id);
              setDrawerOpen(true);
            }}
          />
        )}
      </div>

      {/* Bulk Reject Dialog */}
      <RejectApprovalDialog
        open={openBulkReject && selectedIds.length > 0}
        onClose={() => setOpenBulkReject(false)}
        isLoading={reject.isPending ?? reject.isLoading}
        onConfirm={bulkRejectConfirm}
        title={selectedIds.length > 1 ? `Reject ${selectedIds.length} Requests` : "Reject Request"}
      />

      {/* Approval Drawer */}
      <ApprovalDrawer
        open={drawerOpen}
        onClose={() => !isBusy && setDrawerOpen(false)}
        approval={approvalDetailsQ.data}
        loading={isBusy}
        onApprove={approveSingle}
        onReject={() => setOpenBulkReject(true)}
      />
    </div>
  );
}