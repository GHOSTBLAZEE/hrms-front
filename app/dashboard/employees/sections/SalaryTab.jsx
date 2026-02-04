"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  History,
  CheckCircle2,
} from "lucide-react";
import AddSalaryDialog from "../components/AddSalaryDialog";

export default function SalaryTab({ employee, employeeId, onUpdate }) {
  const [addSalaryOpen, setAddSalaryOpen] = useState(false);

  const salaryStructures = employee.salaryStructures || [];
  const currentSalary = salaryStructures.find((s) => s.is_active) || salaryStructures[0];

  return (
    <>
      <div className="space-y-6">
        {/* Current Salary Overview */}
        {currentSalary ? (
          <Card className="p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Current Salary Structure
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Effective from{" "}
                  {new Date(currentSalary.effective_from).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {employee.can?.update && (
                <Button
                  onClick={() => setAddSalaryOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Revision
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Basic Salary
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{currentSalary.basic?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  HRA
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{currentSalary.hra?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Allowances
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  ₹{currentSalary.allowances?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Gross Salary
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  ₹{currentSalary.total?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap gap-3">
              {currentSalary.pf_applicable && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  PF Applicable
                </Badge>
              )}
              {currentSalary.esi_applicable && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  ESI Applicable
                </Badge>
              )}
              {currentSalary.is_active && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Salary Structure
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              No salary structure has been assigned yet
            </p>
            {employee.can?.update && (
              <Button
                onClick={() => setAddSalaryOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Salary Structure
              </Button>
            )}
          </Card>
        )}

        {/* Salary History */}
        {salaryStructures.length > 1 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Salary Revision History</h3>
              <Badge variant="secondary">{salaryStructures.length} revisions</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead>HRA</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Increment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryStructures.map((salary, index) => {
                  const prevSalary = salaryStructures[index + 1];
                  const increment = prevSalary
                    ? ((salary.total - prevSalary.total) / prevSalary.total) * 100
                    : 0;

                  return (
                    <TableRow key={salary.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(salary.effective_from).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>₹{salary.basic?.toLocaleString("en-IN")}</TableCell>
                      <TableCell>₹{salary.hra?.toLocaleString("en-IN")}</TableCell>
                      <TableCell>₹{salary.allowances?.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{salary.total?.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        {increment > 0 ? (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-medium">+{increment.toFixed(1)}%</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {salary.is_active ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Current
                          </Badge>
                        ) : (
                          <Badge variant="outline">Historical</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <AddSalaryDialog
        employeeId={employeeId}
        open={addSalaryOpen}
        onOpenChange={setAddSalaryOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}