import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApprovalActions } from "../hooks/useApprovalActions";
import RejectApprovalDialog from "./RejectApprovalDialog";
import { useRouter } from "next/navigation";

export default function ApprovalRowActions({ item }) {
  const { approve, reject } = useApprovalActions();
  const router = useRouter();
  const [openReject, setOpenReject] = useState(false);

  const isPending = item.status === "pending";
  const isLoading =
    approve.isLoading || reject.isLoading;

  // ✅ Non-pending → View Audit
  if (!isPending) {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          item.audit_url &&
          router.push(item.audit_url)
        }
      >
        View Audit
      </Button>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={() => setOpenReject(true)}
        >
          Reject
        </Button>

        <Button
          size="sm"
          disabled={isLoading}
          onClick={() =>
            approve.mutate({
              type: item.type,
              id: item.id,
            })
          }
        >
          Approve
        </Button>
      </div>

      {/* ✅ Proper reject reason */}
      <RejectApprovalDialog
        open={openReject}
        onClose={() => setOpenReject(false)}
        isLoading={reject.isLoading}
        onConfirm={(reason) => {
          reject.mutate(
            {
              type: item.type,
              id: item.id,
              reason,
            },
            {
              onSuccess: () =>
                setOpenReject(false),
            }
          );
        }}
      />
    </>
  );
}
