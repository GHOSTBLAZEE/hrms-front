"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function TrainingDevelopmentTab({ employee, employeeId }) {
  const { data: trainings, isLoading } = useQuery({
    queryKey: ["trainings", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/trainings`);
      return response.data?.data || [];
    },
  });

  const getStatusBadge = (status) => {
    const configs = {
      completed: { label: "Completed", variant: "success", icon: CheckCircle },
      in_progress: { label: "In Progress", variant: "warning", icon: Clock },
      scheduled: { label: "Scheduled", variant: "secondary", icon: Calendar },
      cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
    };
    const config = configs[status] || configs.scheduled;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Training & Development
            </CardTitle>
            <CardDescription>Training programs, workshops, and skill development</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Training
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : trainings && trainings.length > 0 ? (
          <div className="space-y-4">
            {trainings.map((training) => (
              <Card key={training.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{training.title}</h4>
                        <p className="text-sm text-muted-foreground">{training.provider}</p>
                      </div>
                      {getStatusBadge(training.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {training.start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Start:</span>
                          <span>{new Date(training.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {training.end_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">End:</span>
                          <span>{new Date(training.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {training.duration_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{training.duration_hours} hours</span>
                        </div>
                      )}
                      {training.completion_date && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-muted-foreground">Completed:</span>
                          <span>{new Date(training.completion_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    {training.description && (
                      <p className="text-sm">{training.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No training records found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
