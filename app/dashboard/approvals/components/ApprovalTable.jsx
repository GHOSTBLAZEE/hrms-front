import EmptyApprovals from "./EmptyApprovals";

export default function ApprovalTable({
  data = [],
  isLoading,
  selected = [],
  onSelect,
}) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading approvals…</div>;
  }

  if (!data.length) {
    return <EmptyApprovals />;
  }

  const allSelected =
    data.length > 0 &&
    data.every((item) => selected.includes(item.id));

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) =>
                  onSelect(
                    e.target.checked
                      ? data.map((i) => i.id)
                      : []
                  )
                }
              />
            </th>
            <th className="px-4 py-2 text-left">Employee</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Submitted</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const isPending = item.status === "pending";
            const checked = selected.includes(item.id);

            return (
              <tr key={`${item.type}-${item.id}`} className="border-t">
                <td className="px-4 py-2">
                  {isPending && (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onSelect(
                          checked
                            ? selected.filter((id) => id !== item.id)
                            : [...selected, item.id]
                        )
                      }
                    />
                  )}
                </td>

                {/* existing cells unchanged */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
