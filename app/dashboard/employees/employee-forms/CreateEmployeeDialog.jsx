"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, User, Briefcase, MapPin, Phone, Calendar, AlertCircle, CreditCard, Shield, Heart } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function CreateEmployeeDialogEnhanced({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("basic");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    // Basic Information
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    blood_group: "",
    nationality: "",
    
    // Employment Details
    employee_code: "",
    designation_id: "",
    department_id: "",
    location_id: "",
    manager_id: "",
    shift_id: "",
    joined_at: "",
    employment_type: "full_time",
    work_mode: "on_site",
    status: "probation",
    probation_end_date: "",
    notice_period_days: "30",
    
    // Contact Information
    personal_email: "",
    alternate_phone: "",
    emergency_contact: "",
    
    // Present Address
    present_address_line1: "",
    present_address_line2: "",
    present_city: "",
    present_state: "",
    present_postal_code: "",
    present_country: "",
    
    // Permanent Address
    permanent_address_line1: "",
    permanent_address_line2: "",
    permanent_city: "",
    permanent_state: "",
    permanent_postal_code: "",
    permanent_country: "",
    same_as_present: false,
    
    // Banking Details
    bank_name: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    bank_branch: "",
    pan_number: "",
    
    // Statutory
    pf_number: "",
    esi_number: "",
    uan_number: "",
    
    // Role
    role: "employee",
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

  const { data: employees } = useQuery({
    queryKey: ["employees-managers"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/employees?status=active");
      return response.data?.data || [];
    },
  });

  const createEmployee = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post("/api/v1/employees", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully", {
        description: "Welcome email and password reset link have been sent.",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create employee";
      const errors = error.response?.data?.errors;
      
      if (errors) {
        Object.keys(errors).forEach((field) => {
          toast.error(`${field}: ${errors[field][0]}`);
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Please fill in all required basic information");
      setActiveTab("basic");
      return;
    }
    
    if (!formData.employee_code || !formData.department_id || !formData.designation_id || !formData.location_id) {
      toast.error("Please fill in all required employment details");
      setActiveTab("employment");
      return;
    }
    
    // Copy present to permanent if checkbox is selected
    const dataToSubmit = { ...formData };
    if (formData.same_as_present) {
      dataToSubmit.permanent_address_line1 = formData.present_address_line1;
      dataToSubmit.permanent_address_line2 = formData.present_address_line2;
      dataToSubmit.permanent_city = formData.present_city;
      dataToSubmit.permanent_state = formData.present_state;
      dataToSubmit.permanent_postal_code = formData.present_postal_code;
      dataToSubmit.permanent_country = formData.present_country;
    }
    delete dataToSubmit.same_as_present;
    
    createEmployee.mutate(dataToSubmit);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
      blood_group: "",
      nationality: "",
      employee_code: "",
      designation_id: "",
      department_id: "",
      location_id: "",
      manager_id: "",
      shift_id: "",
      joined_at: "",
      employment_type: "full_time",
      work_mode: "on_site",
      status: "probation",
      probation_end_date: "",
      notice_period_days: "30",
      personal_email: "",
      alternate_phone: "",
      emergency_contact: "",
      present_address_line1: "",
      present_address_line2: "",
      present_city: "",
      present_state: "",
      present_postal_code: "",
      present_country: "",
      permanent_address_line1: "",
      permanent_address_line2: "",
      permanent_city: "",
      permanent_state: "",
      permanent_postal_code: "",
      permanent_country: "",
      same_as_present: false,
      bank_name: "",
      bank_account_number: "",
      bank_ifsc_code: "",
      bank_branch: "",
      pan_number: "",
      pf_number: "",
      esi_number: "",
      uan_number: "",
      role: "employee",
    });
    setActiveTab("basic");
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyAddressToPermanent = () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee - Comprehensive Form</DialogTitle>
          <DialogDescription>
            Fill in all employee details. Fields marked with * are required.
            A welcome email with password reset link will be sent automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="statutory">Statutory</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => updateField("first_name", e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => updateField("last_name", e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => updateField("date_of_birth", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
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
                      <Select value={formData.marital_status} onValueChange={(value) => updateField("marital_status", value)}>
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
                      <Select value={formData.blood_group} onValueChange={(value) => updateField("blood_group", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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

                    <div className="space-y-2 col-span-3">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => updateField("nationality", e.target.value)}
                        placeholder="e.g., Indian, American"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment Details */}
            <TabsContent value="employment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee_code">Employee Code *</Label>
                      <Input
                        id="employee_code"
                        value={formData.employee_code}
                        onChange={(e) => updateField("employee_code", e.target.value)}
                        placeholder="EMP-001"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joined_at">Date of Joining *</Label>
                      <Input
                        id="joined_at"
                        type="date"
                        value={formData.joined_at}
                        onChange={(e) => updateField("joined_at", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="probation_end_date">Probation End Date</Label>
                      <Input
                        id="probation_end_date"
                        type="date"
                        value={formData.probation_end_date}
                        onChange={(e) => updateField("probation_end_date", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employment_type">Employment Type</Label>
                      <Select value={formData.employment_type} onValueChange={(value) => updateField("employment_type", value)}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <Select value={formData.work_mode} onValueChange={(value) => updateField("work_mode", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on_site">On-site</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="probation">Probation</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department_id">Department *</Label>
                      <Select value={formData.department_id} onValueChange={(value) => updateField("department_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments?.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation_id">Designation *</Label>
                      <Select value={formData.designation_id} onValueChange={(value) => updateField("designation_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {designations?.map((desig) => (
                            <SelectItem key={desig.id} value={desig.id.toString()}>{desig.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location_id">Location *</Label>
                      <Select value={formData.location_id} onValueChange={(value) => updateField("location_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations?.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manager_id">Reporting Manager</Label>
                      <Select value={formData.manager_id} onValueChange={(value) => updateField("manager_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees?.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              {emp.full_name} ({emp.employee_code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shift_id">Shift</Label>
                      <Select value={formData.shift_id} onValueChange={(value) => updateField("shift_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts?.map((shift) => (
                            <SelectItem key={shift.id} value={shift.id.toString()}>{shift.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notice_period_days">Notice Period (Days)</Label>
                      <Input
                        id="notice_period_days"
                        type="number"
                        value={formData.notice_period_days}
                        onChange={(e) => updateField("notice_period_days", e.target.value)}
                        placeholder="30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john.doe@company.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personal_email">Personal Email</Label>
                      <Input
                        id="personal_email"
                        type="email"
                        value={formData.personal_email}
                        onChange={(e) => updateField("personal_email", e.target.value)}
                        placeholder="john.doe@gmail.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+1234567890"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternate_phone">Alternate Phone</Label>
                      <Input
                        id="alternate_phone"
                        type="tel"
                        value={formData.alternate_phone}
                        onChange={(e) => updateField("alternate_phone", e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="emergency_contact">Emergency Contact</Label>
                      <Input
                        id="emergency_contact"
                        type="tel"
                        value={formData.emergency_contact}
                        onChange={(e) => updateField("emergency_contact", e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Present Address</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Address Line 1</Label>
                        <Input
                          value={formData.present_address_line1}
                          onChange={(e) => updateField("present_address_line1", e.target.value)}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Address Line 2</Label>
                        <Input
                          value={formData.present_address_line2}
                          onChange={(e) => updateField("present_address_line2", e.target.value)}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={formData.present_city}
                          onChange={(e) => updateField("present_city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={formData.present_state}
                          onChange={(e) => updateField("present_state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code</Label>
                        <Input
                          value={formData.present_postal_code}
                          onChange={(e) => updateField("present_postal_code", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={formData.present_country}
                          onChange={(e) => updateField("present_country", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Permanent Address</h4>
                      <Button type="button" variant="outline" size="sm" onClick={copyAddressToPermanent}>
                        Same as Present
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Address Line 1</Label>
                        <Input
                          value={formData.permanent_address_line1}
                          onChange={(e) => updateField("permanent_address_line1", e.target.value)}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Address Line 2</Label>
                        <Input
                          value={formData.permanent_address_line2}
                          onChange={(e) => updateField("permanent_address_line2", e.target.value)}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={formData.permanent_city}
                          onChange={(e) => updateField("permanent_city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={formData.permanent_state}
                          onChange={(e) => updateField("permanent_state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code</Label>
                        <Input
                          value={formData.permanent_postal_code}
                          onChange={(e) => updateField("permanent_postal_code", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          value={formData.permanent_country}
                          onChange={(e) => updateField("permanent_country", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Banking Details */}
            <TabsContent value="banking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Banking & Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input
                        value={formData.bank_name}
                        onChange={(e) => updateField("bank_name", e.target.value)}
                        placeholder="HDFC Bank"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input
                        value={formData.bank_account_number}
                        onChange={(e) => updateField("bank_account_number", e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input
                        value={formData.bank_ifsc_code}
                        onChange={(e) => updateField("bank_ifsc_code", e.target.value)}
                        placeholder="HDFC0001234"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch</Label>
                      <Input
                        value={formData.bank_branch}
                        onChange={(e) => updateField("bank_branch", e.target.value)}
                        placeholder="Mumbai Main"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>PAN Number</Label>
                      <Input
                        value={formData.pan_number}
                        onChange={(e) => updateField("pan_number", e.target.value)}
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statutory */}
            <TabsContent value="statutory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Statutory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PF Number</Label>
                      <Input
                        value={formData.pf_number}
                        onChange={(e) => updateField("pf_number", e.target.value)}
                        placeholder="Enter PF number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ESI Number</Label>
                      <Input
                        value={formData.esi_number}
                        onChange={(e) => updateField("esi_number", e.target.value)}
                        placeholder="Enter ESI number"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>UAN Number</Label>
                      <Input
                        value={formData.uan_number}
                        onChange={(e) => updateField("uan_number", e.target.value)}
                        placeholder="Enter UAN number"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">System Role</h4>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={formData.role} onValueChange={(value) => updateField("role", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Determines system permissions and access levels
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createEmployee.isPending}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "employment", "contact", "banking", "statutory"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Previous
                </Button>
              )}
              {activeTab !== "statutory" ? (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ["basic", "employment", "contact", "banking", "statutory"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={createEmployee.isPending}>
                  {createEmployee.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Employee"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}