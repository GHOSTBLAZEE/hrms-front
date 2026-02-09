"use client";

import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Calendar,
  User,
  Eye,
  TrendingUp,
  Bell,
  Pin,
  Clock,
  MapPin,
  Building2,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useEffect } from "react";

export default function AnnouncementDetailDialog({
  open,
  onOpenChange,
  announcement,
}) {
  // Mark as read when opened
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.post(`/api/v1/announcements/${id}/mark-read`);
    },
  });

  useEffect(() => {
    if (open && announcement && !announcement.is_read) {
      markAsReadMutation.mutate(announcement.id);
    }
  }, [open, announcement]);

  if (!announcement) return null;

  const getPriorityConfig = (priority) => {
    const configs = {
      high: {
        label: "High Priority",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: AlertCircle,
      },
      medium: {
        label: "Medium Priority",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        icon: TrendingUp,
      },
      low: {
        label: "Low Priority",
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Bell,
      },
    };
    return configs[priority] || configs.low;
  };

  const priorityConfig = getPriorityConfig(announcement.priority);
  const PriorityIcon = priorityConfig.icon;
  const isPinned = announcement.is_pinned;
  const isScheduled =
    announcement.published_at &&
    new Date(announcement.published_at) > new Date();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {isPinned && <Pin className="h-5 w-5 text-purple-600 mt-1" />}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl">{announcement.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className={priorityConfig.className}>
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  {announcement.priority}
                </Badge>
                {announcement.category && (
                  <Badge 
                    variant="outline"
                    style={{
                      backgroundColor: announcement.category.color ? `${announcement.category.color}20` : undefined,
                      borderColor: announcement.category.color || undefined,
                      color: announcement.category.color || undefined,
                    }}
                  >
                    {announcement.category.name}
                  </Badge>
                )}
                {isScheduled && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Scheduled
                  </Badge>
                )}
                {!announcement.is_read && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Author & Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {announcement.created_by && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={announcement.created_by.avatar} />
                <AvatarFallback className="text-xs">
                  {getInitials(announcement.created_by.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{announcement.created_by.name}</p>
                <p className="text-xs text-muted-foreground">
                  {announcement.created_by.designation?.name || "Employee"}
                </p>
              </div>
            </div>
          )}

          <Separator orientation="vertical" className="h-10" />

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(announcement.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {announcement.views_count > 0 && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{announcement.views_count} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Target Audience */}
        {announcement.target_audience && announcement.target_audience !== "all" && (
          <>
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Target Audience:</span>
              {announcement.target_audience === "department" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {announcement.department?.name || "Specific Department"}
                </Badge>
              )}
              {announcement.target_audience === "location" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {announcement.location?.name || "Specific Location"}
                </Badge>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {announcement.content}
          </div>
        </div>

        {/* Attachments (if any) */}
        {announcement.attachments && announcement.attachments.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Attachments</p>
              <div className="space-y-2">
                {announcement.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{attachment.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer Info */}
        {isScheduled && (
          <>
            <Separator />
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <Clock className="h-4 w-4 inline mr-1" />
                This announcement is scheduled to be published on{" "}
                {new Date(announcement.published_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}