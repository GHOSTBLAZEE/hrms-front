"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Save, X, Shield, FileText } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function StatutoryComplianceTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    pf_number: employee.pf_number || "",
    esi_number: employee.esi_number || "",
    uan_number: employee.uan_number || "",
  });

  const updateEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Statutory details updated successfully");
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
              <Shield className="h-5 w-5" />
              Statutory Compliance
            </CardTitle>
            <CardDescription>PF, ESI, UAN and other statutory numbers</CardDescription>
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
            <InfoRow label="PF Number" value={employee.pf_number} icon={FileText} />
            <InfoRow label="ESI Number" value={employee.esi_number} icon={FileText} />
            <InfoRow label="UAN Number" value={employee.uan_number} icon={FileText} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>PF Number</Label>
              <Input
                value={formData.pf_number}
                onChange={(e) => setFormData({ ...formData, pf_number: e.target.value })}
                placeholder="Enter PF number"
              />
            </div>
            <div className="space-y-2">
              <Label>ESI Number</Label>
              <Input
                value={formData.esi_number}
                onChange={(e) => setFormData({ ...formData, esi_number: e.target.value })}
                placeholder="Enter ESI number"
              />
            </div>
            <div className="space-y-2">
              <Label>UAN Number</Label>
              <Input
                value={formData.uan_number}
                onChange={(e) => setFormData({ ...formData, uan_number: e.target.value })}
                placeholder="Enter UAN number"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
