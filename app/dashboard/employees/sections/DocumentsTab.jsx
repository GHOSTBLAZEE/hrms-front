"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Upload, 
  Calendar,
  File,
  FileImage,
  FileSpreadsheet,
  Search,
  Filter,
  FolderOpen,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ Document type configuration with icons and colors
const DOCUMENT_TYPES = {
  "Resume": { icon: FileText, color: "blue", category: "recruitment" },
  "Offer Letter": { icon: FileText, color: "emerald", category: "onboarding" },
  "Appointment Letter": { icon: FileText, color: "purple", category: "onboarding" },
  "Employment Contract": { icon: FileText, color: "indigo", category: "legal" },
  "NDA": { icon: FileText, color: "red", category: "legal" },
  "ID Proof": { icon: FileImage, color: "amber", category: "identity" },
  "Address Proof": { icon: FileImage, color: "amber", category: "identity" },
  "Educational Certificate": { icon: FileText, color: "cyan", category: "academic" },
  "Experience Certificate": { icon: FileText, color: "teal", category: "academic" },
  "Resignation Letter": { icon: FileText, color: "orange", category: "exit" },
  "Relieving Letter": { icon: FileText, color: "slate", category: "exit" },
  "Payslip": { icon: FileSpreadsheet, color: "green", category: "payroll" },
  "Tax Documents": { icon: FileSpreadsheet, color: "violet", category: "tax" },
  "Performance Review": { icon: FileText, color: "pink", category: "performance" },
  "Warning Letter": { icon: FileText, color: "red", category: "disciplinary" },
  "Other": { icon: File, color: "gray", category: "misc" },
};

