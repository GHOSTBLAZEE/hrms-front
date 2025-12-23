import * as XLSX from "xlsx";
import { format } from "date-fns";

export function exportAuditExcel(logs) {
  if (!logs?.length) return;

  const rows = logs.map((log) => ({
    Date: format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
    User: log.causer?.name || "System",
    Event: log.event,
    Description: log.description,
    Subject: log.subject_type
      ? `${log.subject_type}#${log.subject_id}`
      : "",
    Properties: JSON.stringify(log.properties || {}),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 18 },
    { wch: 30 },
    { wch: 40 },
    { wch: 30 },
    { wch: 60 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

  XLSX.writeFile(
    workbook,
    `audit-logs-${format(new Date(), "yyyy-MM-dd")}.xlsx`
  );
}
