"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CreditCard, TrendingDown, Check, X, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function LoansTab({ employee }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["employee-loans", employee.id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/employees/${employee.id}/loans`);
      if (!response.ok) throw new Error("Failed to fetch loans");
      return response.json();
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/v1/employees/${employee.id}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create loan");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-loans", employee.id]);
      toast.success("Loan created successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create loan");
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: async (loanId) => {
      const response = await fetch(
        `/api/v1/employees/${employee.id}/loans/${loanId}/payment`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to record payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-loans", employee.id]);
      toast.success("Payment recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record payment");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      loan_type: formData.get("loan_type"),
      amount: parseFloat(formData.get("amount")),
      installments: parseInt(formData.get("installments")),
      start_date: formData.get("start_date"),
      reason: formData.get("reason"),
      notes: formData.get("notes"),
    };
    createLoanMutation.mutate(data);
  };

  const totalActive = loans.filter((l) => l.status === "active").length;
  const totalOutstanding = loans
    .filter((l) => l.status === "active")
    .reduce((sum, l) => sum + parseFloat(l.outstanding_amount), 0);

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "";
  };

  return (
    <div className="space-y-6">
      {/* Stats and Actions */}
      <div className="flex items-center justify-between">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Loans</CardDescription>
              <CardTitle className="text-2xl">{totalActive}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Outstanding</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {totalOutstanding.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Loan</DialogTitle>
                <DialogDescription>
                  Create a new loan or advance for {employee.full_name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="loan_type">Type</Label>
                  <Select name="loan_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">Advance</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="installments">Installments</Label>
                  <Input
                    id="installments"
                    name="installments"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea id="reason" name="reason" rows={2} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoanMutation.isPending}>
                  {createLoanMutation.isPending ? "Creating..." : "Create Loan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loans List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Loading loans...
            </CardContent>
          </Card>
        ) : loans.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No loans found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click "New Loan" to create the first loan
              </p>
            </CardContent>
          </Card>
        ) : (
          loans.map((loan) => {
            const progressPercentage =
              ((loan.installments_paid / loan.installments) * 100).toFixed(0);
            const isActive = loan.status === "active";

            return (
              <Card key={loan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {loan.loan_type.replace("_", " ").toUpperCase()}
                        </CardTitle>
                        <Badge variant="outline" className={getStatusColor(loan.status)}>
                          {loan.status.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        Started on {new Date(loan.start_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {isActive && (
                      <Button
                        size="sm"
                        onClick={() => recordPaymentMutation.mutate(loan.id)}
                        disabled={recordPaymentMutation.isPending}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Record Payment
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Amount Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Amount
                      </div>
                      <div className="text-lg font-bold flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {parseFloat(loan.amount).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Outstanding
                      </div>
                      <div className="text-lg font-bold text-orange-600 flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {parseFloat(loan.outstanding_amount).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Per Month
                      </div>
                      <div className="text-lg font-bold flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {parseFloat(loan.installment_amount).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {loan.installments_paid} / {loan.installments} installments paid
                      </span>
                      <span className="text-sm font-medium">{progressPercentage}%</span>
                    </div>
                    <Progress value={parseFloat(progressPercentage)} />
                  </div>

                  {/* Reason & Notes */}
                  {loan.reason && (
                    <div>
                      <div className="text-sm font-medium mb-1">Reason</div>
                      <div className="text-sm text-muted-foreground">{loan.reason}</div>
                    </div>
                  )}
                  {loan.notes && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <div className="text-sm text-muted-foreground">{loan.notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
