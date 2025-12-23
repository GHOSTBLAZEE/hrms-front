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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const STATUS_VARIANT = {
  pending: "secondary",
  processing: "secondary",
  completed: "success",
  failed: "destructive",
};

export default function ExportHistoryTable({ exports, loading }) {
  if (loading) {
    return <div>Loading exports…</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {exports.map((exp) => (
            <TableRow key={exp.id}>
              <TableCell>
                {format(new Date(exp.created_at), "PPp")}
              </TableCell>

              <TableCell>{exp.user?.name}</TableCell>

              <TableCell className="capitalize">
                {exp.type.replace("_", " ")}
              </TableCell>

              <TableCell>
                <Badge variant={STATUS_VARIANT[exp.status]}>
                  {exp.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                {exp.status === "completed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `/api/v1/exports/${exp.id}/download`,
                        "_blank"
                      )
                    }
                  >
                    Download
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    —
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}

          {!exports.length && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No exports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
