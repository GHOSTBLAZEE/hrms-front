"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Filter,
  FileImage,
  FileSpreadsheet,
  File,
  User,
  Hash,
  HardDrive,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import UploadDocumentDialog from "./components/UploadDocumentDialog";
import DeleteDocumentDialog from "./components/DeleteDocumentDialog";
import { toast } from "sonner";

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch user's documents
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-documents", typeFilter],
    queryFn: async () => {
      if (!user?.employee_id) {
        throw new Error("Employee profile not found");
      }

      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("document_type", typeFilter);

      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/documents?${params}`
      );
      return response.data?.data || [];
    },
    enabled: !!user?.employee_id,
  });

  const documents = data || [];

  // Filter by search
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.original_filename?.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase()) ||
      doc.document_type?.toLowerCase().includes(search.toLowerCase()) ||
      doc.document_number?.toLowerCase().includes(search.toLowerCase())
  );

  // Document type configurations with proper icons
  const documentTypes = {
    id_proof: { label: "ID Proof", icon: FileImage, color: "amber" },
    address_proof: { label: "Address Proof", icon: FileImage, color: "amber" },
    educational: { label: "Educational Certificate", icon: FileText, color: "purple" },
    experience: { label: "Experience Certificate", icon: FileText, color: "indigo" },
    resume: { label: "Resume/CV", icon: FileText, color: "blue" },
    offer_letter: { label: "Offer Letter", icon: FileText, color: "emerald" },
    appointment_letter: { label: "Appointment Letter", icon: FileText, color: "teal" },
    employment_contract: { label: "Employment Contract", icon: FileText, color: "indigo" },
    nda: { label: "NDA/Confidentiality", icon: FileText, color: "red" },
    resignation: { label: "Resignation Letter", icon: FileText, color: "orange" },
    relieving_letter: { label: "Relieving Letter", icon: FileText, color: "slate" },
    payslip: { label: "Payslip", icon: FileSpreadsheet, color: "green" },
    tax_documents: { label: "Tax Documents", icon: FileSpreadsheet, color: "violet" },
    performance_review: { label: "Performance Review", icon: FileText, color: "pink" },
    warning_letter: { label: "Warning Letter", icon: FileText, color: "red" },
    other: { label: "Other Documents", icon: File, color: "gray" },
  };

  const getDocumentTypeConfig = (type) => {
    return documentTypes[type] || documentTypes.other;
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType) => {
    if (!mimeType) return File;
    if (mimeType.includes('image')) return FileImage;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  // Check if document is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // ✅ FIXED: Download with correct filename
  const handleDownload = async (document) => {
    try {
      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/documents/${document.id}/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement("a");
      link.href = url;
      link.setAttribute("download", document.original_filename || `document-${document.id}`);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  // ✅ FIXED: View in new tab
  const handleView = async (document) => {
    try {
      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/documents/${document.id}/download`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: document.mime_type || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      toast.success("Opening document");
    } catch (error) {
      console.error("View error:", error);
      toast.error("Failed to open document");
    }
  };

  const handleDelete = (document) => {
    setSelectedDocument(document);
    setDeleteOpen(true);
  };

  if (!user?.employee_id) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Employee Profile Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You need an employee profile to access documents
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Failed to load documents</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.response?.data?.message || "Please try again"}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            My Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal documents and certificates
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Documents</p>
                <p className="text-3xl font-bold text-blue-600">{documents.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-amber-600">
                  {documents.filter((d) => isExpiringSoon(d.expiry_date)).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-600">
                  {documents.filter((d) => isExpired(d.expiry_date)).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valid</p>
                <p className="text-3xl font-bold text-green-600">
                  {
                    documents.filter(
                      (d) => !d.expiry_date || (!isExpired(d.expiry_date) && !isExpiringSoon(d.expiry_date))
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    All Types
                  </div>
                </SelectItem>
                {Object.entries(documentTypes).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${config.color}-600`} />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search || typeFilter !== "all"
                ? "No documents found"
                : "No documents yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Upload your first document to get started"}
            </p>
            {!search && typeFilter === "all" && (
              <Button onClick={() => setUploadOpen(true)} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => {
            const typeConfig = getDocumentTypeConfig(document.document_type);
            const FileIcon = getFileIcon(document.mime_type);
            const TypeIcon = typeConfig.icon;
            const expired = isExpired(document.expiry_date);
            const expiringSoon = isExpiringSoon(document.expiry_date);

            return (
              <Card
                key={document.id}
                className={`group hover:shadow-lg transition-all border-l-4 ${
                  expired
                    ? "border-l-red-500 bg-red-50/30"
                    : expiringSoon
                    ? "border-l-amber-500 bg-amber-50/30"
                    : `border-l-${typeConfig.color}-500`
                }`}
              >
                <CardContent className="p-6">
                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${typeConfig.color}-50 border-2 border-${typeConfig.color}-200 flex-shrink-0`}>
                      <TypeIcon className={`h-6 w-6 text-${typeConfig.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-slate-900 mb-1 line-clamp-1">
                        {document.original_filename || 'Untitled Document'}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-xs bg-${typeConfig.color}-50 text-${typeConfig.color}-700 border-${typeConfig.color}-200`}>
                          {typeConfig.label}
                        </Badge>
                        {expired && (
                          <Badge variant="destructive" className="text-xs">
                            Expired
                          </Badge>
                        )}
                        {expiringSoon && !expired && (
                          <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {document.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {document.description}
                    </p>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    {document.document_number && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate font-mono">{document.document_number}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <HardDrive className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatFileSize(document.file_size)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">
                        {new Date(document.uploaded_at || document.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {document.expiry_date && (
                      <div
                        className={`flex items-center gap-1.5 ${
                          expired ? "text-red-600" : expiringSoon ? "text-amber-600" : "text-slate-600"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span className="truncate">
                          Exp: {new Date(document.expiry_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    {document.uploader && (
                      <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">Uploaded by {document.uploader.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Expiry Warning */}
                  {expiringSoon && !expired && (
                    <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span className="font-medium">Expiring soon - Please renew</span>
                      </div>
                    </div>
                  )}

                  {expired && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-xs text-red-800">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span className="font-medium">Document expired</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleView(document)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDownload(document)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleDelete(document)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        employeeId={user?.employee_id}
        onSuccess={() => {
          refetch();
          setUploadOpen(false);
        }}
      />

      <DeleteDocumentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        document={selectedDocument}
        employeeId={user?.employee_id}
        onSuccess={() => {
          refetch();
          setDeleteOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
}