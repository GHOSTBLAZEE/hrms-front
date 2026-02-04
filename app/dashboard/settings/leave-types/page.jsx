"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Search, 
  Plane, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Clock
} from "lucide-react";
import { useLeaveTypes } from "./useLeaveTypes";
import LeaveTypesTable from "./LeaveTypesTable";
import LeaveTypeDialog from "./LeaveTypeDialog";

export default function LeaveTypesPage() {
  const [showInactive, setShowInactive] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { list } = useLeaveTypes({
    includeInactive: showInactive,
  });

  const loading = list?.isLoading;
  const data = list?.data?.data?.data ?? [];

  // Filter data by search query
  const filteredData = data.filter((type) => {
    const query = searchQuery.toLowerCase();
    return (
      type.name?.toLowerCase().includes(query) ||
      type.code?.toLowerCase().includes(query)
    );
  });

  // Calculate stats
  const stats = {
    total: data.length,
    active: data.filter(t => t.is_active).length,
    inactive: data.filter(t => !t.is_active).length,
    paid: data.filter(t => t.is_paid && t.is_active).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Leave Types
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage leave categories and their configurations
                </p>
              </div>
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Leave Type
          </Button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Types</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Active</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Paid Leave</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.paid}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-slate-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Inactive</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.inactive}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <XCircle className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leave types by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Table */}
        <LeaveTypesTable
          data={filteredData}
          allData={data}
          loading={loading}
          showInactive={showInactive}
          onToggleInactive={setShowInactive}
          onCreateVersion={(t) => {
            setEditing(t);
            setOpen(true);
          }}
          searchQuery={searchQuery}
        />

        {/* Dialog */}
        <LeaveTypeDialog
          open={open}
          initialData={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
        />
      </div>
    </div>
  );
}