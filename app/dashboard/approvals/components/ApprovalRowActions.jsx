export default function ApprovalRowActions({ item }) {
  const { approve, reject } = useApprovalActions();
  const router = useRouter();
  const [openReject, setOpenReject] = useState(false);

  const isPending = item.status === "pending";
  const isLoading = approve.isLoading || reject.isLoading;

  // ❌ Not pending OR not allowed → View only
  if (!isPending || !item.can_act) {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          item.audit_url && router.push(item.audit_url)
        }
      >
        View
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
            approve.mutate({ approvalId: item.id })
          }
        >
          Approve
        </Button>
      </div>

      <RejectApprovalDialog
        open={openReject}
        onClose={() => setOpenReject(false)}
        isLoading={reject.isLoading}
        onConfirm={(reason) => {
          reject.mutate(
            { approvalId: item.id, reason },
            { onSuccess: () => setOpenReject(false) }
          );
        }}
      />
    </>
  );
}
