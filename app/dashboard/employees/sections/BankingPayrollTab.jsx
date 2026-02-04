"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Save, X, CreditCard, Building, DollarSign } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function BankingPayrollTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    bank_name: employee.bank_name || "",
    bank_account_number: employee.bank_account_number || "",
    bank_ifsc_code: employee.bank_ifsc_code || "",
    bank_branch: employee.bank_branch || "",
    pan_number: employee.pan_number || "",
  });

  const updateEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Banking details updated successfully");
      setIsEditing(false);
    },
  });

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Banking & Payroll Information
            </CardTitle>
            <CardDescription>Bank account details for salary processing</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => updateEmployee.mutate(formData)} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-0">
            <InfoRow label="Bank Name" value={employee.bank_name} icon={Building} />
            <InfoRow label="Account Number" value={employee.bank_account_number} icon={CreditCard} />
            <InfoRow label="IFSC Code" value={employee.bank_ifsc_code} icon={CreditCard} />
            <InfoRow label="Branch" value={employee.bank_branch} icon={Building} />
            <InfoRow label="PAN Number" value={employee.pan_number} icon={DollarSign} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="HDFC Bank"
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.bank_account_number}
                  onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <Input
                  value={formData.bank_ifsc_code}
                  onChange={(e) => setFormData({ ...formData, bank_ifsc_code: e.target.value })}
                  placeholder="HDFC0001234"
                />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Input
                  value={formData.bank_branch}
                  onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                  placeholder="Mumbai Main"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>PAN Number</Label>
                <Input
                  value={formData.pan_number}
                  onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
