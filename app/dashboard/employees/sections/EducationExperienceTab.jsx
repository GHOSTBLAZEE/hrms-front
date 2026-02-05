"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroupTextarea } from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  Briefcase,
  Plus,
  Calendar,
  Building,
  Edit,
  Trash2,
  Award,
  Loader2,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

// =====================================================================
// SCHEMAS
// =====================================================================
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  start_year: z.coerce.number().min(1900).max(new Date().getFullYear() + 10).optional().nullable(),
  end_year: z.coerce.number().min(1900).max(new Date().getFullYear() + 10).optional().nullable(),
  grade: z.string().optional(),
  is_highest_qualification: z.boolean().optional(),
});

const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().optional(),
  responsibilities: z.string().optional(),
  leaving_reason: z.string().optional(),
});

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function EducationExperienceTab({ employee, employeeId }) {
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [deleteEducationId, setDeleteEducationId] = useState(null);
  const [deleteExperienceId, setDeleteExperienceId] = useState(null);

  const queryClient = useQueryClient();

  // =====================================================================
  // FETCH DATA
  // =====================================================================
  const { data: education, isLoading: educationLoading } = useQuery({
    queryKey: ["education", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/education`);
      return response.data?.data || [];
    },
  });

  const { data: experience, isLoading: experienceLoading } = useQuery({
    queryKey: ["experience", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/experience`);
      return response.data?.data || [];
    },
  });

  // =====================================================================
  // EDUCATION MUTATIONS
  // =====================================================================
  const addEducationMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/education`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["education", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Education added successfully");
      setEducationDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add education");
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/api/v1/employees/${employeeId}/education/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["education", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Education updated successfully");
      setEducationDialogOpen(false);
      setEditingEducation(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update education");
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/education/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["education", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Education deleted successfully");
      setDeleteEducationId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete education");
    },
  });

  // =====================================================================
  // EXPERIENCE MUTATIONS
  // =====================================================================
  const addExperienceMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/experience`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["experience", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Experience added successfully");
      setExperienceDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add experience");
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/api/v1/employees/${employeeId}/experience/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["experience", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Experience updated successfully");
      setExperienceDialogOpen(false);
      setEditingExperience(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update experience");
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["experience", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Experience deleted successfully");
      setDeleteExperienceId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete experience");
    },
  });

  // =====================================================================
  // HANDLERS
  // =====================================================================
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationDialogOpen(true);
  };

  const handleEditEducation = (edu) => {
    setEditingEducation(edu);
    setEducationDialogOpen(true);
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setExperienceDialogOpen(true);
  };

  const handleEditExperience = (exp) => {
    setEditingExperience(exp);
    setExperienceDialogOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="education" className="space-y-4">
        <TabsList>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Work Experience</TabsTrigger>
        </TabsList>

        {/* =====================================================================
            EDUCATION TAB
        ===================================================================== */}
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
                <Button size="sm" onClick={handleAddEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {educationLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : education && education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <Card key={edu.id} className="relative">
                      <CardContent className="pt-6">
                        <div className="flex justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-start gap-2">
                              <h4 className="font-semibold text-lg">{edu.degree}</h4>
                              {edu.is_highest_qualification && (
                                <Badge variant="secondary" className="shrink-0">
                                  <Award className="h-3 w-3 mr-1" />
                                  Highest
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {edu.institution}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              {edu.field_of_study && <span>{edu.field_of_study}</span>}
                              {(edu.start_year || edu.end_year) && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {edu.start_year || "N/A"} - {edu.end_year || "N/A"}
                                </span>
                              )}
                              {edu.grade && <span>Grade: {edu.grade}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEducation(edu)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteEducationId(edu.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No education records added yet</p>
                  <Button variant="outline" size="sm" onClick={handleAddEducation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Education Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =====================================================================
            EXPERIENCE TAB
        ===================================================================== */}
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
                <Button size="sm" onClick={handleAddExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {experienceLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : experience && experience.length > 0 ? (
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <Card key={exp.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-2 mb-1">
                                <h4 className="font-semibold text-lg">{exp.designation}</h4>
                                {exp.is_current && (
                                  <Badge variant="default">Current</Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                {exp.company_name}
                                {exp.department && ` • ${exp.department}`}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExperience(exp)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteExperienceId(exp.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
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
                          </div>
                          {exp.responsibilities && (
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {exp.responsibilities}
                            </p>
                          )}
                          {exp.leaving_reason && !exp.is_current && (
                            <div className="text-sm">
                              <span className="font-medium">Reason for leaving:</span>{" "}
                              <span className="text-muted-foreground">{exp.leaving_reason}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No work experience added yet</p>
                  <Button variant="outline" size="sm" onClick={handleAddExperience}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Experience Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* =====================================================================
          EDUCATION DIALOG
      ===================================================================== */}
      <EducationDialog
        open={educationDialogOpen}
        onOpenChange={setEducationDialogOpen}
        education={editingEducation}
        onSubmit={(data) => {
          if (editingEducation) {
            updateEducationMutation.mutate({ id: editingEducation.id, data });
          } else {
            addEducationMutation.mutate(data);
          }
        }}
        isLoading={addEducationMutation.isPending || updateEducationMutation.isPending}
      />

      {/* =====================================================================
          EXPERIENCE DIALOG
      ===================================================================== */}
      <ExperienceDialog
        open={experienceDialogOpen}
        onOpenChange={setExperienceDialogOpen}
        experience={editingExperience}
        onSubmit={(data) => {
          if (editingExperience) {
            updateExperienceMutation.mutate({ id: editingExperience.id, data });
          } else {
            addExperienceMutation.mutate(data);
          }
        }}
        isLoading={addExperienceMutation.isPending || updateExperienceMutation.isPending}
      />

      {/* =====================================================================
          DELETE DIALOGS
      ===================================================================== */}
      <AlertDialog open={!!deleteEducationId} onOpenChange={() => setDeleteEducationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEducationMutation.mutate(deleteEducationId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteExperienceId} onOpenChange={() => setDeleteExperienceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this experience record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteExperienceMutation.mutate(deleteExperienceId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// =====================================================================
// EDUCATION DIALOG COMPONENT
// =====================================================================
function EducationDialog({ open, onOpenChange, education, onSubmit, isLoading }) {
  const form = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      field_of_study: "",
      institution: "",
      start_year: null,
      end_year: null,
      grade: "",
      is_highest_qualification: false,
    },
  });

  // Reset form when dialog opens with education data
  React.useEffect(() => {
    if (open) {
      if (education) {
        form.reset({
          degree: education.degree || "",
          field_of_study: education.field_of_study || "",
          institution: education.institution || "",
          start_year: education.start_year || null,
          end_year: education.end_year || null,
          grade: education.grade || "",
          is_highest_qualification: education.is_highest_qualification || false,
        });
      } else {
        form.reset({
          degree: "",
          field_of_study: "",
          institution: "",
          start_year: null,
          end_year: null,
          grade: "",
          is_highest_qualification: false,
        });
      }
    }
  }, [open, education, form]);

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {education ? "Edit Education" : "Add Education"}
          </DialogTitle>
          <DialogDescription>
            {education
              ? "Update education details"
              : "Add a new education qualification"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="degree"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Degree / Qualification *</FieldLabel>
                  <Input placeholder="e.g., Bachelor of Science" {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="field_of_study"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Field of Study</FieldLabel>
                  <Input placeholder="e.g., Computer Science" {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="institution"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Institution / University *</FieldLabel>
                  <Input placeholder="e.g., MIT" {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="start_year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Start Year</FieldLabel>
                    <Input
                      type="number"
                      placeholder="2018"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : null)
                      }
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="end_year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>End Year</FieldLabel>
                    <Input
                      type="number"
                      placeholder="2022"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : null)
                      }
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="grade"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Grade / CGPA</FieldLabel>
                  <Input placeholder="e.g., 3.8/4.0 or First Class" {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="is_highest_qualification"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-start space-x-3 rounded-md border p-4">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1 leading-none">
                    <Label className="text-sm font-medium">Highest Qualification</Label>
                    <FieldDescription>
                      Mark this as the highest educational qualification
                    </FieldDescription>
                  </div>
                </div>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {education ? "Update" : "Add"} Education
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// =====================================================================
// EXPERIENCE DIALOG COMPONENT
// =====================================================================
function ExperienceDialog({ open, onOpenChange, experience, onSubmit, isLoading }) {
  const form = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: "",
      designation: "",
      department: "",
      start_date: "",
      end_date: "",
      is_current: false,
      responsibilities: "",
      leaving_reason: "",
    },
  });

  const isCurrent = form.watch("is_current");

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (experience) {
        form.reset({
          company_name: experience.company_name || "",
          designation: experience.designation || "",
          department: experience.department || "",
          start_date: experience.start_date || "",
          end_date: experience.end_date || "",
          is_current: experience.is_current || false,
          responsibilities: experience.responsibilities || "",
          leaving_reason: experience.leaving_reason || "",
        });
      } else {
        form.reset({
          company_name: "",
          designation: "",
          department: "",
          start_date: "",
          end_date: "",
          is_current: false,
          responsibilities: "",
          leaving_reason: "",
        });
      }
    }
  }, [open, experience, form]);

  const handleSubmit = (data) => {
    // If current job, clear end_date and leaving_reason
    if (data.is_current) {
      data.end_date = null;
      data.leaving_reason = "";
    }
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            {experience
              ? "Update work experience details"
              : "Add a new work experience record"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="company_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Company Name *</FieldLabel>
                  <Input placeholder="e.g., Google Inc." {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="designation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Designation / Job Title *</FieldLabel>
                    <Input placeholder="e.g., Senior Developer" {...field} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="department"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Department</FieldLabel>
                    <Input placeholder="e.g., Engineering" {...field} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Start Date *</FieldLabel>
                    <Input type="date" {...field} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>End Date</FieldLabel>
                    <Input type="date" {...field} disabled={isCurrent} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="is_current"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-start space-x-3 rounded-md border p-4">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1 leading-none">
                    <Label className="text-sm font-medium">Currently Working Here</Label>
                    <FieldDescription>
                      Check this if this is your current position
                    </FieldDescription>
                  </div>
                </div>
              )}
            />

            <Controller
              name="responsibilities"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Responsibilities / Achievements</FieldLabel>
                  <InputGroupTextarea
                    placeholder="Describe your key responsibilities and achievements..."
                    className="min-h-[100px]"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {!isCurrent && (
              <Controller
                name="leaving_reason"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Reason for Leaving</FieldLabel>
                    <InputGroupTextarea
                      placeholder="Optional: Why did you leave this position?"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {experience ? "Update" : "Add"} Experience
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}