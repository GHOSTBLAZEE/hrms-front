"use client";

import clsx from "clsx";

export default function ApprovalStatusChip({ status }) {
  const styles = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    skipped: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? styles.pending
      )}
    >
      {status}
    </span>
  );
}
