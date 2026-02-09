"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";

export default function ImportEmployeeDialog({ open, onOpenChange, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  /* =========================================================
   | Handle File Selection
   |========================================================= */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type", {
        description: "Please upload an Excel (.xlsx, .xls) or CSV file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB",
      });
      return;
    }

    setFile(selectedFile);
    setImportResult(null);
  };

  /* =========================================================
   | Drag and Drop Handlers
   |========================================================= */
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
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  /* =========================================================
   | Download Template
   |========================================================= */
  const handleDownloadTemplate = async () => {
    try {
      toast.info("Downloading template...");

      const response = await apiClient.get("/api/v1/employees/template", {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee_import_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully");
    } catch (err) {
      console.error("Template download error:", err);
      toast.error("Failed to download template", {
        description: err.message || "Please try again",
      });
    }
  };

  /* =========================================================
   | Upload File
   |========================================================= */
  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        "/api/v1/employees/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      setImportResult(response.data);

      if (response.data.success) {
        toast.success("Import completed successfully!", {
          description: `${response.data.imported} employee(s) imported`,
        });

        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        toast.warning("Import completed with errors", {
          description: `${response.data.imported} imported, ${response.data.failed} failed`,
        });
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Import failed", {
        description: err.response?.data?.message || err.message || "Please try again",
      });

      setImportResult({
        success: false,
        message: err.response?.data?.message || "Import failed",
        errors: err.response?.data?.errors || [],
      });
    } finally {
      setIsUploading(false);
    }
  };

  /* =========================================================
   | Reset Dialog
   |========================================================= */
  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setUploadProgress(0);
    setIsUploading(false);
    onOpenChange(false);
  };

  const handleTryAgain = () => {
    setFile(null);
    setImportResult(null);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Employees</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to bulk import employee data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Before importing:</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Download the template file below</li>
                <li>Fill in employee data following the format</li>
                <li>Save and upload your completed file</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Download Template */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Employee Import Template</p>
                <p className="text-xs text-muted-foreground">
                  Excel file with all required fields
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          {/* File Upload Area */}
          {!importResult && (
            <div className="space-y-4">
              <Label htmlFor="file-upload">Upload File</Label>
              <div
                className={cn(
                  "relative rounded-lg border-2 border-dashed transition-colors",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25",
                  file ? "bg-muted/50" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer"
                >
                  {file ? (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center">
                        <div className="rounded-full bg-green-50 p-3">
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                        disabled={isUploading}
                      >
                        Choose Different File
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center">
                        <div className="rounded-full bg-muted p-3">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">
                          Drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports: .xlsx, .xls, .csv (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Uploading...</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-4">
              {importResult.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Import Successful!</strong>
                    <p className="mt-1">
                      {importResult.imported} employee(s) have been successfully
                      imported.
                    </p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Import Failed</strong>
                    <p className="mt-1">{importResult.message}</p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Show Errors */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="font-medium text-sm text-red-900">
                      {importResult.failed} Error(s) Found
                    </p>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {importResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-xs bg-white rounded p-2 border border-red-100"
                      >
                        <span className="font-medium text-red-900">
                          Row {error.row}:
                        </span>{" "}
                        <span className="text-red-700">{error.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {importResult.imported > 0 && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border bg-green-50 p-3">
                    <p className="text-muted-foreground">Imported</p>
                    <p className="text-2xl font-bold text-green-600">
                      {importResult.imported}
                    </p>
                  </div>
                  {importResult.failed > 0 && (
                    <div className="rounded-lg border bg-red-50 p-3">
                      <p className="text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-red-600">
                        {importResult.failed}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {importResult ? (
            <>
              {!importResult.success && (
                <Button variant="outline" onClick={handleTryAgain}>
                  Try Again
                </Button>
              )}
              <Button onClick={handleClose}>
                {importResult.success ? "Done" : "Close"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Employees
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}