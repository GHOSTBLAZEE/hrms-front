"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import SalaryStructureDrawer from "@/app/dashboard/payroll/salary-structures/SalaryStructureDrawer";
import {
  Wallet,
  Plus,
  TrendingUp,
  Calendar,
  Home,
  Gift,
  Info,
} from "lucide-react";

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function EmployeeSalaryTab({ employee }) {
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);
  const hasAutoOpenedRef = useRef(false);
  const hasScrolledRef = useRef(false);

  const isHighlighted = useMemo(() => {
    const raw = searchParams.get("highlight");
    if (!raw || !employee?.id) return false;
    return raw.split(",").map(Number).filter(Boolean).includes(employee.id);
  }, []);

  const {
    data: salaries = [],
    isLoading,
  } = useQuery({
    queryKey: ["employee-salary-structures", employee?.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/salary-structures/${employee.id}`
      );
      return res.data;
    },
    enabled: Boolean(employee?.id),
    staleTime: 60_000,
  });

  const hasSalary = salaries.length > 0;

  useEffect(() => {
    if (!isHighlighted || hasSalary || hasAutoOpenedRef.current) {
      return;
    }
    setOpen(true);
    hasAutoOpenedRef.current = true;
  }, [isHighlighted, hasSalary]);

  useEffect(() => {
    if (!isHighlighted || hasScrolledRef.current || isLoading) {
      return;
    }
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    hasScrolledRef.current = true;
  }, [isHighlighted, isLoading]);

  const createSalaryMutation = useMutation({
    mutationFn: (payload) =>
      apiClient.post("/api/v1/salary-structures", payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["employee-salary-structures", employee.id],
      });
      qc.invalidateQueries({
        queryKey: ["salary-structures"],
      });
      setOpen(false);
    },
  });

  const rows = useMemo(
    () =>
      salaries.map((s) => {
        const basic = Number(s.basic || 0);
        const hra = Number(s.hra || 0);
        const allowances = Number(s.allowances || 0);
        const total = basic + hra + allowances;

        return {
          ...s,
          basic,
          hra,
          allowances,
          total,
        };
      }),
    [salaries]
  );

  // Stats
  const activeSalary = rows.find((r) => r.is_active);
  const stats = {
    current: activeSalary?.total || 0,
    basic: activeSalary?.basic || 0,
    hra: activeSalary?.hra || 0,
    allowances: activeSalary?.allowances || 0,
    revisions: rows.length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
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
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Salary Structure</h2>
            <p className="text-sm text-muted-foreground">
              Current and historical salary revisions
            </p>
          </div>
        </div>

        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Salary Structure
        </Button>
      </div>

      {/* Stats Cards */}
      {hasSalary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Current CTC
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.current)}
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
                  Basic Salary
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.basic)}
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
                  HRA
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.hra)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Home className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Allowances
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatINR(stats.allowances)}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Salary History Table */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        {!hasSalary ? (
          <div className="p-12 text-center">
            <Wallet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Salary Structure
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click "Add Salary Structure" to set up employee compensation
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Effective From</TableHead>
                <TableHead className="font-semibold">Basic</TableHead>
                <TableHead className="font-semibold">HRA</TableHead>
                <TableHead className="font-semibold">Allowances</TableHead>
                <TableHead className="font-semibold">Total CTC</TableHead>
                <TableHead className="font-semibold text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow
                  key={s.id}
                  className={`${s.is_active ? "bg-emerald-50/30" : ""}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-900">
                          {new Date(s.effective_from).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Effective date
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatINR(s.basic)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatINR(s.hra)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatINR(s.allowances)}
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    {formatINR(s.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.is_active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-600">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Info Alert */}
      {hasSalary && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Total Revisions: {stats.revisions}</strong> - Only one
            salary structure can be active at a time. Creating a new structure
            will deactivate the previous one.
          </AlertDescription>
        </Alert>
      )}

      {/* Drawer */}
      <SalaryStructureDrawer
        open={open}
        onClose={() => setOpen(false)}
        employee={employee}
        loading={createSalaryMutation.isPending}
        onSubmit={(values) =>
          createSalaryMutation.mutate({
            ...values,
            employee_id: employee.id,
            is_active: true,
          })
        }
      />
    </div>
  );
}