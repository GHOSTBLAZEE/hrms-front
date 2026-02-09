"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  Plus,
  Search,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Bell,
  BellOff,
  Pin,
  Clock,
  Tag,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import CreateAnnouncementDialog from "./components/CreateAnnouncementDialog";
import AnnouncementDetailDialog from "./components/AnnouncementDetailDialog";
import DeleteAnnouncementDialog from "./components/DeleteAnnouncementDialog";

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["announcement-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/announcement-categories");
      return response.data?.data || [];
    },
  });

  const categories = categoriesData || [];

  // Fetch announcements
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["announcements", priorityFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (categoryFilter !== "all") params.append("category_id", categoryFilter);
      
      const response = await apiClient.get(`/api/v1/announcements?${params}`);
      return response.data?.data || [];
    },
  });

  const announcements = data || [];

  // Filter by search
  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title?.toLowerCase().includes(search.toLowerCase()) ||
    announcement.content?.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailOpen(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setCreateOpen(true);
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteOpen(true);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Failed to load announcements</h3>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with company news and updates
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedAnnouncement(null);
            setCreateOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search || priorityFilter !== "all" || categoryFilter !== "all"
                ? "No announcements found"
                : "No announcements yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search || priorityFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first announcement to get started"}
            </p>
            {!search && priorityFilter === "all" && categoryFilter === "all" && (
              <Button
                onClick={() => {
                  setSelectedAnnouncement(null);
                  setCreateOpen(true);
                }}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAnnouncements.map((announcement) => {
            const priorityConfig = getPriorityConfig(announcement.priority);
            const PriorityIcon = priorityConfig.icon;
            const isPinned = announcement.is_pinned;
            const isScheduled = announcement.published_at && new Date(announcement.published_at) > new Date();

            return (
              <Card
                key={announcement.id}
                className={`group hover:shadow-lg transition-all ${
                  isPinned ? "border-purple-200 bg-purple-50/30 dark:bg-purple-950/10" : ""
                }`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isPinned && (
                        <Pin className="h-4 w-4 text-purple-600 shrink-0" />
                      )}
                      <h3 className="font-semibold text-lg line-clamp-1 flex-1">
                        {announcement.title}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${priorityConfig.className} shrink-0 ml-2`}
                    >
                      <PriorityIcon className="h-3 w-3 mr-1" />
                      {announcement.priority}
                    </Badge>
                  </div>

                  {/* Category */}
                  {announcement.category && (
                    <div className="mb-3">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          backgroundColor: announcement.category.color ? `${announcement.category.color}20` : undefined,
                          borderColor: announcement.category.color || undefined,
                          color: announcement.category.color || undefined,
                        }}
                      >
                        {announcement.category.name}
                      </Badge>
                    </div>
                  )}

                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {announcement.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[120px]">
                        {announcement.created_by?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {isScheduled && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Scheduled</span>
                      </div>
                    )}
                    {announcement.views_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{announcement.views_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Target Audience */}
                  {announcement.target_audience && announcement.target_audience !== "all" && (
                    <div className="mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {announcement.target_audience === "department"
                          ? `Dept: ${announcement.department?.name || "Specific"}`
                          : `Location: ${announcement.location?.name || "Specific"}`}
                      </Badge>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleView(announcement)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View
                    </Button>
                    {announcement.can?.update && (
                      <Button
                        onClick={() => handleEdit(announcement)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {announcement.can?.delete && (
                      <Button
                        onClick={() => handleDelete(announcement)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <CreateAnnouncementDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        announcement={selectedAnnouncement}
        onSuccess={() => {
          refetch();
          setCreateOpen(false);
          setSelectedAnnouncement(null);
        }}
      />

      <AnnouncementDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        announcement={selectedAnnouncement}
      />

      <DeleteAnnouncementDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        announcement={selectedAnnouncement}
        onSuccess={() => {
          refetch();
          setDeleteOpen(false);
          setSelectedAnnouncement(null);
        }}
      />
    </div>
  );
}