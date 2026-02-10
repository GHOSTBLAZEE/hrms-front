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
  Receipt,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plane,
  Utensils,
  Hotel,
  Car,
  ShoppingBag,
  FileText,
  Download,
  Eye,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function MyExpensesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch user's expenses
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-expenses", statusFilter, categoryFilter],
    queryFn: async () => {
      if (!user?.employee_id) {
        throw new Error("Employee profile not found");
      }

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/expenses?${params}`
      );
      return response.data?.data || [];
    },
    enabled: !!user?.employee_id,
  });

  const expenses = data || [];

  // Filter by search
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.title?.toLowerCase().includes(search.toLowerCase()) ||
      expense.description?.toLowerCase().includes(search.toLowerCase()) ||
      expense.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Expense category configurations
  const expenseCategories = {
    travel: {
      label: "Travel",
      icon: Plane,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    food: {
      label: "Food & Meals",
      icon: Utensils,
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
    },
    accommodation: {
      label: "Accommodation",
      icon: Hotel,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
    transport: {
      label: "Transportation",
      icon: Car,
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    supplies: {
      label: "Office Supplies",
      icon: ShoppingBag,
      color: "pink",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
    },
    other: {
      label: "Other",
      icon: Receipt,
      color: "slate",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      textColor: "text-slate-700",
    },
  };

  const getCategoryConfig = (category) => {
    return expenseCategories[category] || expenseCategories.other;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-100 text-amber-800 border-amber-200",
      },
      approved: {
        label: "Approved",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        label: "Rejected",
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200",
      },
      reimbursed: {
        label: "Reimbursed",
        icon: DollarSign,
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate stats
  const stats = {
    total: expenses.length,
    pending: expenses.filter((e) => e.status === "pending").length,
    approved: expenses.filter((e) => e.status === "approved").length,
    totalAmount: expenses
      .filter((e) => e.status === "approved" || e.status === "reimbursed")
      .reduce((sum, e) => sum + (e.amount || 0), 0),
  };

  if (!user?.employee_id) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Employee Profile Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You need an employee profile to submit expenses
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
            <h3 className="font-semibold">Failed to load expenses</h3>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            My Expenses
          </h1>
          <p className="text-muted-foreground mt-1">
            Submit and track your expense claims and reimbursements
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Expense Claim
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Claims</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.total}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Receipt className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Reimbursed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
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
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(expenseCategories).map(([key, config]) => (
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="reimbursed">Reimbursed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search || statusFilter !== "all" || categoryFilter !== "all"
                ? "No expenses found"
                : "No expenses submitted"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Submit your first expense claim to get started"}
            </p>
            {!search && statusFilter === "all" && categoryFilter === "all" && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Expense Claim
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const categoryConfig = getCategoryConfig(expense.category);
            const statusBadge = getStatusBadge(expense.status);
            const CategoryIcon = categoryConfig.icon;
            const StatusIcon = statusBadge.icon;

            return (
              <Card
                key={expense.id}
                className={`border-l-4 border-l-${categoryConfig.color}-500 hover:shadow-md transition-all`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-3 rounded-lg ${categoryConfig.bgColor} border-2 ${categoryConfig.borderColor} flex-shrink-0`}>
                        <CategoryIcon className={`h-6 w-6 ${categoryConfig.textColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900">
                              {expense.title || "Untitled Expense"}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <Badge
                                variant="outline"
                                className={categoryConfig.bgColor + " " + categoryConfig.textColor + " " + categoryConfig.borderColor}
                              >
                                {categoryConfig.label}
                              </Badge>
                              <Badge variant="outline" className={statusBadge.className}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusBadge.label}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">
                              {formatCurrency(expense.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(expense.expense_date || expense.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {expense.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {expense.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          {expense.receipt_url && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              <span>Receipt attached</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Submitted {new Date(expense.created_at).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          {expense.approved_by && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Approved by {expense.approved_by.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Rejection reason */}
                        {expense.status === "rejected" && expense.rejection_reason && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-start gap-2 text-xs text-red-800">
                              <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">Rejection Reason:</p>
                                <p>{expense.rejection_reason}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {expense.receipt_url && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {expense.receipt_url && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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