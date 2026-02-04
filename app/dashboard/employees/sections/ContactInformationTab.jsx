"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Save, X, Mail, Phone, MapPin, Home } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function ContactInformationTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    work_email: employee.work_email || employee.user?.email || "",
    personal_email: employee.personal_email || "",
    phone: employee.phone || "",
    alternate_phone: employee.alternate_phone || "",
    present_address_line1: employee.present_address_line1 || "",
    present_address_line2: employee.present_address_line2 || "",
    present_city: employee.present_city || "",
    present_state: employee.present_state || "",
    present_postal_code: employee.present_postal_code || "",
    present_country: employee.present_country || "",
    permanent_address_line1: employee.permanent_address_line1 || "",
    permanent_address_line2: employee.permanent_address_line2 || "",
    permanent_city: employee.permanent_city || "",
    permanent_state: employee.permanent_state || "",
    permanent_postal_code: employee.permanent_postal_code || "",
    permanent_country: employee.permanent_country || "",
    same_as_present: false,
  });

  const updateEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Contact information updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update contact information");
    },
  });

  const handleSave = () => {
    const dataToSubmit = { ...formData };
    delete dataToSubmit.same_as_present;
    updateEmployee.mutate(dataToSubmit);
  };

  const handleCancel = () => {
    setFormData({
      work_email: employee.work_email || employee.user?.email || "",
      personal_email: employee.personal_email || "",
      phone: employee.phone || "",
      alternate_phone: employee.alternate_phone || "",
      present_address_line1: employee.present_address_line1 || "",
      present_address_line2: employee.present_address_line2 || "",
      present_city: employee.present_city || "",
      present_state: employee.present_state || "",
      present_postal_code: employee.present_postal_code || "",
      present_country: employee.present_country || "",
      permanent_address_line1: employee.permanent_address_line1 || "",
      permanent_address_line2: employee.permanent_address_line2 || "",
      permanent_city: employee.permanent_city || "",
      permanent_state: employee.permanent_state || "",
      permanent_postal_code: employee.permanent_postal_code || "",
      permanent_country: employee.permanent_country || "",
      same_as_present: false,
    });
    setIsEditing(false);
  };

  const copyPresentToPermanent = () => {
    setFormData(prev => ({
      ...prev,
      permanent_address_line1: prev.present_address_line1,
      permanent_address_line2: prev.present_address_line2,
      permanent_city: prev.present_city,
      permanent_state: prev.present_state,
      permanent_postal_code: prev.present_postal_code,
      permanent_country: prev.present_country,
      same_as_present: true,
    }));
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium whitespace-pre-line">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const formatAddress = (line1, line2, city, state, postal, country) => {
    const parts = [line1, line2, city, state, postal, country].filter(Boolean);
    return parts.length > 0 ? parts.join("\n") : null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Details
              </CardTitle>
              <CardDescription>
                Email addresses and phone numbers
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-0">
              <InfoRow
                label="Work Email"
                value={employee.work_email || employee.user?.email}
                icon={Mail}
              />
              <InfoRow
                label="Personal Email"
                value={employee.personal_email}
                icon={Mail}
              />
              <InfoRow
                label="Phone Number"
                value={employee.phone}
                icon={Phone}
              />
              <InfoRow
                label="Alternate Phone"
                value={employee.alternate_phone}
                icon={Phone}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work_email">Work Email</Label>
                  <Input
                    id="work_email"
                    type="email"
                    value={formData.work_email}
                    onChange={(e) => setFormData({ ...formData, work_email: e.target.value })}
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal_email">Personal Email</Label>
                  <Input
                    id="personal_email"
                    type="email"
                    value={formData.personal_email}
                    onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                    placeholder="john.doe@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternate_phone">Alternate Phone</Label>
                  <Input
                    id="alternate_phone"
                    type="tel"
                    value={formData.alternate_phone}
                    onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Present Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <InfoRow
              label="Address"
              value={formatAddress(
                employee.present_address_line1,
                employee.present_address_line2,
                employee.present_city,
                employee.present_state,
                employee.present_postal_code,
                employee.present_country
              )}
              icon={Home}
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="present_address_line1">Address Line 1</Label>
                <Input
                  id="present_address_line1"
                  value={formData.present_address_line1}
                  onChange={(e) => setFormData({ ...formData, present_address_line1: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="present_address_line2">Address Line 2</Label>
                <Input
                  id="present_address_line2"
                  value={formData.present_address_line2}
                  onChange={(e) => setFormData({ ...formData, present_address_line2: e.target.value })}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="present_city">City</Label>
                  <Input
                    id="present_city"
                    value={formData.present_city}
                    onChange={(e) => setFormData({ ...formData, present_city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="present_state">State/Province</Label>
                  <Input
                    id="present_state"
                    value={formData.present_state}
                    onChange={(e) => setFormData({ ...formData, present_state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="present_postal_code">Postal Code</Label>
                  <Input
                    id="present_postal_code"
                    value={formData.present_postal_code}
                    onChange={(e) => setFormData({ ...formData, present_postal_code: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="present_country">Country</Label>
                  <Input
                    id="present_country"
                    value={formData.present_country}
                    onChange={(e) => setFormData({ ...formData, present_country: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Permanent Address
            </CardTitle>
            {isEditing && (
              <Button
                onClick={copyPresentToPermanent}
                variant="outline"
                size="sm"
              >
                Same as Present
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <InfoRow
              label="Address"
              value={formatAddress(
                employee.permanent_address_line1,
                employee.permanent_address_line2,
                employee.permanent_city,
                employee.permanent_state,
                employee.permanent_postal_code,
                employee.permanent_country
              )}
              icon={Home}
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="permanent_address_line1">Address Line 1</Label>
                <Input
                  id="permanent_address_line1"
                  value={formData.permanent_address_line1}
                  onChange={(e) => setFormData({ ...formData, permanent_address_line1: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permanent_address_line2">Address Line 2</Label>
                <Input
                  id="permanent_address_line2"
                  value={formData.permanent_address_line2}
                  onChange={(e) => setFormData({ ...formData, permanent_address_line2: e.target.value })}
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permanent_city">City</Label>
                  <Input
                    id="permanent_city"
                    value={formData.permanent_city}
                    onChange={(e) => setFormData({ ...formData, permanent_city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanent_state">State/Province</Label>
                  <Input
                    id="permanent_state"
                    value={formData.permanent_state}
                    onChange={(e) => setFormData({ ...formData, permanent_state: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanent_postal_code">Postal Code</Label>
                  <Input
                    id="permanent_postal_code"
                    value={formData.permanent_postal_code}
                    onChange={(e) => setFormData({ ...formData, permanent_postal_code: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanent_country">Country</Label>
                  <Input
                    id="permanent_country"
                    value={formData.permanent_country}
                    onChange={(e) => setFormData({ ...formData, permanent_country: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={updateEmployee.isPending}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateEmployee.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
