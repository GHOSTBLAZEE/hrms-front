"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  User,
  Heart,
  Calendar,
  Phone,
  Briefcase,
  Edit,
  Trash2,
  Loader2,
  UserCheck,
  Award,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

// =====================================================================
// SCHEMA
// =====================================================================
const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  date_of_birth: z.string().optional().nullable(),
  occupation: z.string().optional(),
  phone: z.string().optional(),
  is_dependent: z.boolean().optional(),
  is_nominee: z.boolean().optional(),
});

const RELATIONSHIP_OPTIONS = [
  { value: "spouse", label: "Spouse" },
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "grandfather", label: "Grandfather" },
  { value: "grandmother", label: "Grandmother" },
  { value: "other", label: "Other" },
];

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function FamilyDetailsTab({ employee, employeeId }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);

  const queryClient = useQueryClient();

  // =====================================================================
  // FETCH DATA
  // =====================================================================
  const { data: familyMembers, isLoading } = useQuery({
    queryKey: ["family-members", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/family-members`);
      return response.data?.data || [];
    },
  });

  // =====================================================================
  // MUTATIONS
  // =====================================================================
  const addMemberMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/family-members`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["family-members", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Family member added successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add family member");
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(
        `/api/v1/employees/${employeeId}/family-members/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["family-members", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Family member updated successfully");
      setDialogOpen(false);
      setEditingMember(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update family member");
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/family-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["family-members", employeeId]);
      queryClient.invalidateQueries(["employee", employeeId]);
      toast.success("Family member deleted successfully");
      setDeleteMemberId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete family member");
    },
  });

  // =====================================================================
  // HANDLERS
  // =====================================================================
  const handleAdd = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingMember) {
      updateMemberMutation.mutate({ id: editingMember.id, data });
    } else {
      addMemberMutation.mutate(data);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Members
              </CardTitle>
              <CardDescription>Spouse, children, and dependents information</CardDescription>
            </div>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : familyMembers && familyMembers.length > 0 ? (
            <div className="space-y-4">
              {familyMembers.map((member) => {
                const age = calculateAge(member.date_of_birth);
                return (
                  <Card key={member.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <h4 className="font-semibold text-lg">{member.name}</h4>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="capitalize">
                                <Heart className="h-3 w-3 mr-1" />
                                {member.relationship}
                              </Badge>
                              {member.is_dependent && (
                                <Badge variant="secondary">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Dependent
                                </Badge>
                              )}
                              {member.is_nominee && (
                                <Badge variant="secondary">
                                  <Award className="h-3 w-3 mr-1" />
                                  Nominee
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            {member.date_of_birth && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">DOB:</span>
                                <span>
                                  {new Date(member.date_of_birth).toLocaleDateString()}
                                  {age && <span className="text-muted-foreground ml-1">({age}y)</span>}
                                </span>
                              </div>
                            )}

                            {member.occupation && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Occupation:</span>
                                <span>{member.occupation}</span>
                              </div>
                            )}

                            {member.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteMemberId(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No family members added yet</p>
              <Button variant="outline" size="sm" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Family Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ADD/EDIT DIALOG */}
      <FamilyMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSubmit={handleSubmit}
        isLoading={addMemberMutation.isPending || updateMemberMutation.isPending}
      />

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteMemberId} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this family member record? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMemberMutation.mutate(deleteMemberId)}
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
// FAMILY MEMBER DIALOG
// =====================================================================
function FamilyMemberDialog({ open, onOpenChange, member, onSubmit, isLoading }) {
  const form = useForm({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      name: "",
      relationship: "",
      date_of_birth: "",
      occupation: "",
      phone: "",
      is_dependent: false,
      is_nominee: false,
    },
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (member) {
        form.reset({
          name: member.name || "",
          relationship: member.relationship || "",
          date_of_birth: member.date_of_birth || "",
          occupation: member.occupation || "",
          phone: member.phone || "",
          is_dependent: member.is_dependent || false,
          is_nominee: member.is_nominee || false,
        });
      } else {
        form.reset({
          name: "",
          relationship: "",
          date_of_birth: "",
          occupation: "",
          phone: "",
          is_dependent: false,
          is_nominee: false,
        });
      }
    }
  }, [open, member, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Family Member" : "Add Family Member"}</DialogTitle>
          <DialogDescription>
            {member
              ? "Update family member details"
              : "Add a new family member to the employee's profile"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Full Name *</FieldLabel>
                    <Input placeholder="e.g., John Doe" {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="relationship"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Relationship *</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="date_of_birth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <Input type="date" {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input placeholder="+1 234 567 8900" {...field} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="occupation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Occupation</FieldLabel>
                  <Input placeholder="e.g., Teacher, Student, Retired" {...field} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="space-y-3">
              <Controller
                name="is_dependent"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-start space-x-3 rounded-md border p-4">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <div className="space-y-1 leading-none">
                      <Label className="text-sm font-medium">Dependent</Label>
                      <FieldDescription>
                        This person is financially dependent on the employee
                      </FieldDescription>
                    </div>
                  </div>
                )}
              />

              <Controller
                name="is_nominee"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-start space-x-3 rounded-md border p-4">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <div className="space-y-1 leading-none">
                      <Label className="text-sm font-medium">Nominee</Label>
                      <FieldDescription>
                        This person is a nominee for insurance/benefits
                      </FieldDescription>
                    </div>
                  </div>
                )}
              />
            </div>
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
              {member ? "Update" : "Add"} Family Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}