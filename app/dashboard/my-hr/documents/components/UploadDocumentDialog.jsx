"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Upload, FileText, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function UploadDocumentDialog({
  open,
  onOpenChange,
  employeeId,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    document_type: "",
    description: "",
    document_number: "",
    issue_date: "",
    expiry_date: "",
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Document types - standardized to match backend
  const documentTypes = [
    { value: "id_proof", label: "🆔 ID Proof", category: "Identity" },
    { value: "address_proof", label: "🏠 Address Proof", category: "Identity" },
    { value: "educational", label: "🎓 Educational Certificate", category: "Academic" },
    { value: "experience", label: "💼 Experience Certificate", category: "Academic" },
    { value: "resume", label: "📝 Resume/CV", category: "Recruitment" },
    { value: "offer_letter", label: "📄 Offer Letter", category: "Employment" },
    { value: "appointment_letter", label: "📋 Appointment Letter", category: "Employment" },
    { value: "employment_contract", label: "📜 Employment Contract", category: "Legal" },
    { value: "nda", label: "🔒 NDA/Confidentiality", category: "Legal" },
    { value: "resignation", label: "👋 Resignation Letter", category: "Exit" },
    { value: "relieving_letter", label: "✅ Relieving Letter", category: "Exit" },
    { value: "payslip", label: "💰 Payslip", category: "Financial" },
    { value: "tax_documents", label: "📊 Tax Documents", category: "Financial" },
    { value: "performance_review", label: "⭐ Performance Review", category: "Performance" },
    { value: "warning_letter", label: "⚠️ Warning Letter", category: "Disciplinary" },
    { value: "other", label: "📎 Other Documents", category: "Miscellaneous" },
  ];

  // Reset form when dialog closes
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setFormData({
        name: "",
        document_type: "",
        description: "",
        document_number: "",
        issue_date: "",
        expiry_date: "",
      });
      setFile(null);
      setErrors({});
    }
    onOpenChange(isOpen);
  };

  // Upload mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();

      // Add file
      if (data.file) {
        formDataToSend.append("file", data.file);
      }

      // Add other fields
      Object.keys(data).forEach((key) => {
        if (key !== "file" && data[key] !== "" && data[key] !== null) {
          formDataToSend.append(key, data[key]);
        }
      });

      const response = await apiClient.post(
        `/api/v1/employees/${employeeId}/documents`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to upload document";
      const validationErrors = error?.response?.data?.errors || {};

      setErrors(validationErrors);
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors = {};
    if (!formData.name) newErrors.name = "Document name is required";
    if (!formData.document_type) newErrors.document_type = "Document type is required";
    if (!file) newErrors.file = "Please select a file to upload";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate({
      ...formData,
      file,
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill name if empty
      if (!formData.name) {
        handleChange("name", selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
      if (errors.file) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to your personal collection
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">
              File <span className="text-destructive">*</span>
            </Label>
            {file ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Label
                  htmlFor="file"
                  className={`flex items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                    errors.file ? "border-destructive" : ""
                  }`}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </div>
                </Label>
              </>
            )}
            {errors.file && (
              <p className="text-sm text-destructive">{errors.file}</p>
            )}
          </div>

          {/* Document Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Document Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Passport Copy"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="document_type">
              Document Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.document_type}
              onValueChange={(value) => handleChange("document_type", value)}
            >
              <SelectTrigger
                id="document_type"
                className={errors.document_type ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {/* Group by category */}
                {["Identity", "Academic", "Recruitment", "Employment", "Legal", "Exit", "Financial", "Performance", "Disciplinary", "Miscellaneous"].map((category) => {
                  const items = documentTypes.filter(t => t.category === category);
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        {category}
                      </div>
                      {items.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.document_type && (
              <p className="text-sm text-destructive">
                {errors.document_type[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Document Number */}
          <div className="space-y-2">
            <Label htmlFor="document_number">Document Number (Optional)</Label>
            <Input
              id="document_number"
              placeholder="e.g., A1234567"
              value={formData.document_number}
              onChange={(e) => handleChange("document_number", e.target.value)}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date (Optional)</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => handleChange("issue_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleChange("expiry_date", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty if document doesn't expire
              </p>
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}