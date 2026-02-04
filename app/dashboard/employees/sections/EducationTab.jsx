"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Plus, Briefcase, Award } from "lucide-react";
import AddEducationDialog from "../components/AddEducationDialog";

export default function EducationTab({ employee, employeeId, onUpdate }) {
  const [addEducationOpen, setAddEducationOpen] = useState(false);

  // Fetch education
  const { data: education, isLoading: educationLoading } = useQuery({
    queryKey: ["employee-education", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/education`);
      return res.data.data || [];
    },
  });

  // Fetch experience
  const { data: experience, isLoading: experienceLoading } = useQuery({
    queryKey: ["employee-experience", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/experience`);
      return res.data.data || [];
    },
  });

  return (
    <>
      <div className="space-y-6">
        {/* Education */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Academic qualifications and certifications
              </p>
            </div>
            {employee.can?.update && (
              <Button
                onClick={() => setAddEducationOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            )}
          </div>

          {educationLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : !education || education.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No education records</p>
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <Card key={edu.id} className="p-5 border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{edu.degree}</h4>
                        {edu.is_highest && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            <Award className="h-3 w-3 mr-1" />
                            Highest
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {edu.field_of_study}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>
                          {edu.start_year} - {edu.end_year || "Present"}
                        </span>
                        {edu.grade && <span>Grade: {edu.grade}</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Work Experience */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Work Experience
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Previous employment history
              </p>
            </div>
          </div>

          {experienceLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : !experience || experience.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No work experience records</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative pl-12">
                    <div className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                    <Card className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{exp.job_title}</h4>
                          <p className="text-sm font-medium text-slate-700 mt-1">
                            {exp.company_name}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span>
                              {new Date(exp.start_date).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              -{" "}
                              {exp.end_date
                                ? new Date(exp.end_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Present"}
                            </span>
                            {exp.location && <span>• {exp.location}</span>}
                          </div>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-slate-600 mt-3">{exp.description}</p>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <AddEducationDialog
        employeeId={employeeId}
        open={addEducationOpen}
        onOpenChange={setAddEducationOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}