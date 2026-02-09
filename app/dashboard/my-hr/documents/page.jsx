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
      if (typeFilter !== "all") params.append("type", typeFilter);

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
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase()) ||
      doc.document_type?.toLowerCase().includes(search.toLowerCase())
  );

  // Document type configurations
  const documentTypes = {
    id_proof: { label: "ID Proof", icon: "🆔", color: "blue" },
    educational: { label: "Educational", icon: "🎓", color: "purple" },
    experience: { label: "Experience Letter", icon: "💼", color: "indigo" },
    offer_letter: { label: "Offer Letter", icon: "📄", color: "green" },
    appointment_letter: { label: "Appointment Letter", icon: "📋", color: "teal" },
    resignation: { label: "Resignation", icon: "👋", color: "orange" },
    tax_documents: { label: "Tax Documents", icon: "💰", color: "amber" },
    other: { label: "Other", icon: "📎", color: "gray" },
  };

  const getDocumentTypeConfig = (type) => {
    return documentTypes[type] || documentTypes.other;
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

  const handleDownload = async (document) => {
    try {
      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/documents/${document.id}/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", document.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded");
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  const handleView = (document) => {
    window.open(document.file_url, "_blank");
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-600">
                  {documents.filter((d) => isExpiringSoon(d.expiry_date)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {documents.filter((d) => isExpired(d.expiry_date)).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valid</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    documents.filter(
                      (d) => !d.expiry_date || (!isExpired(d.expiry_date) && !isExpiringSoon(d.expiry_date))
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-20" />
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
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(documentTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.icon} {config.label}
                  </SelectItem>
                ))}
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
            const expired = isExpired(document.expiry_date);
            const expiringSoon = isExpiringSoon(document.expiry_date);

            return (
              <Card
                key={document.id}
                className={`group hover:shadow-lg transition-all ${
                  expired
                    ? "border-red-200 bg-red-50/30"
                    : expiringSoon
                    ? "border-amber-200 bg-amber-50/30"
                    : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">
                        {document.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {typeConfig.icon} {typeConfig.label}
                        </Badge>
                        {expired && (
                          <Badge variant="destructive" className="text-xs">
                            Expired
                          </Badge>
                        )}
                        {expiringSoon && !expired && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Description */}
                  {document.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {document.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {document.document_number && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Number:</span>
                        <span>{document.document_number}</span>
                      </div>
                    )}
                    {document.issue_date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Issued: {new Date(document.issue_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {document.expiry_date && (
                      <div
                        className={`flex items-center gap-1.5 ${
                          expired ? "text-red-600" : expiringSoon ? "text-amber-600" : ""
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        <span>
                          Expires: {new Date(document.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span>Uploaded {new Date(document.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t">
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
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(document)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
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