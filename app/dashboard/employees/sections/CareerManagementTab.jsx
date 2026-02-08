"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  Building,
  ArrowRight,
  FileText,
  CheckCircle2,
  XCircle,
  Info,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  MapPin,
  Briefcase,
  Clock
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { User, Download, Upload } from "lucide-react";

export default function CareerManagementTab({ employee, employeeId }) {
  const [activeTab, setActiveTab] = useState("promotions");
  const queryClient = useQueryClient();

  // Dialog states
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  
  // ✅ NEW: Transfer type selection state
  const [transferTypeSelectionOpen, setTransferTypeSelectionOpen] = useState(false);
  const [selectedTransferType, setSelectedTransferType] = useState(null);

  // Form data states
  const [promotionForm, setPromotionForm] = useState({
    old_designation_id: "",
    new_designation_id: "",
    effective_date: "",
    salary_structure_id: "",
    promotion_type: "vertical",
    reason: "",
    justification: "",
    notes: ""
  });

  const [transferForm, setTransferForm] = useState({
    old_department_id: "",
    new_department_id: "",
    old_location_id: "",
    new_location_id: "",
    effective_date: "",
    reason: ""
  });

  const [warningAttachments, setWarningAttachments] = useState([]);

  // REPLACE existing warningForm with:
  const [warningForm, setWarningForm] = useState({
    type: "written",
    severity: "medium",
    category: "conduct",
    subject: "",
    description: "",
    issued_date: "",
    expiry_date: "",
    action_taken: "",
  });

  const [errors, setErrors] = useState({});

  // Auto-fill old designation when dialog opens
  useEffect(() => {
    if (promotionDialogOpen && employee?.designation_id) {
      setPromotionForm(prev => ({
        ...prev,
        old_designation_id: employee.designation_id.toString()
      }));
    }
  }, [promotionDialogOpen, employee?.designation_id]);

  // ✅ NEW: Auto-fill transfer values based on selected type
  useEffect(() => {
    if (transferDialogOpen && employee && selectedTransferType) {
      const newForm = {
        old_department_id: employee.department_id?.toString() || "",
        new_department_id: "",
        old_location_id: employee.location_id?.toString() || "",
        new_location_id: "",
        effective_date: "",
        reason: ""
      };

      // Pre-fill based on transfer type
      if (selectedTransferType === 'department') {
        newForm.old_location_id = employee.location_id?.toString() || "";
        newForm.new_location_id = employee.location_id?.toString() || ""; // Keep same location
      } else if (selectedTransferType === 'location') {
        newForm.old_department_id = employee.department_id?.toString() || "";
        newForm.new_department_id = employee.department_id?.toString() || ""; // Keep same department
      }

      setTransferForm(newForm);
    }
  }, [transferDialogOpen, employee, selectedTransferType]);

  // Fetch data with loading states
  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ["promotions", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/promotions`);
      return response.data?.data || [];
    },
  });

  const { data: transfers, isLoading: transfersLoading } = useQuery({
    queryKey: ["transfers", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/transfers`);
      return response.data?.data || [];
    },
  });

  const { data: warnings, isLoading: warningsLoading } = useQuery({
    queryKey: ["warnings", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/warnings`);
      return response.data?.data || [];
    },
  });

  // Fetch reference data for dropdowns
  const { data: designations } = useQuery({
    queryKey: ["designations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/designations");
      return response.data?.data || [];
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/departments");
      return response.data?.data || [];
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/locations");
      return response.data?.data || [];
    },
  });

  const { data: salaryStructures } = useQuery({
    queryKey: ["salaryStructures", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/salary-structures`);
      return response.data?.data || [];
    },
  });
  const { data: warningReferenceData } = useQuery({
    queryKey: ["warningReferenceData"],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/warnings/reference-data`);
      return response.data?.data || {};
    },
  });
  // Filter designations
  const availableDesignationsForPromotion = designations?.filter(
    (designation) => designation.id.toString() !== promotionForm.old_designation_id
  ) || [];

  // Mutations
  const createPromotion = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/promotions`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Promotion added successfully");
      setPromotionDialogOpen(false);
      setPromotionForm({
        old_designation_id: "",
        new_designation_id: "",
        effective_date: "",
        salary_structure_id: "",
        promotion_type: "vertical",
        reason: "",
        justification: "",
        notes: ""
      });
      setErrors({});
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to add promotion";
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) setErrors(validationErrors);
      toast.error(message);
    },
  });

  const createTransfer = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/transfers`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Transfer added successfully");
      setTransferDialogOpen(false);
      setSelectedTransferType(null);
      setTransferForm({
        old_department_id: "",
        new_department_id: "",
        old_location_id: "",
        new_location_id: "",
        effective_date: "",
        reason: ""
      });
      setErrors({});
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to add transfer";
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) setErrors(validationErrors);
      toast.error(message);
    },
  });

  

  const deletePromotion = useMutation({
    mutationFn: async (promotionId) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/promotions/${promotionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions", employeeId] });
      toast.success("Promotion deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete promotion");
    },
  });

  const deleteTransfer = useMutation({
    mutationFn: async (transferId) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/transfers/${transferId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers", employeeId] });
      toast.success("Transfer deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete transfer");
    },
  });

  const createWarning = useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(
        `/api/v1/employees/${employeeId}/warnings`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnings", employeeId] });
      toast.success("Warning issued successfully");
      setWarningDialogOpen(false);
      setWarningForm({
        type: "written",
        severity: "medium",
        category: "conduct",
        subject: "",
        description: "",
        issued_date: "",
        expiry_date: "",
        action_taken: "",
      });
      setWarningAttachments([]);
      setErrors({});
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to issue warning";
      toast.error(message);
    },
  });

  const acknowledgeWarning = useMutation({
    mutationFn: async ({ warningId, response }) => {
      const res = await apiClient.post(
        `/api/v1/employees/${employeeId}/warnings/${warningId}/acknowledge`,
        { employee_response: response }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnings", employeeId] });
      toast.success("Warning acknowledged successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to acknowledge warning");
    },
  });

  const revokeWarning = useMutation({
    mutationFn: async ({ warningId, reason }) => {
      const response = await apiClient.post(
        `/api/v1/employees/${employeeId}/warnings/${warningId}/revoke`,
        { reason }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnings", employeeId] });
      toast.success("Warning revoked successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to revoke warning");
    },
  });

  const deleteWarning = useMutation({
    mutationFn: async (warningId) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/warnings/${warningId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warnings", employeeId] });
      toast.success("Warning deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete warning");
    },
  });
  // Form handlers
  const handlePromotionSubmit = () => {
    const newErrors = {};
    if (!promotionForm.old_designation_id) newErrors.old_designation_id = "Current designation is required";
    if (!promotionForm.new_designation_id) newErrors.new_designation_id = "New designation is required";
    if (!promotionForm.effective_date) newErrors.effective_date = "Effective date is required";
    if (promotionForm.old_designation_id === promotionForm.new_designation_id) {
      newErrors.new_designation_id = "New designation must be different from current designation";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...promotionForm,
      old_designation_id: parseInt(promotionForm.old_designation_id),
      new_designation_id: parseInt(promotionForm.new_designation_id),
      ...(promotionForm.salary_structure_id && promotionForm.salary_structure_id !== "none" 
        ? { salary_structure_id: parseInt(promotionForm.salary_structure_id) }
        : {}
      )
    };

    createPromotion.mutate(payload);
  };

  // ✅ IMPROVED: Transfer submission with better validation
  const handleTransferSubmit = () => {
    const newErrors = {};
    
    // Validate based on transfer type
    if (selectedTransferType === 'department') {
      if (!transferForm.new_department_id) {
        newErrors.new_department_id = "New department is required";
      } else if (transferForm.new_department_id === transferForm.old_department_id) {
        newErrors.new_department_id = "New department must be different from current";
      }
    } else if (selectedTransferType === 'location') {
      if (!transferForm.new_location_id) {
        newErrors.new_location_id = "New location is required";
      } else if (transferForm.new_location_id === transferForm.old_location_id) {
        newErrors.new_location_id = "New location must be different from current";
      }
    } else if (selectedTransferType === 'complete') {
      if (!transferForm.new_department_id && !transferForm.new_location_id) {
        newErrors.general = "At least department or location change is required";
      }
      if (transferForm.new_department_id === transferForm.old_department_id && 
          transferForm.new_location_id === transferForm.old_location_id) {
        newErrors.general = "At least one field must be different from current values";
      }
    }

    if (!transferForm.effective_date) {
      newErrors.effective_date = "Effective date is required";
    }

    if (!transferForm.reason || transferForm.reason.trim() === '') {
      newErrors.reason = "Reason is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ Build payload with backend field naming (from_*, to_*)
    const payload = {
      transfer_type: selectedTransferType,
      effective_date: transferForm.effective_date,
      reason: transferForm.reason.trim(),
      status: 'pending', // Explicitly set status
    };

    // ✅ CRITICAL: Use backend field names (from_* and to_*)
    // Add fields based on transfer type
    if (selectedTransferType === 'department') {
      // Department transfer: change department, keep location same
      if (transferForm.old_department_id) {
        payload.from_department_id = parseInt(transferForm.old_department_id);
      }
      if (transferForm.new_department_id) {
        payload.to_department_id = parseInt(transferForm.new_department_id);
      }
      // Keep location same by sending current location as both from and to
      if (transferForm.old_location_id) {
        payload.from_location_id = parseInt(transferForm.old_location_id);
        payload.to_location_id = parseInt(transferForm.old_location_id); // Same location
      }
    } else if (selectedTransferType === 'location') {
      // Location transfer: change location, keep department same
      if (transferForm.old_location_id) {
        payload.from_location_id = parseInt(transferForm.old_location_id);
      }
      if (transferForm.new_location_id) {
        payload.to_location_id = parseInt(transferForm.new_location_id);
      }
      // Keep department same by sending current department as both from and to
      if (transferForm.old_department_id) {
        payload.from_department_id = parseInt(transferForm.old_department_id);
        payload.to_department_id = parseInt(transferForm.old_department_id); // Same department
      }
    } else if (selectedTransferType === 'complete') {
      // Complete transfer: change both
      if (transferForm.old_department_id) {
        payload.from_department_id = parseInt(transferForm.old_department_id);
      }
      if (transferForm.new_department_id) {
        payload.to_department_id = parseInt(transferForm.new_department_id);
      }
      if (transferForm.old_location_id) {
        payload.from_location_id = parseInt(transferForm.old_location_id);
      }
      if (transferForm.new_location_id) {
        payload.to_location_id = parseInt(transferForm.new_location_id);
      }
    }

    console.log('Transfer payload:', payload); // Debug log
    createTransfer.mutate(payload);
  };

  const handleWarningSubmit = () => {
    const newErrors = {};
    if (!warningForm.type) newErrors.type = "Warning type is required";
    if (!warningForm.severity) newErrors.severity = "Severity is required";
    if (!warningForm.category) newErrors.category = "Category is required";
    if (!warningForm.subject) newErrors.subject = "Subject is required";
    if (!warningForm.description) newErrors.description = "Description is required";
    if (!warningForm.issued_date) newErrors.issued_date = "Issue date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('type', warningForm.type);
    formData.append('severity', warningForm.severity);
    formData.append('category', warningForm.category);
    formData.append('subject', warningForm.subject);
    formData.append('description', warningForm.description);
    formData.append('issued_date', warningForm.issued_date);
    
    if (warningForm.expiry_date) {
      formData.append('expiry_date', warningForm.expiry_date);
    }
    if (warningForm.action_taken) {
      formData.append('action_taken', warningForm.action_taken);
    }

    warningAttachments.forEach((file) => {
      formData.append('attachments[]', file);
    });

    createWarning.mutate(formData);
  };

  const handleWarningAcknowledge = (warningId, response) => {
    acknowledgeWarning.mutate({ warningId, response });
  };

  const handleWarningRevoke = (warningId, reason) => {
    revokeWarning.mutate({ warningId, reason });
  };

  const handleWarningDownload = async (warningId, attachmentIndex) => {
    try {
      const response = await apiClient.get(
        `/api/v1/employees/${employeeId}/warnings/${warningId}/attachments/${attachmentIndex}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `warning-${warningId}-attachment-${attachmentIndex}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download attachment");
    }
  };

  // ✅ NEW: Handle transfer type selection
  const handleTransferTypeSelection = (type) => {
    setSelectedTransferType(type);
    setTransferTypeSelectionOpen(false);
    setTransferDialogOpen(true);
    setErrors({});
  };

  // Get current designation name for display
  const currentDesignationName = designations?.find(
    d => d.id.toString() === promotionForm.old_designation_id
  )?.name || employee?.designation?.name || "Current Designation";

  // ✅ NEW: Transfer type configuration
  const transferTypes = [
    {
      id: 'department',
      title: 'Department Transfer',
      description: 'Move employee to a different department',
      icon: Briefcase,
      color: 'blue',
      bgClass: 'bg-blue-50 hover:bg-blue-100',
      borderClass: 'border-blue-200 hover:border-blue-300',
      iconClass: 'text-blue-600'
    },
    {
      id: 'location',
      title: 'Location Transfer',
      description: 'Move employee to a different office/location',
      icon: MapPin,
      color: 'emerald',
      bgClass: 'bg-emerald-50 hover:bg-emerald-100',
      borderClass: 'border-emerald-200 hover:border-emerald-300',
      iconClass: 'text-emerald-600'
    },
    {
      id: 'complete',
      title: 'Complete Transfer',
      description: 'Change both department and location',
      icon: Building,
      color: 'purple',
      bgClass: 'bg-purple-50 hover:bg-purple-100',
      borderClass: 'border-purple-200 hover:border-purple-300',
      iconClass: 'text-purple-600'
    }
  ];

  // Career Summary Card Component
  const CareerSummaryCard = () => {
    const totalPromotions = promotions?.length || 0;
    const totalTransfers = transfers?.length || 0;
    const totalWarnings = warnings?.length || 0;
    
    const stats = [
      {
        label: "Promotions",
        value: totalPromotions,
        icon: TrendingUp,
        color: "emerald",
        bgClass: "bg-emerald-50",
        borderClass: "border-emerald-200",
        textClass: "text-emerald-700",
        iconClass: "text-emerald-600"
      },
      {
        label: "Transfers",
        value: totalTransfers,
        icon: Building,
        color: "blue",
        bgClass: "bg-blue-50",
        borderClass: "border-blue-200",
        textClass: "text-blue-700",
        iconClass: "text-blue-600"
      },
      {
        label: "Total Warnings",
        value: totalWarnings,
        icon: AlertTriangle,
        color: "amber",
        bgClass: "bg-amber-50",
        borderClass: "border-amber-200",
        textClass: "text-amber-700",
        iconClass: "text-amber-600"
      }
    ];

    return (
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-600" />
            Career Overview
          </CardTitle>
          <CardDescription>
            Summary of career progression and compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className={`p-4 rounded-lg border-2 transition-all ${stat.bgClass} ${stat.borderClass}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.iconClass}`} />
                  <span className={`text-2xl font-bold ${stat.textClass}`}>
                    {stat.value}
                  </span>
                </div>
                <p className={`text-xs font-medium ${stat.textClass}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Info Row Component
  const InfoRow = ({ label, value, icon: Icon, badge }) => (
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
      {badge && (
        <div className="flex-shrink-0">
          {badge}
        </div>
      )}
    </div>
  );

  // Empty State Component
  const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        {description}
      </p>
      <Button
        onClick={onAction}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        {actionLabel}
      </Button>
    </div>
  );

  // Promotion Card Component
  const PromotionCard = ({ promo }) => {
    const oldDesignationName = promo.old_designation?.name || promo.oldDesignation?.name || "N/A";
    const newDesignationName = promo.new_designation?.name || promo.newDesignation?.name || "N/A";
    const hasSalaryStructure = !!promo.salary_structure_id;

    const statusConfig = {
      draft: { color: 'gray', label: 'Draft', bgClass: 'bg-gray-50', textClass: 'text-gray-700' },
      pending: { color: 'yellow', label: 'Pending Approval', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700' },
      approved: { color: 'blue', label: 'Approved', bgClass: 'bg-blue-50', textClass: 'text-blue-700' },
      rejected: { color: 'red', label: 'Rejected', bgClass: 'bg-red-50', textClass: 'text-red-700' },
      implemented: { color: 'green', label: 'Implemented', bgClass: 'bg-green-50', textClass: 'text-green-700' },
      cancelled: { color: 'gray', label: 'Cancelled', bgClass: 'bg-gray-50', textClass: 'text-gray-700' }
    };

    const config = statusConfig[promo.status] || statusConfig.pending;

    return (
      <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <h4 className="font-semibold text-lg">
                    {newDesignationName}
                  </h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className={`${config.bgClass} ${config.textClass} border-${config.color}-200`}>
                    {config.label}
                  </Badge>
                  {hasSalaryStructure && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Salary Updated
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-0 bg-slate-50 rounded-lg p-3">
              <InfoRow
                label="Previous Designation"
                value={oldDesignationName}
                icon={FileText}
              />
              <InfoRow
                label="Effective Date"
                value={new Date(promo.effective_date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                icon={Calendar}
              />
              {promo.promotion_type && (
                <InfoRow
                  label="Promotion Type"
                  value={promo.promotion_type.charAt(0).toUpperCase() + promo.promotion_type.slice(1).replace('_', ' ')}
                  icon={Award}
                />
              )}
            </div>

            {promo.reason && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Reason</p>
                    <p className="text-sm text-blue-800">{promo.reason}</p>
                  </div>
                </div>
              </div>
            )}

            {promo.justification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex gap-2">
                  <FileText className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-emerald-900 mb-1">Business Justification</p>
                    <p className="text-sm text-emerald-800">{promo.justification}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ APPROVAL STATUS SECTION */}
            {promo.approval && promo.status === 'pending' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-900">Pending Approval</p>
                </div>
                <div className="space-y-2">
                  {promo.approval.steps?.slice(0, 3).map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 text-sm">
                      {step.status === 'approved' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : step.status === 'rejected' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-amber-400" />
                      )}
                      <span className={step.status === 'approved' ? 'text-green-700' : 'text-slate-600'}>
                        Step {step.step_order}: {step.approver?.name || 'Approver'}
                      </span>
                      {step.status === 'approved' && step.acted_at && (
                        <span className="text-xs text-green-600">
                          ✓ {new Date(step.acted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto text-amber-700"
                  onClick={() => window.location.href = `/dashboard/approvals/${promo.approval.id}`}
                >
                  View in Approval Inbox →
                </Button>
              </div>
            )}

            {/* Rejection Reason */}
            {promo.status === 'rejected' && promo.rejection_reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-800">{promo.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Promotion #{promo.id}
              </span>
              <div className="flex gap-2">
                {/* ✅ IMPLEMENT BUTTON - Only if approved */}
                {promo.status === 'approved' && !promo.implemented_at && (
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      if (confirm("This will update the employee's designation. Continue?")) {
                        apiClient.post(`/api/v1/employees/${employeeId}/promotions/${promo.id}/implement`)
                          .then(() => {
                            toast.success("Promotion implemented successfully");
                            queryClient.invalidateQueries({ queryKey: ["promotions", employeeId] });
                            queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
                          })
                          .catch((error) => {
                            toast.error(error.response?.data?.message || "Failed to implement promotion");
                          });
                      }
                    }}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Implement Promotion
                  </Button>
                )}

                {/* Delete button - only for draft/pending/rejected */}
                {['draft', 'pending', 'rejected'].includes(promo.status) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this promotion record?")) {
                        deletePromotion.mutate(promo.id);
                      }
                    }}
                    disabled={deletePromotion.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Transfer Card Component
  const TransferCard = ({ transfer }) => {
    const fromDeptName = transfer.from_department?.name || transfer.fromDepartment?.name;
    const toDeptName = transfer.to_department?.name || transfer.toDepartment?.name;
    const fromLocName = transfer.from_location?.name || transfer.fromLocation?.name;
    const toLocName = transfer.to_location?.name || transfer.toLocation?.name;
    const fromDesigName = transfer.from_designation?.name || transfer.fromDesignation?.name;
    const toDesigName = transfer.to_designation?.name || transfer.toDesignation?.name;

    const statusConfig = {
      draft: { color: 'gray', label: 'Draft', bgClass: 'bg-gray-50', textClass: 'text-gray-700' },
      pending: { color: 'yellow', label: 'Pending Approval', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700' },
      approved: { color: 'blue', label: 'Approved', bgClass: 'bg-blue-50', textClass: 'text-blue-700' },
      rejected: { color: 'red', label: 'Rejected', bgClass: 'bg-red-50', textClass: 'text-red-700' },
      implemented: { color: 'green', label: 'Implemented', bgClass: 'bg-green-50', textClass: 'text-green-700' },
      cancelled: { color: 'gray', label: 'Cancelled', bgClass: 'bg-gray-50', textClass: 'text-gray-700' }
    };

    const config = statusConfig[transfer.status] || statusConfig.pending;

    return (
      <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-lg">
                    {transfer.transfer_type?.replace('_', ' ').charAt(0).toUpperCase() + 
                    transfer.transfer_type?.slice(1).replace('_', ' ')} Transfer
                  </h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={`${config.bgClass} ${config.textClass} border-${config.color}-200`}
                  >
                    {config.label}
                  </Badge>
                  {transfer.is_permanent === false && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Temporary
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="space-y-0 bg-slate-50 rounded-lg p-3">
              {fromDeptName && toDeptName && (
                <>
                  <InfoRow label="From Department" value={fromDeptName} icon={Building} />
                  <InfoRow label="To Department" value={toDeptName} icon={Building} />
                </>
              )}
              {fromLocName && toLocName && (
                <>
                  <InfoRow label="From Location" value={fromLocName} icon={MapPin} />
                  <InfoRow label="To Location" value={toLocName} icon={MapPin} />
                </>
              )}
              {fromDesigName && toDesigName && (
                <>
                  <InfoRow label="From Designation" value={fromDesigName} icon={Award} />
                  <InfoRow label="To Designation" value={toDesigName} icon={Award} />
                </>
              )}
              <InfoRow
                label="Effective Date"
                value={new Date(transfer.effective_date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                icon={Calendar}
              />
              {transfer.temporary_end_date && (
                <InfoRow
                  label="Temporary Until"
                  value={new Date(transfer.temporary_end_date).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                  icon={Calendar}
                />
              )}
            </div>

            {/* Reason */}
            {transfer.reason && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Reason</p>
                    <p className="text-sm text-blue-800">{transfer.reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ APPROVAL STATUS SECTION */}
            {transfer.approval && transfer.status === 'pending' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-900">Pending Approval</p>
                </div>
                <div className="space-y-2">
                  {transfer.approval.steps?.slice(0, 3).map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 text-sm">
                      {step.status === 'approved' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : step.status === 'rejected' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-amber-400" />
                      )}
                      <span className={step.status === 'approved' ? 'text-green-700' : 'text-slate-600'}>
                        Step {step.step_order}: {step.approver?.name || 'Approver'}
                      </span>
                      {step.status === 'approved' && step.acted_at && (
                        <span className="text-xs text-green-600">
                          ✓ {new Date(step.acted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto text-amber-700"
                  onClick={() => window.location.href = `/dashboard/approvals/${transfer.approval.id}`}
                >
                  View in Approval Inbox →
                </Button>
              </div>
            )}

            {/* Rejection Reason */}
            {transfer.status === 'rejected' && transfer.rejection_reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-800">{transfer.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                Transfer #{transfer.id} • Requested by {transfer.requested_by_user?.name || 'Unknown'}
              </span>
              <div className="flex gap-2">
                {/* ✅ IMPLEMENT BUTTON - Only if approved and effective date passed */}
                {transfer.status === 'approved' && !transfer.implemented_at && (
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (confirm("This will apply the transfer changes to the employee record. Continue?")) {
                        // Call implement API
                        apiClient.post(`/api/v1/employees/${employeeId}/transfers/${transfer.id}/implement`)
                          .then(() => {
                            toast.success("Transfer implemented successfully");
                            queryClient.invalidateQueries({ queryKey: ["transfers", employeeId] });
                            queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
                          })
                          .catch((error) => {
                            toast.error(error.response?.data?.message || "Failed to implement transfer");
                          });
                      }
                    }}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Implement Transfer
                  </Button>
                )}

                {/* ✅ DELETE BUTTON - Only for draft/pending/rejected */}
                {['draft', 'pending', 'rejected'].includes(transfer.status) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this transfer record?")) {
                        deleteTransfer.mutate(transfer.id);
                      }
                    }}
                    disabled={deleteTransfer.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Warning Card Component
  const EnterpriseWarningCard = ({ warning }) => {
    const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false);
    const [showRevokeDialog, setShowRevokeDialog] = useState(false);
    const [acknowledgeResponse, setAcknowledgeResponse] = useState('');
    const [revokeReason, setRevokeReason] = useState('');

    // Severity configuration
    const severityConfig = {
      low: {
        color: 'yellow',
        label: 'Low',
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-300',
        textClass: 'text-yellow-800',
        iconClass: 'text-yellow-600',
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      },
      medium: {
        color: 'amber',
        label: 'Medium',
        bgClass: 'bg-amber-50',
        borderClass: 'border-amber-300',
        textClass: 'text-amber-800',
        iconClass: 'text-amber-600',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
      },
      high: {
        color: 'orange',
        label: 'High',
        bgClass: 'bg-orange-50',
        borderClass: 'border-orange-300',
        textClass: 'text-orange-800',
        iconClass: 'text-orange-600',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300'
      },
      critical: {
        color: 'red',
        label: 'Critical',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-300',
        textClass: 'text-red-800',
        iconClass: 'text-red-600',
        badgeClass: 'bg-red-100 text-red-800 border-red-300'
      }
    };

    const statusConfig = {
      active: { icon: AlertTriangle, label: 'Active', class: 'bg-red-100 text-red-800 border-red-300' },
      expired: { icon: Clock, label: 'Expired', class: 'bg-gray-100 text-gray-700 border-gray-300' },
      revoked: { icon: XCircle, label: 'Revoked', class: 'bg-blue-100 text-blue-700 border-blue-300' },
      appealed: { icon: FileText, label: 'Under Appeal', class: 'bg-purple-100 text-purple-700 border-purple-300' }
    };

    const severity = severityConfig[warning.severity] || severityConfig.medium;
    const status = statusConfig[warning.status] || statusConfig.active;
    const StatusIcon = status.icon;

    const daysUntilExpiry = warning.days_until_expiry;
    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;

    return (
      <>
        <Card className={`border-l-4 ${severity.borderClass} hover:shadow-lg transition-all`}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`h-5 w-5 ${severity.iconClass}`} />
                    <h4 className="font-bold text-lg text-slate-900">
                      {warning.subject || warning.type_label}
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                      {warning.type_label}
                    </Badge>
                    <Badge variant="outline" className={severity.badgeClass}>
                      <span className="font-semibold">●</span>
                      <span className="ml-1">{severity.label} Severity</span>
                    </Badge>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      {warning.category_label}
                    </Badge>
                    <Badge variant="outline" className={status.class}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    {warning.status === 'active' && (
                      warning.is_acknowledged ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Acknowledged
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending Acknowledgment
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                {/* Impact Score */}
                {warning.impact_score && (
                  <div className="flex flex-col items-center gap-1 bg-slate-50 rounded-lg p-3 border-2 border-slate-200">
                    <span className="text-xs text-slate-600 font-medium">Impact</span>
                    <span className={`text-2xl font-bold ${severity.textClass}`}>
                      {warning.impact_score}
                    </span>
                  </div>
                )}
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg border-2 ${severity.bgClass} ${severity.borderClass}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className={`h-4 w-4 ${severity.iconClass}`} />
                    <span className={`text-xs font-semibold ${severity.textClass}`}>Issued Date</span>
                  </div>
                  <p className={`text-sm font-medium ${severity.textClass}`}>
                    {new Date(warning.issued_date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>

                {warning.expiry_date && (
                  <div className={`p-3 rounded-lg border-2 ${isExpiringSoon ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className={`h-4 w-4 ${isExpiringSoon ? 'text-amber-600' : 'text-slate-600'}`} />
                      <span className={`text-xs font-semibold ${isExpiringSoon ? 'text-amber-800' : 'text-slate-700'}`}>
                        Expires On
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-800' : 'text-slate-700'}`}>
                      {new Date(warning.expiry_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                    {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                      <p className={`text-xs mt-1 ${isExpiringSoon ? 'text-amber-700' : 'text-slate-600'}`}>
                        {daysUntilExpiry} days remaining
                      </p>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-lg border-2 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-800">Issued By</span>
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    {warning.issued_by?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className={`p-4 rounded-lg border-2 ${severity.bgClass} ${severity.borderClass}`}>
                <div className="flex gap-2">
                  <FileText className={`h-5 w-5 ${severity.iconClass} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${severity.textClass} mb-2`}>
                      Description of Incident
                    </p>
                    <p className={`text-sm ${severity.textClass} whitespace-pre-wrap`}>
                      {warning.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Taken */}
              {warning.action_taken && (
                <div className="p-4 rounded-lg border-2 bg-emerald-50 border-emerald-200">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-emerald-800 mb-2">
                        Corrective Action Taken
                      </p>
                      <p className="text-sm text-emerald-700 whitespace-pre-wrap">
                        {warning.action_taken}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Response */}
              {warning.is_acknowledged && warning.employee_response && (
                <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
                  <div className="flex gap-2">
                    <User className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-800 mb-2">
                        Employee Response
                        <span className="ml-2 text-xs font-normal">
                          (Acknowledged on {new Date(warning.acknowledged_at).toLocaleDateString('en-IN')})
                        </span>
                      </p>
                      <p className="text-sm text-blue-700 whitespace-pre-wrap">
                        {warning.employee_response}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {warning.attachments && warning.attachments.length > 0 && (
                <div className="p-4 rounded-lg border-2 bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-slate-600" />
                    <p className="text-xs font-semibold text-slate-800">
                      Attachments ({warning.attachments.length})
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {warning.attachments.map((attachment, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWarningDownload(warning.id, idx)}
                        className="flex items-center gap-2 p-2 rounded border border-slate-300 hover:bg-slate-100 transition-colors text-left"
                      >
                        <FileText className="h-4 w-4 text-slate-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-slate-600">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-blue-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expiry Warning */}
              {isExpiringSoon && (
                <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-lg">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Warning Expiring Soon
                      </p>
                      <p className="text-xs text-amber-800 mt-1">
                        This warning will expire in {daysUntilExpiry} days and will no longer be active.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-200">
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Warning ID:</span> #{warning.id}
                  {warning.impact_score && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-medium">Impact Score:</span> {warning.impact_score}
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {warning.status === 'active' && !warning.is_acknowledged && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowAcknowledgeDialog(true)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  )}

                  {warning.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => setShowRevokeDialog(true)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Revoke
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this warning?')) {
                        deleteWarning.mutate(warning.id);
                      }
                    }}
                    disabled={deleteWarning.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledge Dialog */}
        <Dialog open={showAcknowledgeDialog} onOpenChange={setShowAcknowledgeDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Acknowledge Warning
              </DialogTitle>
              <DialogDescription>
                Acknowledge receipt and understanding of this disciplinary action
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className={`p-4 rounded-lg border-2 ${severity.bgClass} ${severity.borderClass}`}>
                <h4 className={`font-semibold ${severity.textClass} mb-2`}>
                  {warning.subject || warning.type_label}
                </h4>
                <p className={`text-sm ${severity.textClass}`}>{warning.description}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_response">Your Response (Optional)</Label>
                <Textarea
                  id="employee_response"
                  value={acknowledgeResponse}
                  onChange={(e) => setAcknowledgeResponse(e.target.value)}
                  placeholder="You may provide your explanation or response to this warning..."
                  rows={4}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Acknowledgment confirms you have received this warning</li>
                      <li>This does not necessarily mean you agree with it</li>
                      <li>Your acknowledgment will be timestamped</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAcknowledgeDialog(false);
                setAcknowledgeResponse('');
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleWarningAcknowledge(warning.id, acknowledgeResponse);
                setShowAcknowledgeDialog(false);
                setAcknowledgeResponse('');
              }} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Acknowledge Warning
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Revoke Dialog */}
        <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-blue-600" />
                Revoke Warning
              </DialogTitle>
              <DialogDescription>
                Permanently revoke this disciplinary action
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="revoke_reason">
                  Reason for Revocation <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="revoke_reason"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Provide a clear reason for revoking this warning..."
                  rows={4}
                  required
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-900">
                    Revoking will mark this warning as invalid and remove it from active records.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowRevokeDialog(false);
                setRevokeReason('');
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (revokeReason.trim()) {
                  handleWarningRevoke(warning.id, revokeReason);
                  setShowRevokeDialog(false);
                  setRevokeReason('');
                } else {
                  toast.error('Please provide a reason for revocation');
                }
              }} className="bg-blue-600 hover:bg-blue-700">
                <XCircle className="h-4 w-4 mr-2" />
                Revoke Warning
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Career Management
              </CardTitle>
              <CardDescription className="text-slate-600">
                Track promotions, transfers, and disciplinary records
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Career Summary */}
      <CareerSummaryCard />

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Promotions
            {promotions?.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {promotions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="transfers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Transfers
            {transfers?.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {transfers.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="warnings" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Warnings
            {warnings?.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {warnings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Promotions & Career Growth
                  </CardTitle>
                  <CardDescription>History of promotions and career progression</CardDescription>
                </div>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  onClick={() => setPromotionDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Promotion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {promotionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-4">Loading promotions...</p>
                </div>
              ) : promotions && promotions.length > 0 ? (
                <div className="space-y-4">
                  {promotions.map((promo) => (
                    <PromotionCard key={promo.id} promo={promo} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No Promotions Yet"
                  description="Track career growth by recording promotions and designation changes."
                  actionLabel="Record First Promotion"
                  onAction={() => setPromotionDialogOpen(true)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Transfers & Relocations
                  </CardTitle>
                  <CardDescription>History of department and location transfers</CardDescription>
                </div>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => setTransferTypeSelectionOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transfer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transfersLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-4">Loading transfers...</p>
                </div>
              ) : transfers && transfers.length > 0 ? (
                <div className="space-y-4">
                  {transfers.map((transfer) => (
                    <TransferCard key={transfer.id} transfer={transfer} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Building}
                  title="No Transfers Recorded"
                  description="Keep track of employee department and location changes."
                  actionLabel="Record First Transfer"
                  onAction={() => setTransferTypeSelectionOpen(true)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warnings Tab */}
        <TabsContent value="warnings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Warnings & Disciplinary Actions
                  </CardTitle>
                  <CardDescription>Disciplinary history and warnings</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                  onClick={() => setWarningDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Warning
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {warningsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-4">Loading warnings...</p>
                </div>
              ) : warnings && warnings.length > 0 ? (
                <div className="space-y-4">
                  {warnings.map((warning) => (
                    <EnterpriseWarningCard key={warning.id} warning={warning} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={CheckCircle2}
                  title="No Warnings on Record"
                  description="This employee has a clean disciplinary record. Warnings will appear here when issued."
                  actionLabel="Issue Warning"
                  onAction={() => setWarningDialogOpen(true)}
                />
              )}
            </CardContent>
          </Card>

          {warnings && warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-medium mb-1">Disciplinary Action Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-800">
                    <li>Verbal warnings should be documented for future reference</li>
                    <li>Written warnings typically remain active for 6-12 months</li>
                    <li>Multiple warnings may lead to suspension or termination</li>
                    <li>Ensure proper documentation and employee acknowledgment</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ✅ NEW: Transfer Type Selection Dialog */}
      <Dialog open={transferTypeSelectionOpen} onOpenChange={setTransferTypeSelectionOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building className="h-6 w-6 text-blue-600" />
              Select Transfer Type
            </DialogTitle>
            <DialogDescription>
              Choose the type of transfer you want to process for this employee
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            {transferTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTransferTypeSelection(type.id)}
                className={`
                  p-6 rounded-lg border-2 transition-all cursor-pointer
                  ${type.bgClass} ${type.borderClass}
                  hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full ${type.bgClass.replace('50', '100')}`}>
                    <type.icon className={`h-8 w-8 ${type.iconClass}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-base mb-1 ${type.iconClass.replace('600', '900')}`}>
                      {type.title}
                    </h3>
                    <p className={`text-sm ${type.iconClass.replace('600', '700')}`}>
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Current Employee Details:</p>
                <div className="space-y-1 text-blue-800">
                  <p>• Department: <strong>{employee?.department?.name || 'Not Set'}</strong></p>
                  <p>• Location: <strong>{employee?.location?.name || 'Not Set'}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ IMPROVED: Transfer Dialog - Context-aware based on selected type */}
      <Dialog open={transferDialogOpen} onOpenChange={(open) => {
        setTransferDialogOpen(open);
        if (!open) {
          setSelectedTransferType(null);
          setErrors({});
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTransferType === 'department' && <Briefcase className="h-5 w-5 text-blue-600" />}
              {selectedTransferType === 'location' && <MapPin className="h-5 w-5 text-emerald-600" />}
              {selectedTransferType === 'complete' && <Building className="h-5 w-5 text-purple-600" />}
              {selectedTransferType === 'department' && 'Department Transfer'}
              {selectedTransferType === 'location' && 'Location Transfer'}
              {selectedTransferType === 'complete' && 'Complete Transfer'}
            </DialogTitle>
            <DialogDescription>
              {selectedTransferType === 'department' && 'Move employee to a different department (location stays the same)'}
              {selectedTransferType === 'location' && 'Move employee to a different location (department stays the same)'}
              {selectedTransferType === 'complete' && 'Change both department and location for this employee'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Show current values */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Current Assignment
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 mb-1">Department</p>
                  <p className="font-medium text-slate-900">{employee?.department?.name || 'Not Set'}</p>
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Location</p>
                  <p className="font-medium text-slate-900">{employee?.location?.name || 'Not Set'}</p>
                </div>
              </div>
            </div>

            {/* Department Transfer Fields */}
            {(selectedTransferType === 'department' || selectedTransferType === 'complete') && (
              <div className="space-y-2">
                <Label htmlFor="new_department_id">
                  New Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={transferForm.new_department_id}
                  onValueChange={(value) => {
                    setTransferForm({ ...transferForm, new_department_id: value });
                    if (errors.new_department_id) setErrors({ ...errors, new_department_id: null });
                  }}
                >
                  <SelectTrigger 
                    id="new_department_id"
                    className={errors.new_department_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select new department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.filter(d => d.id !== employee?.department_id).map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.new_department_id && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.new_department_id}
                  </p>
                )}
              </div>
            )}

            {/* Location Transfer Fields */}
            {(selectedTransferType === 'location' || selectedTransferType === 'complete') && (
              <div className="space-y-2">
                <Label htmlFor="new_location_id">
                  New Location {selectedTransferType === 'location' && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={transferForm.new_location_id}
                  onValueChange={(value) => {
                    setTransferForm({ ...transferForm, new_location_id: value });
                    if (errors.new_location_id) setErrors({ ...errors, new_location_id: null });
                  }}
                >
                  <SelectTrigger 
                    id="new_location_id"
                    className={errors.new_location_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select new location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.filter(l => l.id !== employee?.location_id).map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {loc.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.new_location_id && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.new_location_id}
                  </p>
                )}
              </div>
            )}

            {/* General error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.general}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="transfer_effective_date">
                Effective Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transfer_effective_date"
                type="date"
                value={transferForm.effective_date}
                onChange={(e) => {
                  setTransferForm({ ...transferForm, effective_date: e.target.value });
                  if (errors.effective_date) setErrors({ ...errors, effective_date: null });
                }}
                className={errors.effective_date ? "border-red-500" : ""}
              />
              {errors.effective_date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.effective_date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer_reason">
                Reason for Transfer <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="transfer_reason"
                value={transferForm.reason}
                onChange={(e) => {
                  setTransferForm({ ...transferForm, reason: e.target.value });
                  if (errors.reason) setErrors({ ...errors, reason: null });
                }}
                placeholder="e.g., Project requirement, employee request, organizational restructuring..."
                rows={3}
                className={errors.reason ? "border-red-500" : ""}
              />
              {errors.reason && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.reason}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTransferDialogOpen(false);
                setSelectedTransferType(null);
                setErrors({});
              }}
              disabled={createTransfer.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferSubmit}
              disabled={createTransfer.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {createTransfer.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Process Transfer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Promotion Dialog - keeping existing implementation */}
      <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Add Promotion
            </DialogTitle>
            <DialogDescription>
              Record a new promotion for this employee
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="old_designation_id">
                  Current Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="old_designation_id"
                  value={currentDesignationName}
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-filled from employee record
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_designation_id">
                  New Designation <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={promotionForm.new_designation_id}
                  onValueChange={(value) => {
                    setPromotionForm({ ...promotionForm, new_designation_id: value });
                    if (errors.new_designation_id) setErrors({ ...errors, new_designation_id: null });
                  }}
                >
                  <SelectTrigger 
                    id="new_designation_id"
                    className={errors.new_designation_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select new designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDesignationsForPromotion.length > 0 ? (
                      availableDesignationsForPromotion.map((designation) => (
                        <SelectItem key={designation.id} value={designation.id.toString()}>
                          {designation.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No other designations available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.new_designation_id && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.new_designation_id}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Note: Only designations different from current are shown
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promotion_effective_date">
                  Effective Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="promotion_effective_date"
                  type="date"
                  value={promotionForm.effective_date}
                  onChange={(e) => {
                    setPromotionForm({ ...promotionForm, effective_date: e.target.value });
                    if (errors.effective_date) setErrors({ ...errors, effective_date: null });
                  }}
                  className={errors.effective_date ? "border-red-500" : ""}
                />
                {errors.effective_date && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.effective_date}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="promotion_type">Promotion Type</Label>
                <Select
                  value={promotionForm.promotion_type}
                  onValueChange={(value) => setPromotionForm({ ...promotionForm, promotion_type: value })}
                >
                  <SelectTrigger id="promotion_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical (Higher Level)</SelectItem>
                    <SelectItem value="horizontal">Horizontal (Different Role)</SelectItem>
                    <SelectItem value="grade_change">Grade Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_structure_id">
                Link to Salary Structure (Optional)
              </Label>
              <Select
                value={promotionForm.salary_structure_id || "none"}
                onValueChange={(value) => {
                  setPromotionForm({ 
                    ...promotionForm, 
                    salary_structure_id: value === "none" ? "" : value 
                  });
                }}
              >
                <SelectTrigger id="salary_structure_id">
                  <SelectValue placeholder="Select salary structure if salary changes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No salary change</SelectItem>
                  {salaryStructures?.map((structure) => (
                    <SelectItem key={structure.id} value={structure.id.toString()}>
                      ₹{structure.gross_salary?.toLocaleString('en-IN')} (Effective: {structure.effective_from})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a salary structure if this promotion includes a salary change
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion_reason">Reason for Promotion</Label>
              <Textarea
                id="promotion_reason"
                value={promotionForm.reason}
                onChange={(e) => setPromotionForm({ ...promotionForm, reason: e.target.value })}
                placeholder="e.g., Exceptional performance, completed certifications, increased responsibilities..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion_justification">Business Justification</Label>
              <Textarea
                id="promotion_justification"
                value={promotionForm.justification}
                onChange={(e) => setPromotionForm({ ...promotionForm, justification: e.target.value })}
                placeholder="Provide business case for this promotion..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion_notes">Additional Notes</Label>
              <Textarea
                id="promotion_notes"
                value={promotionForm.notes}
                onChange={(e) => setPromotionForm({ ...promotionForm, notes: e.target.value })}
                placeholder="Any additional context or notes..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPromotionDialogOpen(false);
                setErrors({});
              }}
              disabled={createPromotion.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePromotionSubmit}
              disabled={createPromotion.isPending}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              {createPromotion.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Promotion
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

       {/* // ========================================
      // ENHANCED WARNING DIALOG - REPLACE EXISTING WARNING DIALOG WITH THIS
      // ========================================  */}

      <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              Issue Disciplinary Warning
            </DialogTitle>
            <DialogDescription>
              Document a comprehensive disciplinary action with full details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Warning Type & Severity Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warning_type">
                  Warning Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={warningForm.type}
                  onValueChange={(value) => {
                    setWarningForm({ ...warningForm, type: value });
                    if (errors.type) setErrors({ ...errors, type: null });
                  }}
                >
                  <SelectTrigger 
                    id="warning_type"
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select warning type" />
                  </SelectTrigger>
                  <SelectContent>
                    {warningReferenceData?.types && Object.entries(warningReferenceData.types).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.type}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="warning_severity">
                  Severity Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={warningForm.severity}
                  onValueChange={(value) => {
                    setWarningForm({ ...warningForm, severity: value });
                    if (errors.severity) setErrors({ ...errors, severity: null });
                  }}
                >
                  <SelectTrigger 
                    id="warning_severity"
                    className={errors.severity ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {warningReferenceData?.severities && Object.entries(warningReferenceData.severities).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            key === 'low' ? 'bg-yellow-500' :
                            key === 'medium' ? 'bg-amber-500' :
                            key === 'high' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.severity && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.severity}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="warning_category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={warningForm.category}
                onValueChange={(value) => {
                  setWarningForm({ ...warningForm, category: value });
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
              >
                <SelectTrigger 
                  id="warning_category"
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {warningReferenceData?.categories && Object.entries(warningReferenceData.categories).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="warning_subject">
                Subject / Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="warning_subject"
                value={warningForm.subject}
                onChange={(e) => {
                  setWarningForm({ ...warningForm, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: null });
                }}
                placeholder="Brief summary of the incident (e.g., 'Unauthorized Absence on Jan 15, 2024')"
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issued_date">
                  Issue Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="issued_date"
                  type="date"
                  value={warningForm.issued_date}
                  onChange={(e) => {
                    setWarningForm({ ...warningForm, issued_date: e.target.value });
                    if (errors.issued_date) setErrors({ ...errors, issued_date: null });
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className={errors.issued_date ? "border-red-500" : ""}
                />
                {errors.issued_date && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.issued_date}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">
                  Expiry Date (Optional)
                </Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={warningForm.expiry_date}
                  onChange={(e) => setWarningForm({ ...warningForm, expiry_date: e.target.value })}
                  min={warningForm.issued_date || new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Auto-calculated if left empty based on warning type
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="warning_description">
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="warning_description"
                value={warningForm.description}
                onChange={(e) => {
                  setWarningForm({ ...warningForm, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
                placeholder="Provide a comprehensive description of the incident, including date, time, location, witnesses, and specific behaviors or actions..."
                rows={6}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.description}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Be specific and factual. Avoid subjective language.</span>
                <span>{warningForm.description.length} / 2000</span>
              </div>
            </div>

            {/* Action Taken */}
            <div className="space-y-2">
              <Label htmlFor="action_taken">
                Corrective Action Taken (Optional)
              </Label>
              <Textarea
                id="action_taken"
                value={warningForm.action_taken}
                onChange={(e) => setWarningForm({ ...warningForm, action_taken: e.target.value })}
                placeholder="Describe any immediate corrective actions, counseling provided, or expectations for future behavior..."
                rows={4}
              />
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <Label htmlFor="attachments">
                Supporting Documents (Optional)
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-8 w-8 text-slate-400" />
                  <div className="text-center">
                    <Label
                      htmlFor="attachments"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Click to upload
                    </Label>
                    <span className="text-sm text-muted-foreground"> or drag and drop</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG, DOC (max 5MB each, up to 5 files)
                    </p>
                  </div>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + warningAttachments.length > 5) {
                        toast.error('Maximum 5 attachments allowed');
                        return;
                      }
                      const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
                      if (validFiles.length !== files.length) {
                        toast.error('Some files exceed 5MB limit');
                      }
                      setWarningAttachments([...warningAttachments, ...validFiles]);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Show selected files */}
              {warningAttachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium text-slate-700">
                    Selected Files ({warningAttachments.length})
                  </p>
                  <div className="space-y-2">
                    {warningAttachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-slate-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700 truncate">{file.name}</span>
                          <span className="text-xs text-slate-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setWarningAttachments(warningAttachments.filter((_, i) => i !== idx));
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-2">Important Reminders:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure all facts are accurate and verified</li>
                    <li>Employee acknowledgment will be required</li>
                    <li>This warning will be permanently recorded in the employee's file</li>
                    <li>Follow company policy for progressive discipline</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setWarningDialogOpen(false);
                setWarningAttachments([]);
                setErrors({});
              }}
              disabled={createWarning.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWarningSubmit}
              disabled={createWarning.isPending}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            >
              {createWarning.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Issuing Warning...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Issue Warning
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}