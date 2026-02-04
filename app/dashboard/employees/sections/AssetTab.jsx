"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Laptop, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AssetsTab({ employeeId }) {
  const { data: assets, isLoading } = useQuery({
    queryKey: ["employee-assets", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/assets`);
      return res.data.data || [];
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Assigned
          </Badge>
        );
      case "returned":
        return (
          <Badge variant="outline">
            <XCircle className="h-3 w-3 mr-1" />
            Returned
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Laptop className="h-5 w-5 text-purple-600" />
        Assigned Assets
      </h3>

      {!assets || assets.length === 0 ? (
        <div className="text-center py-12">
          <Laptop className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No assets assigned</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.asset_type}</TableCell>
                <TableCell className="font-mono text-sm">
                  {asset.serial_number || "—"}
                </TableCell>
                <TableCell>
                  {new Date(asset.assigned_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      asset.condition === "good"
                        ? "text-emerald-600 border-emerald-300"
                        : asset.condition === "fair"
                        ? "text-amber-600 border-amber-300"
                        : "text-red-600 border-red-300"
                    }
                  >
                    {asset.condition}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}