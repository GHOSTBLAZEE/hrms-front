"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Save, X, CreditCard, Building, Trash2, Star, AlertCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function BankingPayrollTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  // Fetch bank details
  const { data: bankDetailsData } = useQuery({
    queryKey: ["bankDetails", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/bank-details`);
      return response.data.data;
    },
  });

  const bankDetails = bankDetailsData || [];
  const primaryBank = bankDetails.find(b => b.is_primary);

  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    account_type: "savings",
    is_primary: false,
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && primaryBank) {
      setFormData({
        account_holder_name: primaryBank.account_holder_name || "",
        account_number: primaryBank.account_number || "",
        bank_name: primaryBank.bank_name || "",
        branch_name: primaryBank.branch_name || "",
        ifsc_code: primaryBank.ifsc_code || "",
        account_type: primaryBank.account_type || "savings",
        is_primary: primaryBank.is_primary || false,
        notes: primaryBank.notes || "",
      });
      setEditingId(primaryBank.id);
    }
  }, [isEditing, primaryBank]);

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.account_holder_name) {
      newErrors.account_holder_name = "Account holder name is required";
    }

    if (!formData.account_number) {
      newErrors.account_number = "Account number is required";
    }

    if (!formData.bank_name) {
      newErrors.bank_name = "Bank name is required";
    }

    if (!formData.ifsc_code) {
      newErrors.ifsc_code = "IFSC code is required";
    } else if (!validateIFSC(formData.ifsc_code)) {
      newErrors.ifsc_code = "Invalid IFSC format (e.g., HDFC0001234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create bank detail
  const createBankDetail = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/bank-details`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankDetails", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Bank detail added successfully");
      resetForm();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to add bank detail";
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        setErrors(validationErrors);
      }
      
      toast.error(message);
    },
  });

  // Update bank detail
  const updateBankDetail = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}/bank-details/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankDetails", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Bank detail updated successfully");
      resetForm();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update bank detail";
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        setErrors(validationErrors);
      }
      
      toast.error(message);
    },
  });

  // Delete bank detail
  const deleteBankDetail = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/api/v1/employees/${employeeId}/bank-details/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankDetails", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Bank detail deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete bank detail");
    },
  });

  // Set primary bank detail
  const setPrimary = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}/bank-details/${id}/set-primary`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankDetails", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Primary bank detail updated");
    },
  });

  const handleSave = () => {
    if (validateForm()) {
      if (editingId) {
        updateBankDetail.mutate({ id: editingId, data: formData });
      } else {
        createBankDetail.mutate(formData);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      account_holder_name: "",
      account_number: "",
      bank_name: "",
      branch_name: "",
      ifsc_code: "",
      account_type: "savings",
      is_primary: false,
      notes: "",
    });
    setEditingId(null);
    setIsEditing(false);
    setIsAdding(false);
    setErrors({});
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const isPending = createBankDetail.isPending || updateBankDetail.isPending;

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
          {!isEditing && !isAdding ? (
            <div className="flex gap-2">
              {primaryBank && (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button onClick={() => setIsAdding(true)} size="sm">
                Add Bank Account
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isPending ? "Saving..." : "Save"}
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm" disabled={isPending}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing && !isAdding ? (
          <div className="space-y-6">
            {primaryBank ? (
              <div className="space-y-0">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">Primary Account</span>
                </div>
                <InfoRow label="Account Holder Name" value={primaryBank.account_holder_name} icon={Building} />
                <InfoRow label="Bank Name" value={primaryBank.bank_name} icon={Building} />
                <InfoRow 
                  label="Account Number" 
                  value={primaryBank.masked_account_number || primaryBank.account_number} 
                  icon={CreditCard} 
                />
                <InfoRow label="IFSC Code" value={primaryBank.ifsc_code} icon={CreditCard} />
                <InfoRow label="Branch" value={primaryBank.branch_name} icon={Building} />
                <InfoRow label="Account Type" value={primaryBank.account_type?.toUpperCase()} icon={CreditCard} />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No bank details added yet</p>
                <Button onClick={() => setIsAdding(true)} className="mt-4">
                  Add Bank Account
                </Button>
              </div>
            )}

            {/* All bank accounts */}
            {bankDetails.length > 1 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4">All Bank Accounts</h4>
                <div className="space-y-3">
                  {bankDetails.map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {bank.is_primary && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        <div>
                          <p className="font-medium">{bank.bank_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {bank.masked_account_number || bank.account_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!bank.is_primary && (
                          <Button
                            onClick={() => setPrimary.mutate(bank.id)}
                            variant="ghost"
                            size="sm"
                          >
                            Set Primary
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteBankDetail.mutate(bank.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Account Holder Name *</Label>
                <Input
                  value={formData.account_holder_name}
                  onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                  placeholder="John Doe"
                  className={errors.account_holder_name ? "border-red-500" : ""}
                />
                {errors.account_holder_name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.account_holder_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Bank Name *</Label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => handleInputChange('bank_name', e.target.value)}
                  placeholder="HDFC Bank"
                  className={errors.bank_name ? "border-red-500" : ""}
                />
                {errors.bank_name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.bank_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Number *</Label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => handleInputChange('account_number', e.target.value)}
                  placeholder="1234567890"
                  className={errors.account_number ? "border-red-500" : ""}
                />
                {errors.account_number && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.account_number}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>IFSC Code *</Label>
                <Input
                  value={formData.ifsc_code}
                  onChange={(e) => handleInputChange('ifsc_code', e.target.value.toUpperCase())}
                  placeholder="HDFC0001234"
                  maxLength={11}
                  className={errors.ifsc_code ? "border-red-500" : ""}
                />
                {errors.ifsc_code && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ifsc_code}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Branch</Label>
                <Input
                  value={formData.branch_name}
                  onChange={(e) => handleInputChange('branch_name', e.target.value)}
                  placeholder="Mumbai Main"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Type *</Label>
                <Select
                  value={formData.account_type}
                  onValueChange={(value) => handleInputChange('account_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}