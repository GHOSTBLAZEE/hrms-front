"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, X, Upload, FileText, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function CreateAnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSuccess,
}) {
  const isEdit = !!announcement;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    category_id: "",
    is_pinned: false,
    target_audience: "all",
    department_id: "",
    location_id: "",
    published_at: "",
    expires_at: "",
    send_notification: true,
  });

  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  // Reset form when dialog opens/closes or announcement changes
  useEffect(() => {
    if (open) {
      if (announcement) {
        setFormData({
          title: announcement.title || "",
          content: announcement.content || "",
          priority: announcement.priority || "medium",
          category_id: announcement.category_id || "",
          is_pinned: announcement.is_pinned || false,
          target_audience: announcement.target_audience || "all",
          department_id: announcement.department_id || "",
          location_id: announcement.location_id || "",
          published_at: announcement.published_at
            ? new Date(announcement.published_at).toISOString().slice(0, 16)
            : "",
          expires_at: announcement.expires_at
            ? new Date(announcement.expires_at).toISOString().slice(0, 16)
            : "",
          send_notification: false, // Don't send notification on edit by default
        });
        setExistingAttachments(announcement.attachments || []);
      } else {
        setFormData({
          title: "",
          content: "",
          priority: "medium",
          category_id: "",
          is_pinned: false,
          target_audience: "all",
          department_id: "",
          location_id: "",
          published_at: "",
          expires_at: "",
          send_email: true,
        });
        setExistingAttachments([]);
      }
      setAttachments([]);
      setErrors({});
    }
  }, [open, announcement]);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["announcement-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/announcement-categories");
      return response.data?.data || [];
    },
    enabled: open,
  });

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/departments");
      return response.data?.data || [];
    },
    enabled: open,
  });

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/locations");
      return response.data?.data || [];
    },
    enabled: open,
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(data).forEach((key) => {
        if (key !== "attachments" && data[key] !== "" && data[key] !== null) {
          // Convert booleans to 1/0 for FormData
          if (typeof data[key] === 'boolean') {
            formDataToSend.append(key, data[key] ? '1' : '0');
          } else {
            formDataToSend.append(key, data[key]);
          }
        }
      });

      // Add files
      attachments.forEach((file) => {
        formDataToSend.append("attachments[]", file);
      });

      if (isEdit) {
        // Laravel doesn't support PUT with FormData, use POST with _method
        formDataToSend.append("_method", "PUT");
        const response = await apiClient.post(
          `/api/v1/announcements/${announcement.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } else {
        const response = await apiClient.post(
          "/api/v1/announcements",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? "Announcement updated successfully"
          : "Announcement created successfully"
      );
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to save announcement";
      const validationErrors = error?.response?.data?.errors || {};

      setErrors(validationErrors);
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Prepare data
    const submitData = {
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      category_id: formData.category_id,
      is_pinned: formData.is_pinned,
      target_audience: formData.target_audience,
      send_notification: formData.send_notification,
    };

    // Add targeting fields
    if (formData.target_audience === "department") {
      submitData.department_id = formData.department_id;
    } else if (formData.target_audience === "location") {
      submitData.location_id = formData.location_id;
    }

    // Add dates
    if (formData.published_at) {
      submitData.published_at = formData.published_at;
    }
    if (formData.expires_at) {
      submitData.expires_at = formData.expires_at;
    }

    mutation.mutate(submitData);
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
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (attachmentId) => {
    try {
      await apiClient.delete(
        `/api/v1/announcements/${announcement.id}/attachments/${attachmentId}`
      );
      setExistingAttachments((prev) =>
        prev.filter((att) => att.id !== attachmentId)
      );
      toast.success("Attachment removed");
    } catch (error) {
      toast.error("Failed to remove attachment");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Announcement" : "Create New Announcement"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the announcement details below"
              : "Share important updates with your team"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Office Closure for Holiday"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title[0]}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write your announcement here..."
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={6}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content[0]}</p>
            )}
          </div>

          {/* Two columns: Priority & Category */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category_id">Category (Optional)</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleChange("category_id", value)}
              >
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave empty for no category
              </p>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Select
              value={formData.target_audience}
              onValueChange={(value) => {
                handleChange("target_audience", value);
                handleChange("department_id", "");
                handleChange("location_id", "");
              }}
            >
              <SelectTrigger id="target_audience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="department">Specific Department</SelectItem>
                <SelectItem value="location">Specific Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department Selection */}
          {formData.target_audience === "department" && (
            <div className="space-y-2">
              <Label htmlFor="department_id">Department</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => handleChange("department_id", value)}
              >
                <SelectTrigger id="department_id">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location Selection */}
          {formData.target_audience === "location" && (
            <div className="space-y-2">
              <Label htmlFor="location_id">Location</Label>
              <Select
                value={formData.location_id}
                onValueChange={(value) => handleChange("location_id", value)}
              >
                <SelectTrigger id="location_id">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Two columns: Publish & Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Published At */}
            <div className="space-y-2">
              <Label htmlFor="published_at">Publish Date (Optional)</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => handleChange("published_at", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to publish immediately
              </p>
            </div>

            {/* Expires At */}
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => handleChange("expires_at", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Announcement will hide after this date
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="space-y-2">
              {/* Existing attachments */}
              {existingAttachments.length > 0 && (
                <div className="space-y-2">
                  {existingAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{att.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(att.size)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(att.url, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExistingAttachment(att.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* New attachments */}
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Upload button */}
              <div>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="attachments"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">
                    Click to upload files (PDF, DOC, images)
                  </span>
                </Label>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {/* Pin Announcement */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="is_pinned" className="cursor-pointer">
                  Pin Announcement
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pinned announcements appear at the top
                </p>
              </div>
              <Switch
                id="is_pinned"
                checked={formData.is_pinned}
                onCheckedChange={(checked) =>
                  handleChange("is_pinned", checked)
                }
              />
            </div>

            {/* Send Notification */}
            {!isEdit && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="send_notification" className="cursor-pointer">
                    Send Notification
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notify targeted employees (in-app, email, push)
                  </p>
                </div>
                <Switch
                  id="send_notification"
                  checked={formData.send_notification}
                  onCheckedChange={(checked) =>
                    handleChange("send_notification", checked)
                  }
                />
              </div>
            )}
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
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEdit ? "Update" : "Create"} Announcement</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}