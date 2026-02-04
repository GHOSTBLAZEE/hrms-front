"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  GitBranch, 
  Trash2, 
  Power, 
  PowerOff,
  CheckCircle2,
  XCircle,
  Calendar,
  Info
} from "lucide-react";
import { useLeaveTypes } from "./useLeaveTypes";

export default function LeaveTypesTable({
  data,
  allData,
  loading,
  onCreateVersion,
  showInactive,
  onToggleInactive,
  searchQuery,
}) {
  const { update, remove } = useLeaveTypes();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'deactivate' | 'delete'
    leaveType: null,
  });

  const handleDeactivate = (leaveType) => {
    setConfirmDialog({
      open: true,
      type: 'deactivate',
      leaveType,
    });
  };

  const handleDelete = (leaveType) => {
    setConfirmDialog({
      open: true,
      type: 'delete',
      leaveType,
    });
  };

  const handleConfirm = () => {
    const { type, leaveType } = confirmDialog;
    
    if (type === 'deactivate') {
      update.mutate({
        id: leaveType.id,
        is_active: false,
      });
    } else if (type === 'delete') {
      remove.mutate(leaveType.id);
    }
    
    setConfirmDialog({ open: false, type: null, leaveType: null });
  };

  // Loading state
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  // Empty state (no data at all)
  if (!allData || allData.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No Leave Types Configured
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by creating your first leave type
        </p>
        <Button onClick={() => onCreateVersion(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Leave Type
        </Button>
      </Card>
    );
  }

  // No search results
  if (searchQuery && data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No Results Found
        </h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search query
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        {/* Toggle Section */}
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b">
          <Switch
            checked={showInactive}
            onCheckedChange={onToggleInactive}
            id="show-inactive"
          />
          <label 
            htmlFor="show-inactive"
            className="text-sm font-medium cursor-pointer"
          >
            Show inactive leave types
          </label>
          {!showInactive && (
            <Badge variant="outline" className="ml-auto">
              {allData.filter(t => !t.is_active).length} hidden
            </Badge>
          )}
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Leave Type</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Annual Limit</TableHead>
              <TableHead className="font-semibold">Accrual Rate</TableHead>
              <TableHead className="font-semibold text-center">Half Day</TableHead>
              <TableHead className="font-semibold text-center">Approval</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((leaveType) => (
              <TableRow 
                key={leaveType.id}
                className={!leaveType.is_active ? "opacity-60 bg-slate-50" : "hover:bg-slate-50/50"}
              >
                {/* Name */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {leaveType.name}
                    </span>
                    {!leaveType.is_active && (
                      <span className="text-xs text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Code */}
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {leaveType.code}
                  </Badge>
                </TableCell>

                {/* Paid/Unpaid */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {leaveType.is_paid ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-600">
                        Unpaid
                      </Badge>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {leaveType.is_paid 
                              ? "Paid leave with balance tracking" 
                              : "Unpaid leave (LOP)"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>

                {/* Annual Limit */}
                <TableCell>
                  {leaveType.is_paid ? (
                    <span className="font-semibold text-slate-900">
                      {leaveType.annual_limit} days
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Accrual Rate */}
                <TableCell>
                  {leaveType.is_paid ? (
                    <span className="text-sm text-slate-600">
                      {leaveType.accrual_rate} / month
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Allow Half Day */}
                <TableCell className="text-center">
                  {leaveType.allow_half_day ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-300 mx-auto" />
                  )}
                </TableCell>

                {/* Requires Approval */}
                <TableCell className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-block">
                          <Switch
                            checked={!!leaveType.requires_approval}
                            onCheckedChange={(v) =>
                              update.mutate({
                                id: leaveType.id,
                                requires_approval: v,
                              })
                            }
                            disabled={!leaveType.is_active}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {leaveType.requires_approval 
                            ? "Approval required" 
                            : "Auto-approved"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  {leaveType.is_active ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                      <Power className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-600 gap-1">
                      <PowerOff className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCreateVersion(leaveType)}
                            className="gap-1"
                          >
                            <GitBranch className="h-3 w-3" />
                            Version
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Create new version of this leave type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {leaveType.is_active ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeactivate(leaveType)}
                              className="gap-1"
                            >
                              <PowerOff className="h-3 w-3" />
                              Deactivate
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Deactivate this leave type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(leaveType)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Permanently delete this leave type</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t">
          <p className="text-xs text-muted-foreground">
            Showing {data.length} of {allData.length} leave types
          </p>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, leaveType: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'deactivate' ? 'Deactivate Leave Type?' : 'Delete Leave Type?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'deactivate' ? (
                <>
                  Are you sure you want to deactivate <strong>{confirmDialog.leaveType?.name}</strong>? 
                  It will no longer be available for new leave applications, but existing data will be preserved.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete <strong>{confirmDialog.leaveType?.name}</strong>? 
                  This action cannot be undone. Only inactive leave types can be deleted.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={confirmDialog.type === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {confirmDialog.type === 'deactivate' ? 'Deactivate' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}