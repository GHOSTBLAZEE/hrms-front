"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Shield, 
  Edit,
  Save,
  X,
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  Info
} from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function StatutoryTab({ employee, employeeId, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const statutory = employee.statutory;

  const [formData, setFormData] = useState({
    // PF Details
    uan: statutory?.uan || "",
    pf_number: statutory?.pf_number || "",
    pf_applicable: statutory?.pf_applicable ?? true,
    restrict_pf_wages: statutory?.restrict_pf_wages ?? true,
    uan_verified: statutory?.uan_verified || false,
    
    // ESI Details
    esi_number: statutory?.esi_number || "",
    esi_applicable: statutory?.esi_applicable ?? false,
    esi_dispensary: statutory?.esi_dispensary || "",
    esi_verified: statutory?.esi_verified || false,
    
    // Tax & Identification
    pan_number: statutory?.pan_number || "",
    aadhar_number: statutory?.aadhar_number || "",
    
    // Banking
    bank_account_number: statutory?.bank_account_number || "",
    ifsc_code: statutory?.ifsc_code || "",
    
    // Other
    gratuity_applicable: statutory?.gratuity_applicable ?? true,
  });

  const [errors, setErrors] = useState({});

  // Update formData when employee data changes
  useEffect(() => {
    setFormData({
      uan: statutory?.uan || "",
      pf_number: statutory?.pf_number || "",
      pf_applicable: statutory?.pf_applicable ?? true,
      restrict_pf_wages: statutory?.restrict_pf_wages ?? true,
      uan_verified: statutory?.uan_verified || false,
      esi_number: statutory?.esi_number || "",
      esi_applicable: statutory?.esi_applicable ?? false,
      esi_dispensary: statutory?.esi_dispensary || "",
      esi_verified: statutory?.esi_verified || false,
      pan_number: statutory?.pan_number || "",
      aadhar_number: statutory?.aadhar_number || "",
      bank_account_number: statutory?.bank_account_number || "",
      ifsc_code: statutory?.ifsc_code || "",
      gratuity_applicable: statutory?.gratuity_applicable ?? true,
    });
  }, [statutory]);

  // Validation functions
  const validatePAN = (pan) => {
    if (!pan) return true;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateUAN = (uan) => {
    if (!uan) return true;
    const uanRegex = /^[0-9]{12}$/;
    return uanRegex.test(uan);
  };

  const validateESI = (esi) => {
    if (!esi) return true;
    const esiRegex = /^[0-9]{17}$/;
    return esiRegex.test(esi);
  };

  const validateAadhar = (aadhar) => {
    if (!aadhar) return true;
    const aadharRegex = /^[0-9]{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validateIFSC = (ifsc) => {
    if (!ifsc) return true;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
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

    if (formData.uan && !validateUAN(formData.uan)) {
      newErrors.uan = "UAN must be exactly 12 digits";
    }

    if (formData.esi_number && !validateESI(formData.esi_number)) {
      newErrors.esi_number = "ESI number must be exactly 17 digits";
    }

    if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
      newErrors.aadhar_number = "Aadhaar must be exactly 12 digits";
    }

    if (formData.ifsc_code && !validateIFSC(formData.ifsc_code)) {
      newErrors.ifsc_code = "Invalid IFSC code format (e.g., SBIN0001234)";
    }

    // Conditional validation
    if (formData.pf_applicable && !formData.pf_number) {
      newErrors.pf_number = "PF number is required when PF is applicable";
    }

    if (formData.esi_applicable && !formData.esi_number) {
      newErrors.esi_number = "ESI number is required when ESI is applicable";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateStatutory = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(
        `/api/v1/employees/${employeeId}/statutory`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Statutory details updated successfully");
      setIsEditing(false);
      setErrors({});
      if (onUpdate) onUpdate();
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
      updateStatutory.mutate(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      uan: statutory?.uan || "",
      pf_number: statutory?.pf_number || "",
      pf_applicable: statutory?.pf_applicable ?? true,
      restrict_pf_wages: statutory?.restrict_pf_wages ?? true,
      uan_verified: statutory?.uan_verified || false,
      esi_number: statutory?.esi_number || "",
      esi_applicable: statutory?.esi_applicable ?? false,
      esi_dispensary: statutory?.esi_dispensary || "",
      esi_verified: statutory?.esi_verified || false,
      pan_number: statutory?.pan_number || "",
      aadhar_number: statutory?.aadhar_number || "",
      bank_account_number: statutory?.bank_account_number || "",
      ifsc_code: statutory?.ifsc_code || "",
      gratuity_applicable: statutory?.gratuity_applicable ?? true,
    });
    setIsEditing(false);
    setErrors({});
  };

  const InfoRow = ({ label, value, verified, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
        <p className="text-base font-medium text-foreground break-words">
          {value || (
            <span className="text-muted-foreground italic">Not provided</span>
          )}
        </p>
      </div>
      {verified !== undefined && (
        <div className="flex-shrink-0">
          {verified ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : value ? (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          ) : null}
        </div>
      )}
    </div>
  );

  const ComplianceStatusCard = () => {
    const items = [
      { 
        label: "UAN", 
        value: formData.uan,
        description: "Universal Account Number"
      },
      { 
        label: "PF", 
        value: formData.pf_number,
        description: "Provident Fund Number"
      },
      { 
        label: "ESI", 
        value: formData.esi_number,
        description: "Employee State Insurance"
      },
      { 
        label: "PAN", 
        value: formData.pan_number,
        description: "Permanent Account Number"
      },
    ];

    const completedCount = items.filter(item => item.value).length;
    const totalCount = items.length;
    const completionPercentage = Math.round((completedCount / totalCount) * 100);

    return (
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Compliance Status
          </CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} items completed ({completionPercentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div 
                key={item.label}
                className={`p-3 rounded-lg border-2 transition-all ${
                  item.value 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-600">{item.label}</p>
                  {item.value ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
        <Shield className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        No Statutory Details
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        Statutory compliance information has not been added yet. Add details to ensure proper compliance tracking.
      </p>
      <Button
        onClick={() => setIsEditing(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        <Edit className="h-4 w-4 mr-2" />
        Add Statutory Details
      </Button>
    </div>
  );

  if (!statutory && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Statutory Compliance
              </CardTitle>
              <CardDescription>
                PF, ESI, PAN and other statutory information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card with Quick Stats */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Statutory Compliance
              </CardTitle>
              <CardDescription className="text-slate-600">
                Provident Fund, ESI, and taxation details
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="bg-white hover:bg-slate-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={updateStatutory.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateStatutory.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={updateStatutory.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Compliance Status Overview */}
      {!isEditing && <ComplianceStatusCard />}

      {/* Provident Fund Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Provident Fund (PF)
              </CardTitle>
              <CardDescription>Employee Provident Fund Organisation details</CardDescription>
            </div>
            {!isEditing && (
              formData.pf_applicable ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Applicable
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Applicable
                </Badge>
              )
            )}
          </div>
        </CardHeader>

        <CardContent>
          {!isEditing ? (
            formData.pf_applicable && (
              <>
                <div className="space-y-0">
                  <InfoRow
                    label="Universal Account Number (UAN)"
                    value={formData.uan}
                    verified={formData.uan_verified}
                    icon={FileText}
                  />
                  <InfoRow
                    label="PF Account Number"
                    value={formData.pf_number}
                    icon={FileText}
                  />
                  <InfoRow
                    label="PF Contribution Wage Restriction"
                    value={
                      formData.restrict_pf_wages
                        ? "Restricted - Capped at ₹15,000"
                        : "Unrestricted - Full Basic + DA"
                    }
                    icon={Info}
                  />
                </div>
                
                {formData.restrict_pf_wages && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-900">
                        PF contribution is calculated on wages capped at ₹15,000 per month as per EPFO regulations.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            <div className="space-y-4">
              {/* PF Applicable Switch */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="pf-applicable" className="text-sm font-medium cursor-pointer">
                  Provident Fund Applicable
                </Label>
                <Switch
                  id="pf-applicable"
                  checked={formData.pf_applicable}
                  onCheckedChange={(checked) => handleInputChange('pf_applicable', checked)}
                />
              </div>

              {formData.pf_applicable && (
                <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                  {/* UAN Number */}
                  <div className="space-y-2">
                    <Label htmlFor="uan">Universal Account Number (UAN)</Label>
                    <Input
                      id="uan"
                      value={formData.uan}
                      onChange={(e) => handleInputChange('uan', e.target.value.replace(/\D/g, ''))}
                      placeholder="123456789012"
                      maxLength={12}
                      className={errors.uan ? "border-red-500" : ""}
                    />
                    {errors.uan && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.uan}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">12-digit number</p>
                  </div>

                  {/* PF Number */}
                  <div className="space-y-2">
                    <Label htmlFor="pf_number">PF Account Number *</Label>
                    <Input
                      id="pf_number"
                      value={formData.pf_number}
                      onChange={(e) => handleInputChange('pf_number', e.target.value.toUpperCase())}
                      placeholder="MH/MUM/12345/678/9012345"
                      className={errors.pf_number ? "border-red-500" : ""}
                    />
                    {errors.pf_number && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.pf_number}
                      </p>
                    )}
                  </div>

                  {/* Restrict PF Wages */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label htmlFor="restrict-pf" className="text-sm cursor-pointer">
                      Restrict PF contribution to ₹15,000 ceiling
                    </Label>
                    <Switch
                      id="restrict-pf"
                      checked={formData.restrict_pf_wages}
                      onCheckedChange={(checked) => handleInputChange('restrict_pf_wages', checked)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee State Insurance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Employee State Insurance (ESI)
              </CardTitle>
              <CardDescription>ESIC medical and social security benefits</CardDescription>
            </div>
            {!isEditing && (
              formData.esi_applicable ? (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Applicable
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Applicable
                </Badge>
              )
            )}
          </div>
        </CardHeader>

        <CardContent>
          {!isEditing ? (
            formData.esi_applicable && (
              <>
                <div className="space-y-0">
                  <InfoRow
                    label="ESI Number"
                    value={formData.esi_number}
                    verified={formData.esi_verified}
                    icon={FileText}
                  />
                  <InfoRow
                    label="ESI Dispensary"
                    value={formData.esi_dispensary}
                    icon={Building2}
                  />
                </div>

                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-900">
                      ESI provides medical, cash, maternity, and disablement benefits to employees earning up to ₹21,000 per month.
                    </p>
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="space-y-4">
              {/* ESI Applicable Switch */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="esi-applicable" className="text-sm font-medium cursor-pointer">
                  ESI Applicable
                </Label>
                <Switch
                  id="esi-applicable"
                  checked={formData.esi_applicable}
                  onCheckedChange={(checked) => handleInputChange('esi_applicable', checked)}
                />
              </div>

              {formData.esi_applicable && (
                <div className="space-y-4 pl-6 border-l-2 border-purple-200">
                  {/* ESI Number */}
                  <div className="space-y-2">
                    <Label htmlFor="esi_number">ESI Number *</Label>
                    <Input
                      id="esi_number"
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
                    <p className="text-xs text-muted-foreground">17-digit number</p>
                  </div>

                  {/* ESI Dispensary */}
                  <div className="space-y-2">
                    <Label htmlFor="esi_dispensary">ESI Dispensary</Label>
                    <Input
                      id="esi_dispensary"
                      value={formData.esi_dispensary}
                      onChange={(e) => handleInputChange('esi_dispensary', e.target.value)}
                      placeholder="Name and location of ESI dispensary"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax & Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Tax & Identification
          </CardTitle>
          <CardDescription>PAN, Aadhaar and other identification details</CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-0">
              <InfoRow 
                label="PAN Number" 
                value={formData.pan_number} 
                icon={CreditCard}
              />
              <InfoRow 
                label="Aadhaar Number" 
                value={formData.aadhar_number}
                icon={CreditCard}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* PAN Number */}
              <div className="space-y-2">
                <Label htmlFor="pan_number">PAN Number</Label>
                <Input
                  id="pan_number"
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
                <p className="text-xs text-muted-foreground">Format: 5 letters, 4 numbers, 1 letter</p>
              </div>

              {/* Aadhaar Number */}
              <div className="space-y-2">
                <Label htmlFor="aadhar_number">Aadhaar Number</Label>
                <Input
                  id="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={(e) => handleInputChange('aadhar_number', e.target.value.replace(/\D/g, ''))}
                  placeholder="123456789012"
                  maxLength={12}
                  className={errors.aadhar_number ? "border-red-500" : ""}
                />
                {errors.aadhar_number && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.aadhar_number}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">12-digit unique identification number</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Settings */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-600" />
              Other Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="gratuity" className="text-sm cursor-pointer">
                Gratuity Applicable
              </Label>
              <Switch
                id="gratuity"
                checked={formData.gratuity_applicable}
                onCheckedChange={(checked) => handleInputChange('gratuity_applicable', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guidelines */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Statutory Compliance Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>PF is mandatory for employees with salary ≤ ₹15,000</li>
                <li>ESI is applicable for employees with salary ≤ ₹21,000</li>
                <li>Gratuity is applicable after 5 years of service</li>
                <li>PAN is mandatory for all employees for income tax purposes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}