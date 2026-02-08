"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Filter,
  Download,
  TrendingUp,
  BookOpen,
  Target,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  GraduationCap,
  Star
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/apiClient";
import { AddTrainingModal } from "./AddTrainingModal";
import { EditTrainingModal } from "./EditTrainingModal";
import { ViewTrainingModal } from "./ViewTrainingModal";

export default function TrainingDevelopmentTab({ employee, employeeId }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const queryClient = useQueryClient();

  // Fetch trainings with error handling
  const { 
    data: trainings, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ["trainings", employeeId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/v1/employees/${employeeId}/trainings`);
        return response.data?.data || [];
      } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to fetch training records");
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  // Calculate statistics
  const stats = trainings ? {
    total: trainings.length,
    completed: trainings.filter(t => t.status === "completed").length,
    inProgress: trainings.filter(t => t.status === "in_progress").length,
    scheduled: trainings.filter(t => t.status === "scheduled").length,
    totalHours: trainings.reduce((acc, t) => acc + (parseFloat(t.duration_hours) || 0), 0),
    totalCost: trainings.reduce((acc, t) => acc + (parseFloat(t.cost) || 0), 0),
    averageScore: trainings.filter(t => t.score).length > 0
      ? Math.round(trainings.reduce((acc, t) => acc + (parseFloat(t.score) || 0), 0) / trainings.filter(t => t.score).length)
      : 0,
    byType: {
      internal: trainings.filter(t => t.training_type === "internal").length,
      external: trainings.filter(t => t.training_type === "external").length,
      online: trainings.filter(t => t.training_type === "online").length,
      workshop: trainings.filter(t => t.training_type === "workshop").length,
    }
  } : { total: 0, completed: 0, inProgress: 0, scheduled: 0, totalHours: 0, totalCost: 0, averageScore: 0, byType: {} };

  // Filter trainings
  const filteredTrainings = trainings?.filter(training => {
    const statusMatch = filterStatus === "all" || training.status === filterStatus;
    const typeMatch = filterType === "all" || training.training_type === filterType;
    return statusMatch && typeMatch;
  }) || [];

  const getStatusBadge = (status) => {
    const configs = {
      completed: { 
        label: "Completed", 
        className: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle 
      },
      in_progress: { 
        label: "In Progress", 
        className: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: Clock 
      },
      scheduled: { 
        label: "Scheduled", 
        className: "bg-purple-100 text-purple-800 border-purple-200", 
        icon: Calendar 
      },
      cancelled: { 
        label: "Cancelled", 
        className: "bg-red-100 text-red-800 border-red-200", 
        icon: XCircle 
      },
    };
    const config = configs[status] || configs.scheduled;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.className} flex items-center gap-1.5`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const configs = {
      internal: { label: "Internal", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      external: { label: "External", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
      online: { label: "Online", className: "bg-violet-100 text-violet-800 border-violet-200" },
      workshop: { label: "Workshop", className: "bg-amber-100 text-amber-800 border-amber-200" },
    };
    const config = configs[type] || configs.external;
    return (
      <Badge variant="outline" className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast("Training records updated successfully");
    } catch (err) {
      toast("Unable to refresh training records");
    }
  };

  const handleExport = () => {
    try {
      const headers = ["Title", "Provider", "Type", "Status", "Start Date", "End Date", "Duration (hrs)", "Cost", "Score"];
      const csvData = filteredTrainings.map(t => [
        t.title,
        t.provider,
        t.training_type,
        t.status,
        t.start_date ? new Date(t.start_date).toLocaleDateString() : "",
        t.end_date ? new Date(t.end_date).toLocaleDateString() : "",
        t.duration_hours || "",
        t.cost || "",
        t.score || ""
      ]);
      
      const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `training-records-${employee?.name || "employee"}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      toast("Training records exported to CSV");
    } catch (err) {
      toast("Unable to export training records");
    }
  };

  const handleView = (training) => {
    setSelectedTraining(training);
    setIsViewModalOpen(true);
  };

  const handleEdit = (training) => {
    setSelectedTraining(training);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (training) => {
    if (!confirm(`Are you sure you want to delete "${training.title}"?`)) return;
    
    try {
      await apiClient.delete(`/api/v1/employees/${employeeId}/trainings/${training.id}`);
      queryClient.invalidateQueries(["trainings", employeeId]);
      toast("Training program has been removed");
    } catch (err) {
      toast(err.response?.data?.message || "Unable to delete training");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Training & Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">Error Loading Training Records</AlertTitle>
            <AlertDescription className="mt-2 text-base">
              {error?.message || "An unexpected error occurred while loading training data."}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="h-6 w-6 text-blue-600" />
                  Training & Development
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Manage training programs, certifications, and professional development for {employee?.name}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className="border-gray-300"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={handleExport}
                  className="border-gray-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  size="default"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Training
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Programs</p>
                      <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
                      <p className="text-xs text-blue-600 mt-1">All training programs</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Completed</p>
                      <p className="text-3xl font-bold text-green-900 mt-1">{stats.completed}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">In Progress</p>
                      <p className="text-3xl font-bold text-purple-900 mt-1">{stats.inProgress}</p>
                      <p className="text-xs text-purple-600 mt-1">{stats.scheduled} scheduled</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Avg. Score</p>
                      <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.averageScore}</p>
                      <p className="text-xs text-yellow-600 mt-1">Out of 100</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Total Investment</p>
                      <p className="text-3xl font-bold text-orange-900 mt-1">
                        ${stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        {stats.totalHours.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} total hours
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>

              {(filterStatus !== "all" || filterType !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterType("all");
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </Button>
              )}
              
              <div className="ml-auto text-sm text-gray-600">
                Showing {filteredTrainings.length} of {stats.total} programs
              </div>
            </div>

            {/* Training List */}
            {filteredTrainings.length > 0 ? (
              <div className="space-y-4">
                {filteredTrainings.map((training) => (
                  <Card key={training.id} className="hover:shadow-lg transition-all duration-200 border-gray-200">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg text-gray-900 truncate">{training.title}</h4>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  <span className="font-medium">Provider:</span> {training.provider}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {getTypeBadge(training.training_type)}
                                  {training.score && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 text-xs flex items-center gap-1">
                                      <Star className="h-3 w-3" />
                                      Score: {training.score}/100
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(training.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(training)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(training)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(training)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {training.description && (
                          <p className="text-sm text-gray-700 pl-14">
                            {training.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-14">
                          {training.start_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Start:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(training.start_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {training.end_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">End:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(training.end_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {training.duration_hours && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium text-gray-900">
                                {parseFloat(training.duration_hours).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} hours
                              </span>
                            </div>
                          )}
                          {training.completion_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-gray-600">Completed:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(training.completion_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {training.cost && (
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Cost:</span>
                              <span className="font-medium text-gray-900">
                                ${parseFloat(training.cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          )}
                        </div>

                        {training.certificate_url && (
                          <div className="pl-14 pt-3 border-t border-gray-100">
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto text-blue-600 hover:text-blue-800"
                              onClick={() => window.open(training.certificate_url, '_blank')}
                            >
                              <Award className="h-4 w-4 mr-1.5" />
                              View Certificate
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-gray-100 p-6 mb-4">
                    <Award className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {filterStatus === "all" && filterType === "all"
                      ? "No Training Records Found" 
                      : "No matching trainings"
                    }
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
                    {filterStatus === "all" && filterType === "all"
                      ? "Get started by adding the employee's first training program to track their professional development journey"
                      : "Try changing the filters or add a new training program"
                    }
                  </p>
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Training Program
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddTrainingModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        employeeId={employeeId}
        employeeName={employee?.name}
      />
      
      {selectedTraining && (
        <>
          <EditTrainingModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            employeeId={employeeId}
            training={selectedTraining}
          />
          
          <ViewTrainingModal
            open={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            training={selectedTraining}
          />
        </>
      )}
    </>
  );
}