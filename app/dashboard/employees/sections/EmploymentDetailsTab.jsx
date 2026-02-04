"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Edit, Save, X, Briefcase, Building, MapPin, User, Calendar, Clock, FileText } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function EmploymentDetailsTab({ employee, employeeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    employee_code: employee.employee_code || "",
    employment_type: employee.employment_type || "full_time",
    work_mode: employee.work_mode || "on_site",
    designation_id: employee.designation_id?.toString() || "",
    department_id: employee.department_id?.toString() || "",
    location_id: employee.location_id?.toString() || "",
    manager_id: employee.manager_id?.toString() || "",
    shift_id: employee.shift_id?.toString() || "",
    joined_at: employee.joined_at || "",
    probation_end_date: employee.probation_end_date || "",
    confirmation_date: employee.confirmation_date || "",
    notice_period_days: employee.notice_period_days?.toString() || "",
    status: employee.status || "probation",
  });

  // Fetch dropdown data
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/departments");
      return response.data?.data || [];
    },
  });

  const { data: designations } = useQuery({
    queryKey: ["designations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/designations");
      return response.data?.data || [];
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/locations");
      return response.data?.data || [];
    },
  });

  const { data: shifts } = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/shifts");
      return response.data?.data || [];
    },
  });

  const { data: managers } = useQuery({
    queryKey: ["employees-managers"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/employees?status=active");
      return response.data?.data || [];
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Employment details updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update employment details");
    },
  });

  const handleSave = () => {
    updateEmployee.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      employee_code: employee.employee_code || "",
      employment_type: employee.employment_type || "full_time",
      work_mode: employee.work_mode || "on_site",
      designation_id: employee.designation_id?.toString() || "",
      department_id: employee.department_id?.toString() || "",
      location_id: employee.location_id?.toString() || "",
      manager_id: employee.manager_id?.toString() || "",
      shift_id: employee.shift_id?.toString() || "",
      joined_at: employee.joined_at || "",
      probation_end_date: employee.probation_end_date || "",
      confirmation_date: employee.confirmation_date || "",
      notice_period_days: employee.notice_period_days?.toString() || "",
      status: employee.status || "probation",
    });
    setIsEditing(false);
  };

  const InfoRow = ({ label, value, icon: Icon, badge }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {badge ? badge : <p className="font-medium">{value || "Not provided"}</p>}
      </div>
    </div>
  );

  const employmentTypeLabels = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    intern: "Intern",
  };

  const workModeLabels = {
    on_site: "On-site",
    remote: "Remote",
    hybrid: "Hybrid",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Details
            </CardTitle>
            <CardDescription>
              Job role, reporting structure, and employment terms
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
                Save
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
              label="Employee Code"
              value={employee.employee_code}
              icon={FileText}
            />
            <InfoRow
              label="Employment Type"
              icon={Briefcase}
              badge={
                <Badge variant="outline">
                  {employmentTypeLabels[employee.employment_type] || employee.employment_type}
                </Badge>
              }
            />
            <InfoRow
              label="Work Mode"
              icon={MapPin}
              badge={
                <Badge variant="outline">
                  {workModeLabels[employee.work_mode] || employee.work_mode}
                </Badge>
              }
            />
            <InfoRow
              label="Designation"
              value={employee.designation?.name}
              icon={Briefcase}
            />
            <InfoRow
              label="Department"
              value={employee.department?.name}
              icon={Building}
            />
            <InfoRow
              label="Location"
              value={employee.location?.name}
              icon={MapPin}
            />
            <InfoRow
              label="Reporting Manager"
              value={employee.manager ? `${employee.manager.user?.name} (${employee.manager.employee_code})` : "No manager assigned"}
              icon={User}
            />
            <InfoRow
              label="Shift"
              value={employee.shift?.name}
              icon={Clock}
            />
            <InfoRow
              label="Date of Joining"
              value={employee.joined_at ? new Date(employee.joined_at).toLocaleDateString() : null}
              icon={Calendar}
            />
            {employee.status === "probation" && (
              <InfoRow
                label="Probation End Date"
                value={employee.probation_end_date ? new Date(employee.probation_end_date).toLocaleDateString() : null}
                icon={Calendar}
              />
            )}
            {employee.confirmation_date && (
              <InfoRow
                label="Confirmation Date"
                value={new Date(employee.confirmation_date).toLocaleDateString()}
                icon={Calendar}
              />
            )}
            <InfoRow
              label="Notice Period"
              value={employee.notice_period_days ? `${employee.notice_period_days} days` : null}
              icon={Calendar}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_code">Employee Code *</Label>
                <Input
                  id="employee_code"
                  value={formData.employee_code}
                  onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                  placeholder="EMP-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Employment Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="probation">Probation</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_mode">Work Mode</Label>
                <Select
                  value={formData.work_mode}
                  onValueChange={(value) => setFormData({ ...formData, work_mode: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_site">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation_id">Designation *</Label>
                <Select
                  value={formData.designation_id}
                  onValueChange={(value) => setFormData({ ...formData, designation_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations?.map((desig) => (
                      <SelectItem key={desig.id} value={desig.id.toString()}>
                        {desig.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_id">Department *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_id">Location *</Label>
                <Select
                  value={formData.location_id}
                  onValueChange={(value) => setFormData({ ...formData, location_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager_id">Reporting Manager</Label>
                <Select
                  value={formData.manager_id}
                  onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Manager</SelectItem>
                    {managers?.filter(m => m.id !== employee.id).map((mgr) => (
                      <SelectItem key={mgr.id} value={mgr.id.toString()}>
                        {mgr.user?.name} ({mgr.employee_code}) - {mgr.designation?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift_id">Shift</Label>
                <Select
                  value={formData.shift_id}
                  onValueChange={(value) => setFormData({ ...formData, shift_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts?.map((shift) => (
                      <SelectItem key={shift.id} value={shift.id.toString()}>
                        {shift.name} ({shift.start_time} - {shift.end_time})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joined_at">Date of Joining</Label>
                <Input
                  id="joined_at"
                  type="date"
                  value={formData.joined_at}
                  onChange={(e) => setFormData({ ...formData, joined_at: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="probation_end_date">Probation End Date</Label>
                <Input
                  id="probation_end_date"
                  type="date"
                  value={formData.probation_end_date}
                  onChange={(e) => setFormData({ ...formData, probation_end_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation_date">Confirmation Date</Label>
                <Input
                  id="confirmation_date"
                  type="date"
                  value={formData.confirmation_date}
                  onChange={(e) => setFormData({ ...formData, confirmation_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notice_period_days">Notice Period (Days)</Label>
                <Input
                  id="notice_period_days"
                  type="number"
                  value={formData.notice_period_days}
                  onChange={(e) => setFormData({ ...formData, notice_period_days: e.target.value })}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}