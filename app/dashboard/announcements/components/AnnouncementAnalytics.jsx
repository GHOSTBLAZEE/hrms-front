"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Eye,
  FileText,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function AnnouncementsAnalytics() {
  // Fetch analytics data
  const { data, isLoading } = useQuery({
    queryKey: ["announcements-analytics"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/announcements/analytics");
      return response.data?.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const analytics = data || {};

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Announcements */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  {analytics.total_announcements || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Announcements */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {analytics.active_announcements || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {analytics.total_views?.toLocaleString() || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Read Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Read Rate</p>
                <p className="text-2xl font-bold">
                  {analytics.read_rate || 0}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expired */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold">
                  {analytics.expired_announcements || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {analytics.scheduled_announcements || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Reads */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reads</p>
                <p className="text-2xl font-bold">
                  {analytics.total_reads?.toLocaleString() || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-teal-600 dark:text-teal-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution - Placeholder */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">
                  {analytics.by_priority?.high || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Most Viewed Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.most_viewed && analytics.most_viewed.length > 0 ? (
              <div className="space-y-3">
                {analytics.most_viewed.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">
                          #{index + 1}
                        </Badge>
                        <p className="font-medium truncate">
                          {announcement.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {announcement.category && (
                          <Badge variant="secondary" className="text-xs">
                            {announcement.category}
                          </Badge>
                        )}
                        <span>
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {announcement.views_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No announcements yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* By Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              By Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.by_category && analytics.by_category.length > 0 ? (
              <div className="space-y-3">
                {analytics.by_category.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <span className="font-medium">{item.category}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No categories yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20">
              <p className="text-sm text-muted-foreground mb-1">High Priority</p>
              <p className="text-2xl font-bold">
                {analytics.by_priority?.high || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950/20">
              <p className="text-sm text-muted-foreground mb-1">Medium Priority</p>
              <p className="text-2xl font-bold">
                {analytics.by_priority?.medium || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
              <p className="text-sm text-muted-foreground mb-1">Low Priority</p>
              <p className="text-2xl font-bold">
                {analytics.by_priority?.low || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}