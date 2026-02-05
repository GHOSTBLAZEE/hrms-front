"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Edit, Save, X, Shield, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function StatutoryComplianceTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    pan_number: employee.pan_number || "",
    uan_number: employee.uan_number || "",
    pf_number: employee.pf_number || "",
    esi_number: employee.esi_number || "",
    pf_applicable: employee.pf_applicable ?? true,
    esi_applicable: employee.esi_applicable ?? false,
    gratuity_applicable: employee.gratuity_applicable ?? true,
    restrict_pf_wages: employee.restrict_pf_wages ?? true,
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validatePAN = (pan) => {
    if (!pan) return true; // PAN is optional
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateUAN = (uan) => {
    if (!uan) return true; // UAN is optional
    // UAN is 12 digits
    const uanRegex = /^[0-9]{12}$/;
    return uanRegex.test(uan);
  };

  const validateESI = (esi) => {
    if (!esi) return true; // ESI is optional
    // ESI number is 17 digits
    const esiRegex = /^[0-9]{17}$/;
    return esiRegex.test(esi);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.pan_number && !validatePAN(formData.pan_number)) {
      newErrors.pan_number = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (formData.uan_number && !validateUAN(formData.uan_number)) {
      newErrors.uan_number = "UAN must be exactly 12 digits";
    }

    if (formData.esi_number && !validateESI(formData.esi_number)) {
      newErrors.esi_number = "ESI number must be exactly 17 digits";
    }

    // PF number validation
    if (formData.pf_applicable && !formData.pf_number) {
      newErrors.pf_number = "PF number is required when PF is applicable";
    }

    // ESI number validation
    if (formData.esi_applicable && !formData.esi_number) {
      newErrors.esi_number = "ESI number is required when ESI is applicable";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Statutory details updated successfully");
      setIsEditing(false);
      setErrors({});
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update statutory details";
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        setErrors(validationErrors);
      }
      
      toast.error(message);
    },
  });

  const handleSave = () => {
    if (validateForm()) {
      updateEmployee.mutate(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      pan_number: employee.pan_number || "",
      uan_number: employee.uan_number || "",
      pf_number: employee.pf_number || "",
      esi_number: employee.esi_number || "",
      pf_applicable: employee.pf_applicable ?? true,
      esi_applicable: employee.esi_applicable ?? false,
      gratuity_applicable: employee.gratuity_applicable ?? true,
      restrict_pf_wages: employee.restrict_pf_wages ?? true,
    });
    setIsEditing(false);
    setErrors({});
  };

  const InfoRow = ({ label, value, icon: Icon, verified }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          {verified && (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
        </div>
        <p className="font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const ComplianceRow = ({ label, isApplicable }) => (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-medium">{label}</p>
      </div>
      {isApplicable ? (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Applicable
        </Badge>
      ) : (
        <Badge variant="secondary">Not Applicable</Badge>
      )}
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
            <CardDescription>PF, ESI, UAN, PAN and other statutory details</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={updateEmployee.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateEmployee.isPending ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={updateEmployee.isPending}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-6">
            {/* Identification Numbers */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Identification Numbers
              </h4>
              <div className="space-y-0">
                <InfoRow label="PAN Number" value={employee.pan_number} icon={FileText} />
                <InfoRow label="UAN Number" value={employee.uan_number} icon={FileText} />
              </div>
            </div>

            {/* Statutory Numbers */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Statutory Numbers
              </h4>
              <div className="space-y-0">
                <InfoRow label="PF Number" value={employee.pf_number} icon={FileText} />
                <InfoRow label="ESI Number" value={employee.esi_number} icon={FileText} />
              </div>
            </div>

            {/* Applicability */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Statutory Applicability
              </h4>
              <div className="space-y-0">
                <ComplianceRow label="Provident Fund (PF)" isApplicable={employee.pf_applicable} />
                <ComplianceRow label="Employee State Insurance (ESI)" isApplicable={employee.esi_applicable} />
                <ComplianceRow label="Gratuity" isApplicable={employee.gratuity_applicable} />
                <ComplianceRow label="Restrict PF Wages" isApplicable={employee.restrict_pf_wages} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Identification Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Identification Numbers
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>PAN Number</Label>
                  <Input
                    value={formData.pan_number}
                    onChange={(e) => handleInputChange('pan_number', e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className={errors.pan_number ? "border-red-500" : ""}
                  />
                  {errors.pan_number && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.pan_number}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format: 5 letters, 4 numbers, 1 letter
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>UAN Number</Label>
                  <Input
                    value={formData.uan_number}
                    onChange={(e) => handleInputChange('uan_number', e.target.value.replace(/\D/g, ''))}
                    placeholder="123456789012"
                    maxLength={12}
                    className={errors.uan_number ? "border-red-500" : ""}
                  />
                  {errors.uan_number && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.uan_number}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Universal Account Number (12 digits)
                  </p>
                </div>
              </div>
            </div>

            {/* Provident Fund Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Provident Fund (PF)
                </h4>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pf-applicable" className="text-sm font-normal cursor-pointer">
                    PF Applicable
                  </Label>
                  <Switch
                    id="pf-applicable"
                    checked={formData.pf_applicable}
                    onCheckedChange={(checked) => handleInputChange('pf_applicable', checked)}
                  />
                </div>
              </div>

              {formData.pf_applicable && (
                <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                  <div className="space-y-2">
                    <Label>PF Number *</Label>
                    <Input
                      value={formData.pf_number}
                      onChange={(e) => handleInputChange('pf_number', e.target.value.toUpperCase())}
                      placeholder="e.g., MH/MUM/12345/678/9012345"
                      className={errors.pf_number ? "border-red-500" : ""}
                    />
                    {errors.pf_number && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.pf_number}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="restrict-pf" className="text-sm cursor-pointer">
                        Restrict PF contribution to ₹15,000 ceiling
                      </Label>
                    </div>
                    <Switch
                      id="restrict-pf"
                      checked={formData.restrict_pf_wages}
                      onCheckedChange={(checked) => handleInputChange('restrict_pf_wages', checked)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ESI Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Employee State Insurance (ESI)
                </h4>
                <div className="flex items-center gap-2">
                  <Label htmlFor="esi-applicable" className="text-sm font-normal cursor-pointer">
                    ESI Applicable
                  </Label>
                  <Switch
                    id="esi-applicable"
                    checked={formData.esi_applicable}
                    onCheckedChange={(checked) => handleInputChange('esi_applicable', checked)}
                  />
                </div>
              </div>

              {formData.esi_applicable && (
                <div className="pl-6 border-l-2 border-primary/20">
                  <div className="space-y-2">
                    <Label>ESI Number *</Label>
                    <Input
                      value={formData.esi_number}
                      onChange={(e) => handleInputChange('esi_number', e.target.value.replace(/\D/g, ''))}
                      placeholder="12345678901234567"
                      maxLength={17}
                      className={errors.esi_number ? "border-red-500" : ""}
                    />
                    {errors.esi_number && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.esi_number}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      17-digit ESI insurance number
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Gratuity Section */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="gratuity" className="text-sm cursor-pointer">
                  Gratuity Applicable
                </Label>
              </div>
              <Switch
                id="gratuity"
                checked={formData.gratuity_applicable}
                onCheckedChange={(checked) => handleInputChange('gratuity_applicable', checked)}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Statutory Compliance Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>PF is mandatory for employees with salary ≤ ₹15,000</li>
                    <li>ESI is applicable for employees with salary ≤ ₹21,000</li>
                    <li>Gratuity is applicable after 5 years of service</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}