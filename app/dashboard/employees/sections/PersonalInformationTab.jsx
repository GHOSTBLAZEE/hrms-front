"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Save, X, User, Calendar, Heart, Droplet, Globe } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function PersonalInformationTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Helper to extract first/last name from full name if needed
  const getNameParts = () => {
    const firstName = employee.user?.first_name || employee.first_name;
    const lastName = employee.user?.last_name || employee.last_name;
    
    // If we have both, use them
    if (firstName && lastName) {
      return { firstName, lastName };
    }
    
    // If we have name field but not first/last, split it
    const fullName = employee.user?.name || employee.name || "";
    if (fullName && (!firstName || !lastName)) {
      const parts = fullName.trim().split(' ');
      return {
        firstName: firstName || parts[0] || "",
        lastName: lastName || parts.slice(1).join(' ') || ""
      };
    }
    
    return { firstName: firstName || "", lastName: lastName || "" };
  };

  const nameParts = getNameParts();

  const [formData, setFormData] = useState({
    first_name: nameParts.firstName,
    last_name: nameParts.lastName,
    date_of_birth: employee.user?.date_of_birth || employee.date_of_birth || "",
    gender: employee.user?.gender || employee.gender || "",
    marital_status: employee.user?.marital_status || employee.marital_status || "",
    blood_group: employee.user?.blood_group || employee.blood_group || "",
    nationality: employee.user?.nationality || employee.nationality || "",
  });

  // Update formData when employee data changes
  useEffect(() => {
    const nameParts = getNameParts();
    setFormData({
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      date_of_birth: employee.user?.date_of_birth || employee.date_of_birth || "",
      gender: employee.user?.gender || employee.gender || "",
      marital_status: employee.user?.marital_status || employee.marital_status || "",
      blood_group: employee.user?.blood_group || employee.blood_group || "",
      nationality: employee.user?.nationality || employee.nationality || "",
    });
  }, [employee]);

  const updateEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Personal information updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update personal information");
    },
  });

  const handleSave = () => {
    // Validate required fields
    if (!formData.first_name?.trim() || !formData.last_name?.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    // Always include first_name and last_name in personal info updates
    const dataToSend = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender || null,
      marital_status: formData.marital_status || null,
      blood_group: formData.blood_group || null,
      nationality: formData.nationality || null,
    };

    console.log("Sending data:", dataToSend);
    updateEmployee.mutate(dataToSend);
  };

  const handleCancel = () => {
    const nameParts = getNameParts();
    setFormData({
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      date_of_birth: employee.user?.date_of_birth || employee.date_of_birth || "",
      gender: employee.user?.gender || employee.gender || "",
      marital_status: employee.user?.marital_status || employee.marital_status || "",
      blood_group: employee.user?.blood_group || employee.blood_group || "",
      nationality: employee.user?.nationality || employee.nationality || "",
    });
    setIsEditing(false);
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic personal details and demographic information
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                disabled={updateEmployee.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateEmployee.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={updateEmployee.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-0">
            <InfoRow
              label="Full Name"
              value={
                formData.first_name || formData.last_name
                  ? `${formData.first_name} ${formData.last_name}`.trim()
                  : employee?.user?.name || employee?.name || "Not provided"
              }
              icon={User}
            />
            <InfoRow
              label="Date of Birth"
              value={formData.date_of_birth ? new Date(formData.date_of_birth).toLocaleDateString() : null}
              icon={Calendar}
            />
            <InfoRow
              label="Gender"
              value={formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).replace('_', ' ') : null}
              icon={User}
            />
            <InfoRow
              label="Marital Status"
              value={formData.marital_status ? formData.marital_status.charAt(0).toUpperCase() + formData.marital_status.slice(1) : null}
              icon={Heart}
            />
            <InfoRow
              label="Blood Group"
              value={formData.blood_group}
              icon={Droplet}
            />
            <InfoRow
              label="Nationality"
              value={formData.nationality}
              icon={Globe}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marital_status">Marital Status</Label>
                <Select
                  value={formData.marital_status}
                  onValueChange={(value) => setFormData({ ...formData, marital_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select
                  value={formData.blood_group}
                  onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="e.g., Indian, American"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}