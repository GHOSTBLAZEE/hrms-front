"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Laptop,
  CheckCircle,
  Clock,
  Package,
  Wrench,
  Plus,
  FileText,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function AssetsTab({ employeeId }) {
  const queryClient = useQueryClient();
  const [showHistory, setShowHistory] = useState(false);

  // Fetch employee asset assignments
  const { data, isLoading } = useQuery({
    queryKey: ["employee-assets", employeeId, showHistory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (!showHistory) {
        params.append("active_only", "true");
      }
      
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}/assets?${params}`
      );
      return res.data;
    },
  });

  const assignments = data?.data || [];
  const meta = data?.meta || {};

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Assigned
          </Badge>
        );
      case "pending_return":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Return
          </Badge>
        );
      case "returned":
        return (
          <Badge variant="outline">
            <Package className="h-3 w-3 mr-1" />
            Returned
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            <Wrench className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition) => {
    const colors = {
      excellent: "text-green-600 border-green-300 bg-green-50",
      good: "text-blue-600 border-blue-300 bg-blue-50",
      fair: "text-amber-600 border-amber-300 bg-amber-50",
      poor: "text-red-600 border-red-300 bg-red-50",
    };
    return (
      <Badge variant="outline" className={colors[condition] || colors.good}>
        {condition?.charAt(0).toUpperCase() + condition?.slice(1)}
      </Badge>
    );
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
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Assets</p>
                <p className="text-2xl font-bold text-blue-600">
                  {meta.active || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold text-green-600">
                  {meta.assigned || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-amber-600">
                  {meta.overdue || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold text-purple-600">
                  ₹{(meta.total_value || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Laptop className="h-5 w-5 text-purple-600" />
            Asset Assignments
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant={showHistory ? "outline" : "ghost"}
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              {showHistory ? "Show Active Only" : "Show History"}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Assign Asset
            </Button>
          </div>
        </div>

        {!assignments || assignments.length === 0 ? (
          <div className="text-center py-12">
            <Laptop className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {showHistory ? "No asset history" : "No active assets assigned"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const asset = assignment.asset;
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{asset?.name || "—"}</div>
                        {asset?.model && (
                          <div className="text-xs text-muted-foreground">
                            {asset.model}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {asset?.asset_code || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {asset?.asset_type || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {asset?.serial_number || "—"}
                    </TableCell>
                    <TableCell>
                      {assignment.assigned_date
                        ? new Date(assignment.assigned_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {getConditionBadge(assignment.condition_on_assignment)}
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}