"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
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
import {
  Wallet,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function PayrollTab({ employee }) {
  const { data, isLoading } = useQuery({
    queryKey: ["employee-payslips", employee.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/payslips?employee_id=${employee.id}`
      );
      return res.data;
    },
    staleTime: 60000,
  });

  const payslips = data?.data || [];

  // Calculate stats
  const stats = {
    total: payslips.length,
    totalEarnings: payslips.reduce((sum, p) => sum + Number(p.gross_pay || 0), 0),
    averagePay: payslips.length > 0
      ? payslips.reduce((sum, p) => sum + Number(p.net_pay || 0), 0) / payslips.length
      : 0,
    latestPay: payslips[0]?.net_pay || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Payroll History</h2>
          <p className="text-sm text-muted-foreground">
            View payslips and salary statements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {payslips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Latest Salary
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.latestPay)}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Average Salary
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.averagePay)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.totalEarnings)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payslips Table */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        {payslips.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Payslips Available
            </h3>
            <p className="text-sm text-muted-foreground">
              Payslips will appear here once payroll is processed
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Period</TableHead>
                <TableHead className="font-semibold">Gross Pay</TableHead>
                <TableHead className="font-semibold">Deductions</TableHead>
                <TableHead className="font-semibold">Net Pay</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((payslip) => {
                const deductions = Number(payslip.gross_pay || 0) - Number(payslip.net_pay || 0);
                
                return (
                  <TableRow key={payslip.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900">
                            {new Date(payslip.year, payslip.month - 1).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payslip.month}/{payslip.year}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {formatINR(payslip.gross_pay)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      -{formatINR(deductions)}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600">
                      {formatINR(payslip.net_pay)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/payroll/payslips/${payslip.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/payroll/payslips/${payslip.id}/download`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-3 w-3" />
                            PDF
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Info Alert */}
      {payslips.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Payslip Information</p>
              <p className="text-xs">
                All amounts are in Indian Rupees (₹). Deductions include tax,
                PF, ESI, and other statutory contributions. Download PDF for
                detailed breakdown.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}