const CATEGORIES = {
  all: "All Documents",
  recruitment: "Recruitment",
  onboarding: "Onboarding",
  legal: "Legal & Contracts",
  identity: "Identity Proofs",
  academic: "Academic & Certificates",
  exit: "Exit Documents",
  payroll: "Payroll",
  tax: "Tax Documents",
  performance: "Performance",
  disciplinary: "Disciplinary",
  misc: "Miscellaneous",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export default function EnterpriseDocumentsTab({ employee, employeeId }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    document_type: "",
    description: "",
    file: null,
    expiry_date: "",
    document_number: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch documents
  const { data: documentsResponse, isLoading } = useQuery({
    queryKey: ["documents", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/documents`);
      return response.data?.data || [];
    },
  });

  const documents = documentsResponse || [];

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === "all" || 
      DOCUMENT_TYPES[doc.document_type]?.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      doc.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group documents by category
  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    const category = DOCUMENT_TYPES[doc.document_type]?.category || 'misc';
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {});

  // Upload mutation
  const uploadDocument = useMutation({
    mutationFn: async (formData) => {
      const response = await apiClient.post(
        `/api/v1/employees/${employeeId}/documents`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", employeeId] });
      toast.success("Document uploaded successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to upload document";
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) setErrors(validationErrors);
      toast.error(message);
    },
  });

  // Delete mutation
  const deleteDocument = useMutation({
    mutationFn: async (docId) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/documents/${docId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", employeeId] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete document");
    },
  });

  // Form handlers
  const resetForm = () => {
    setFormData({
      document_type: "",
      description: "",
      file: null,
      expiry_date: "",
      document_number: "",
    });
    setErrors({});
  };

  const validateFile = (file) => {
    if (!file) {
      return "File is required";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Only PDF, images, Word, and Excel files are allowed";
    }
    return null;
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setFormData({ ...formData, file });
    setErrors({ ...errors, file: null });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.document_type) newErrors.document_type = "Document type is required";
    if (!formData.file) newErrors.file = "File is required";
    
    const fileError = validateFile(formData.file);
    if (fileError) newErrors.file = fileError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append("document_type", formData.document_type);
    if (formData.description) data.append("description", formData.description);
    if (formData.expiry_date) data.append("expiry_date", formData.expiry_date);
    if (formData.document_number) data.append("document_number", formData.document_number);
    data.append("file", formData.file);
    
    uploadDocument.mutate(data);
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const response = await apiClient.get(
        `/api/v1/employees/${employeeId}/documents/${docId}/download`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `document-${docId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Document downloaded");
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  const handleView = async (docId) => {
    try {
      const response = await apiClient.get(
        `/api/v1/employees/${employeeId}/documents/${docId}/download`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
      
      toast.success("Opening document");
    } catch (error) {
      toast.error("Failed to open document");
    }
  };

  // Get file icon based on type
  const getFileIcon = (docType, mimeType) => {
    const config = DOCUMENT_TYPES[docType];
    if (config) return config.icon;
    
    if (mimeType?.includes('image')) return FileImage;
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return FileSpreadsheet;
    return FileText;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Document statistics
  const stats = {
    total: documents.length,
    recent: documents.filter(d => {
      const uploadDate = new Date(d.uploaded_at || d.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return uploadDate >= thirtyDaysAgo;
    }).length,
    expiringSoon: documents.filter(d => {
      if (!d.expiry_date) return false;
      const expiryDate = new Date(d.expiry_date);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
    }).length,
  };

  // Document Card Component
  const DocumentCard = ({ doc }) => {
    const config = DOCUMENT_TYPES[doc.document_type] || DOCUMENT_TYPES["Other"];
    const Icon = getFileIcon(doc.document_type, doc.mime_type);
    const isExpiringSoon = doc.expiry_date && new Date(doc.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date();

    return (
      <Card className={`group hover:shadow-lg transition-all border-l-4 border-l-${config.color}-500`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left Section - Icon & Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-lg bg-${config.color}-50 border-2 border-${config.color}-200 flex-shrink-0`}>
                <Icon className={`h-6 w-6 text-${config.color}-600`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="font-semibold text-base text-slate-900 truncate">
                    {doc.document_type}
                  </h4>
                  <Badge variant="outline" className={`bg-${config.color}-50 text-${config.color}-700 border-${config.color}-200 flex-shrink-0`}>
                    {CATEGORIES[config.category]}
                  </Badge>
                </div>

                {doc.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                {doc.document_number && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <FileText className="h-3 w-3" />
                    <span className="font-mono">{doc.document_number}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">
                      {new Date(doc.uploaded_at || doc.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <File className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatFileSize(doc.file_size)}</span>
                  </div>

                  {doc.uploaded_by && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{doc.uploaded_by.name}</span>
                    </div>
                  )}

                  {doc.expiry_date && (
                    <div className={`flex items-center gap-1.5 ${
                      isExpired ? 'text-red-600' : 
                      isExpiringSoon ? 'text-amber-600' : 
                      'text-slate-600'
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      <span className="truncate">
                        Expires: {new Date(doc.expiry_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {isExpiringSoon && !isExpired && (
                  <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-center gap-2 text-xs text-amber-800">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span className="font-medium">Expiring soon - Please renew</span>
                    </div>
                  </div>
                )}

                {isExpired && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 text-xs text-red-800">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span className="font-medium">Document expired</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleView(doc.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload(doc.id, doc.original_filename)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this document?")) {
                      deleteDocument.mutate(doc.id);
                    }
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
        <FolderOpen className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        No Documents Yet
      </h3>
      <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
        Upload employment documents, certificates, and important files to keep everything organized.
      </p>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Upload First Document
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-blue-600" />
                Document Management
              </CardTitle>
              <CardDescription className="text-slate-600">
                Centralized repository for all employment documents and certificates
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Documents</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Recent Uploads</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.recent}</p>
                <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Upload className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${stats.expiringSoon > 0 ? 'border-l-amber-500' : 'border-l-slate-300'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Expiring Soon</p>
                <p className={`text-3xl font-bold ${stats.expiringSoon > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {stats.expiringSoon}
                </p>
                <p className="text-xs text-slate-500 mt-1">Within 30 days</p>
              </div>
              <div className={`p-3 rounded-lg ${stats.expiringSoon > 0 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                <Clock className={`h-6 w-6 ${stats.expiringSoon > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      {documents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search documents by type or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents List */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-slate-600">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            documents.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="text-center py-16 text-slate-600">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p>No documents found matching your search criteria</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {selectedCategory === "all" ? (
                // Grouped by category
                Object.entries(groupedDocuments).map(([category, docs]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      {CATEGORIES[category]} ({docs.length})
                    </h3>
                    <div className="space-y-3 mb-6">
                      {docs.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Flat list for filtered category
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Document
            </DialogTitle>
            <DialogDescription>
              Add a new document to the employee's record
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="document_type">
                Document Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.document_type}
                onValueChange={(value) => {
                  setFormData({ ...formData, document_type: value });
                  setErrors({ ...errors, document_type: null });
                }}
              >
                <SelectTrigger className={errors.document_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).filter(([k]) => k !== 'all').map(([category, label]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase">
                        {label}
                      </div>
                      {Object.entries(DOCUMENT_TYPES)
                        .filter(([_, config]) => config.category === category)
                        .map(([type, config]) => {
                          const Icon = config.icon;
                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 text-${config.color}-600`} />
                                {type}
                              </div>
                            </SelectItem>
                          );
                        })}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              {errors.document_type && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.document_type}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">
                File <span className="text-red-500">*</span>
              </Label>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-all
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                  ${errors.file ? 'border-red-500' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
                
                {formData.file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <File className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">{formData.file.name}</p>
                      <p className="text-sm text-slate-600">{formatFileSize(formData.file.size)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, file: null });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                    <p className="font-medium text-slate-900 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-slate-600">
                      PDF, Images, Word, Excel (max {MAX_FILE_SIZE / 1024 / 1024}MB)
                    </p>
                  </div>
                )}
              </div>
              {errors.file && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.file}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Document Number */}
              <div className="space-y-2">
                <Label htmlFor="document_number">Document Number</Label>
                <Input
                  id="document_number"
                  value={formData.document_number}
                  onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                  placeholder="e.g., ID-123456"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date (if applicable)</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description / Notes</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any additional notes or context about this document..."
                rows={3}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-2">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Documents are stored securely and encrypted</li>
                    <li>Only authorized personnel can access these documents</li>
                    <li>Set expiry dates for documents that need renewal</li>
                    <li>Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                disabled={uploadDocument.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploadDocument.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {uploadDocument.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}