"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Plus, Calendar, Building } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function EducationExperienceTab({ employee, employeeId }) {
  const { data: education } = useQuery({
    queryKey: ["education", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/education`);
      return response.data?.data || [];
    },
  });

  const { data: experience } = useQuery({
    queryKey: ["experience", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/experience`);
      return response.data?.data || [];
    },
  });

  return (
    <Tabs defaultValue="education" className="space-y-4">
      <TabsList>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="experience">Work Experience</TabsTrigger>
      </TabsList>

      <TabsContent value="education">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Educational Qualifications
                </CardTitle>
                <CardDescription>Academic background and certifications</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {education && education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <div className="flex gap-4 text-sm">
                            <span>{edu.field_of_study}</span>
                            {edu.year_completed && <span>• {edu.year_completed}</span>}
                            {edu.grade && <span>• Grade: {edu.grade}</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No education records added yet
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="experience">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
                <CardDescription>Previous employment history</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {experience && experience.length > 0 ? (
              <div className="space-y-4">
                {experience.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{exp.job_title}</h4>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {exp.company_name}
                            </p>
                          </div>
                          {exp.is_current && <Badge>Current</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                        </div>
                        {exp.description && <p className="text-sm">{exp.description}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No work experience added yet
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
