"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  Building2,
  FileText,
  ExternalLink,
  XCircle,
  GraduationCap,
  Star,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";

export function ViewTrainingModal({ open, onOpenChange, training }) {
  if (!training) return null;

  const getStatusBadge = (status) => {
    const configs = {
      completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      in_progress: {
        label: "In Progress",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      scheduled: {
        label: "Scheduled",
        className: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Calendar,
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{training.title}</DialogTitle>
              <DialogDescription className="text-base">
                Training program details and information
              </DialogDescription>
            </div>
            {getStatusBadge(training.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Training Provider</p>
                <p className="text-lg font-semibold text-blue-700 mt-0.5">{training.provider}</p>
              </div>
            </div>

            {training.training_type && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Training Type</p>
                  <p className="text-lg font-semibold text-purple-700 mt-0.5 capitalize">
                    {training.training_type}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {training.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <h4 className="font-semibold text-gray-900">Description</h4>
                </div>
                <p className="text-gray-700 leading-relaxed pl-6">{training.description}</p>
              </div>
            </>
          )}

          {/* Training Details */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Training Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              {training.start_date && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(training.start_date), "PPP")}
                    </p>
                  </div>
                </div>
              )}

              {/* End Date */}
              {training.end_date && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(training.end_date), "PPP")}
                    </p>
                  </div>
                </div>
              )}

              {/* Duration */}
              {training.duration_hours && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {training.duration_hours} hours
                    </p>
                  </div>
                </div>
              )}

              {/* Cost */}
              {training.cost && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Cost</p>
                    <p className="font-semibold text-gray-900">
                      ${training.cost.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Completion Date */}
              {training.completion_date && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-700">Completed On</p>
                    <p className="font-semibold text-green-900">
                      {format(new Date(training.completion_date), "PPP")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificate */}
          {training.certificate_url && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <h4 className="font-semibold text-gray-900">Certificate</h4>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => window.open(training.certificate_url, "_blank")}
                >
                  <span>View Certificate</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Score */}
          {training.score !== null && training.score !== undefined && (
            <>
              <Separator />
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-900">Assessment Score</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-1">{training.score}/100</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {training.score >= 90 ? "Excellent" : training.score >= 70 ? "Good" : "Satisfactory"}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Feedback */}
          {training.feedback && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <h4 className="font-semibold text-gray-900">Feedback</h4>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {training.feedback}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            {training.created_at && (
              <div>
                <p className="font-medium">Created</p>
                <p>{format(new Date(training.created_at), "PPP")}</p>
              </div>
            )}
            {training.updated_at && (
              <div>
                <p className="font-medium">Last Updated</p>
                <p>{format(new Date(training.updated_at), "PPP")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}