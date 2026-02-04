"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  Phone,
  FileText,
  GraduationCap,
  Users,
  CreditCard,
  Shield,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  MapPin,
  Edit,
  Download,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Home,
  BarChart3,
  FileCheck,
  AlertTriangle,
  UserCog,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/apiClient";

// Import all tab components
import PersonalInformationTab from "../sections/PersonalInformationTab";
import EmploymentDetailsTab from "../sections/EmploymentDetailsTab";
import ContactInformationTab from "../sections/ContactInformationTab";
import EmergencyContactsTab from "../sections/EmergencyContactsTab";
import IdentificationTab from "../sections/IdentificationTab";
import EducationExperienceTab from "../sections/EducationExperienceTab";
import FamilyDetailsTab from "../sections/FamilyDetailsTab";
import BankingPayrollTab from "../sections/BankingPayrollTab";
import StatutoryComplianceTab from "../sections/StatutoryComplianceTab";
import CareerManagementTab from "../sections/CareerManagementTab";
import DocumentsTab from "../sections/DocumentsTab";
import TrainingDevelopmentTab from "../sections/TrainingDevelopmentTab";

export default function EmployeeProfilePage({ employeeId }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch employee data
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}`);
      return response.data?.data;
    },
  });

  // Navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "personal", label: "Personal Info", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "contact", label: "Contact & Address", icon: Phone },
    { id: "education", label: "Education & Experience", icon: GraduationCap },
    { id: "family", label: "Family Details", icon: Users },
    { id: "banking", label: "Banking & Payroll", icon: CreditCard },
    { id: "statutory", label: "Statutory Compliance", icon: Shield },
    { id: "career", label: "Career Management", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "training", label: "Training & Development", icon: Award },
  ];

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { 
        label: "Active", 
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle 
      },
      probation: { 
        label: "Probation", 
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock 
      },
      inactive: { 
        label: "Inactive", 
        className: "bg-slate-50 text-slate-700 border-slate-200",
        icon: AlertCircle 
      },
      terminated: { 
        label: "Terminated", 
        className: "bg-red-50 text-red-700 border-red-200",
        icon: AlertCircle 
      },
    };
    return configs[status] || configs.inactive;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Failed to load profile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.response?.data?.message || "Please try again"}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = getStatusConfig(employee.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-4 pb-8">
      {/* COMPACT HEADER */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar & Info */}
              <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-background shrink-0">
                  <AvatarImage src={employee.avatar_url} alt={employee.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(employee.name || `${employee.first_name} ${employee.last_name}`)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold truncate">
                      {employee.name || `${employee.first_name} ${employee.last_name}`}
                    </h1>
                    <Badge variant="outline" className={`${statusConfig.className} shrink-0`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {employee.designation?.name || "Not Assigned"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {employee.department?.name || "Not Assigned"}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {employee.employee_code}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined {new Date(employee.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    {employee.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {employee.location.name}
                      </span>
                    )}
                    {employee.manager && (
                      <span className="flex items-center gap-1">
                        <UserCog className="h-3.5 w-3.5" />
                        Reports to {employee.manager.user?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:items-start shrink-0">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Edit className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Promote
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Transfer
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Terminate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* COMPACT STATS */}
          <div className="grid grid-cols-4 divide-x border-t bg-background/50">
            <div className="p-3 text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Tenure</div>
              <div className="text-sm font-semibold">
                {employee.tenure_in_years || 0}y {Math.floor((employee.tenure_in_months || 0) % 12)}m
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Team</div>
              <div className="text-sm font-semibold">{employee.directReports?.length || 0}</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Docs</div>
              <div className="text-sm font-semibold">{employee.documents?.length || 0}</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Training</div>
              <div className="text-sm font-semibold">{employee.trainings?.length || 0}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* VERTICAL TABS LAYOUT */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* LEFT SIDEBAR - VERTICAL NAVIGATION (Desktop) */}
        <div className="hidden lg:block">
          <Card className="sticky top-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <nav className="p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </Card>
        </div>

        {/* MOBILE DROPDOWN */}
        <Card className="lg:hidden">
          <CardContent className="p-3">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {navItems.find(item => item.id === activeTab)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {navItems.filter(item => item.id && item.id !== "").map((item) => {
                  const Icon = item.icon;
                  return (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* RIGHT CONTENT AREA */}
        <div className="min-w-0">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Quick Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium truncate">{employee.email || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{employee.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date of Birth</p>
                          <p className="font-medium">
                            {employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : "Not provided"}
                            {employee.age && <span className="text-muted-foreground text-xs ml-1">({employee.age}y)</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Gender</p>
                          <p className="font-medium capitalize">{employee.gender || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Employment</p>
                          <p className="font-medium capitalize">{employee.employment_type?.replace('_', ' ') || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Work Mode</p>
                          <p className="font-medium capitalize">{employee.work_mode || "Not provided"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {employee.directReports && employee.directReports.length > 0 && (
                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Team ({employee.directReports.length})
                        </h3>
                        <div className="space-y-2">
                          {employee.directReports.slice(0, 4).map((member) => (
                            <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs">
                                  {getInitials(member.user?.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{member.user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{member.user?.email}</p>
                              </div>
                            </div>
                          ))}
                          {employee.directReports.length > 4 && (
                            <Button variant="ghost" size="sm" className="w-full text-xs">
                              View all {employee.directReports.length}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Activity
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-2.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">Updated</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(employee.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {employee.promotions && employee.promotions.length > 0 && (
                          <div className="flex gap-2.5">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">Promoted</p>
                              <p className="text-xs text-muted-foreground">Recent</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start text-sm h-9">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-sm h-9">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-sm h-9">
                          <FileText className="h-4 w-4 mr-2" />
                          Payslips
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && <PersonalInformationTab employee={employee} employeeId={employeeId} />}
          {activeTab === "employment" && <EmploymentDetailsTab employee={employee} employeeId={employeeId} />}
          {activeTab === "contact" && <ContactInformationTab employee={employee} employeeId={employeeId} />}
          {activeTab === "education" && <EducationExperienceTab employee={employee} employeeId={employeeId} />}
          {activeTab === "family" && <FamilyDetailsTab employee={employee} employeeId={employeeId} />}
          {activeTab === "banking" && <BankingPayrollTab employee={employee} employeeId={employeeId} />}
          {activeTab === "statutory" && <StatutoryComplianceTab employee={employee} employeeId={employeeId} />}
          {activeTab === "career" && <CareerManagementTab employee={employee} employeeId={employeeId} />}
          {activeTab === "documents" && <DocumentsTab employee={employee} employeeId={employeeId} />}
          {activeTab === "training" && <TrainingDevelopmentTab employee={employee} employeeId={employeeId} />}
        </div>
      </div>
    </div>
  );
}