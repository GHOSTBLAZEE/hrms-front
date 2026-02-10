"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Laptop,
  Smartphone,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Hash,
  MapPin,
  FileText,
  Plus,
  Wrench,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function MyAssetsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch user's asset assignments
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-assets", typeFilter, statusFilter],
    queryFn: async () => {
      if (!user?.employee_id) {
        throw new Error("Employee profile not found");
      }

      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("asset_type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      // Only show active assignments by default
      if (statusFilter === "all") params.append("active_only", "true");

      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/assets?${params}`
      );
      return response.data;
    },
    enabled: !!user?.employee_id,
  });

  const assignments = data?.data || [];
  const meta = data?.meta || {};

  // Filter by search
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.asset?.name?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.asset?.asset_code?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.asset?.serial_number?.toLowerCase().includes(search.toLowerCase()) ||
      assignment.asset?.model?.toLowerCase().includes(search.toLowerCase())
  );

  // Asset type configurations
  const assetTypes = {
    laptop: {
      label: "Laptop",
      icon: Laptop,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    mobile: {
      label: "Mobile Phone",
      icon: Smartphone,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
    monitor: {
      label: "Monitor",
      icon: Monitor,
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    keyboard: {
      label: "Keyboard",
      icon: Keyboard,
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
    },
    mouse: {
      label: "Mouse",
      icon: Mouse,
      color: "pink",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
    },
    headset: {
      label: "Headset",
      icon: Headphones,
      color: "indigo",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700",
    },
    other: {
      label: "Other",
      icon: Package,
      color: "slate",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      textColor: "text-slate-700",
    },
  };

  const getAssetTypeConfig = (type) => {
    return assetTypes[type] || assetTypes.other;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: {
        label: "Assigned",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
      },
      pending_return: {
        label: "Pending Return",
        icon: Clock,
        className: "bg-amber-100 text-amber-800 border-amber-200",
      },
      returned: {
        label: "Returned",
        icon: Package,
        className: "bg-slate-100 text-slate-800 border-slate-200",
      },
      maintenance: {
        label: "Under Maintenance",
        icon: Wrench,
        className: "bg-orange-100 text-orange-800 border-orange-200",
      },
    };
    return statusConfig[status] || statusConfig.assigned;
  };

  const getConditionBadge = (condition) => {
    const conditionConfig = {
      excellent: { label: "Excellent", className: "bg-green-100 text-green-800" },
      good: { label: "Good", className: "bg-blue-100 text-blue-800" },
      fair: { label: "Fair", className: "bg-amber-100 text-amber-800" },
      poor: { label: "Poor", className: "bg-red-100 text-red-800" },
    };
    return conditionConfig[condition] || conditionConfig.good;
  };

  if (!user?.employee_id) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Employee Profile Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You need an employee profile to view assets
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Failed to load assets</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.response?.data?.message || "Please try again"}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Assets
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your assigned company assets
          </p>
        </div>
        <Button
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          View History
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Active</p>
                <p className="text-3xl font-bold text-blue-600">
                  {meta.active || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned</p>
                <p className="text-3xl font-bold text-green-600">
                  {meta.assigned || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Return</p>
                <p className="text-3xl font-bold text-amber-600">
                  {meta.pending_return || 0}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{(meta.total_value || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(assetTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-4 w-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Active Assets</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="pending_return">Pending Return</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "No assets found"
                : "No assets assigned"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No company assets have been assigned to you yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => {
            const asset = assignment.asset;
            const typeConfig = getAssetTypeConfig(asset?.asset_type);
            const statusBadge = getStatusBadge(assignment.status);
            const conditionBadge = getConditionBadge(assignment.condition_on_assignment);
            const AssetIcon = typeConfig.icon;
            const StatusIcon = statusBadge.icon;

            return (
              <Card
                key={assignment.id}
                className={`border-l-4 border-l-${typeConfig.color}-500 hover:shadow-lg transition-all`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${typeConfig.bgColor} border-2 ${typeConfig.borderColor} flex-shrink-0`}>
                      <AssetIcon className={`h-6 w-6 ${typeConfig.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-900 mb-1 line-clamp-1">
                        {asset?.name || "Unnamed Asset"}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={typeConfig.bgColor + " " + typeConfig.textColor + " " + typeConfig.borderColor}
                        >
                          {typeConfig.label}
                        </Badge>
                        <Badge variant="outline" className={statusBadge.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {asset?.model && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {asset.model}
                    </p>
                  )}

                  {/* Metadata Grid */}
                  <div className="space-y-2 text-sm mb-4">
                    {asset?.asset_code && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Hash className="h-4 w-4 text-slate-400" />
                        <span className="font-mono text-xs">{asset.asset_code}</span>
                      </div>
                    )}

                    {asset?.serial_number && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Hash className="h-4 w-4 text-slate-400" />
                        <span className="font-mono text-xs">SN: {asset.serial_number}</span>
                      </div>
                    )}

                    {assignment.location && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{assignment.location}</span>
                      </div>
                    )}

                    {assignment.assigned_date && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>
                          Assigned {new Date(assignment.assigned_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    {assignment.condition_on_assignment && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">Condition:</span>
                        <Badge variant="outline" className={conditionBadge.className + " text-xs"}>
                          {conditionBadge.label}
                        </Badge>
                      </div>
                    )}

                    {asset?.is_under_warranty && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Under Warranty</span>
                      </div>
                    )}
                  </div>

                  {/* Return Date Warning */}
                  {assignment.status === "pending_return" && assignment.expected_return_date && (
                    <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Return by {new Date(assignment.expected_return_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Overdue Warning */}
                  {assignment.is_overdue && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-xs text-red-800">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span className="font-medium">Overdue for return</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Details
                    </Button>
                    {assignment.status === "assigned" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => {
                          toast.info("Return functionality coming soon");
                        }}
                      >
                        <Package className="h-4 w-4 mr-1.5" />
                        Return
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}