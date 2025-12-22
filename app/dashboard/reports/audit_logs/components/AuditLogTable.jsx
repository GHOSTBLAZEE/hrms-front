"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AuditLogTable({
  logs,
  meta,
  loading,
  onPageChange,
  onRowClick,
}) {
  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick(log)}
            >
              <TableCell>{format(new Date(log.created_at), "PPp")}</TableCell>
              <TableCell>{log.causer?.name || "System"}</TableCell>
              <TableCell className="font-mono text-xs">{log.event}</TableCell>
              <TableCell>{log.description}</TableCell>
            </TableRow>
          ))}

          {!logs.length && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No audit logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {meta && (
        <div className="flex justify-between p-3">
          <span className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.last_page}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page === 1}
              onClick={() => onPageChange(meta.current_page - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page === meta.last_page}
              onClick={() => onPageChange(meta.current_page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
