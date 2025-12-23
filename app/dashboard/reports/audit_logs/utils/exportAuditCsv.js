import { format } from "date-fns";

export function exportAuditCsv(logs) {
  if (!logs?.length) return;

  const headers = [
    "Date",
    "User",
    "Event",
    "Description",
    "Subject",
    "Properties",
  ];

  const rows = logs.map((log) => [
    format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
    log.causer?.name || "System",
    log.event,
    log.description,
    log.subject_type
      ? `${log.subject_type}#${log.subject_id}`
      : "",
    JSON.stringify(log.properties || {}),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}
