"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  User,
  FileText,
  DollarSign,
  Award,
  Clock,
  Calendar,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

// Tab Components (you can create separate files for these later)
function OverviewTab({ employee }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Full Name</p>
            <p className="font-medium">{employee.user?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Employee Code</p>
            <p className="font-medium">{employee.employee_code || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium">{employee.user?.email || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium">{employee.phone || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date of Birth</p>
            <p className="font-medium">
              {employee.date_of_birth
                ? new Date(employee.date_of_birth).toLocaleDateString()
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Gender</p>
            <p className="font-medium capitalize">{employee.gender || "—"}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Department</p>
            <p className="font-medium">{employee.department?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Designation</p>
            <p className="font-medium">{employee.designation?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Employment Type</p>
            <p className="font-medium capitalize">
              {employee.employment_type || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Work Type</p>
            <p className="font-medium capitalize">{employee.work_type || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Join Date</p>
            <p className="font-medium">
              {employee.joined_at
                ? new Date(employee.joined_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="font-medium capitalize">{employee.status || "—"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DocumentsTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No Documents Yet
        </h3>
        <p className="text-slate-500">
          Employee documents will appear here once uploaded.
        </p>
      </div>
    </Card>
  );
}

function PayrollTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Payroll Information
        </h3>
        <p className="text-slate-500">
          Salary and compensation details will be displayed here.
        </p>
      </div>
    </Card>
  );
}

function PerformanceTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Performance Reviews
        </h3>
        <p className="text-slate-500">
          Performance evaluations and reviews will appear here.
        </p>
      </div>
    </Card>
  );
}

function AttendanceTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Attendance Records
        </h3>
        <p className="text-slate-500">
          Time tracking and attendance data will be shown here.
        </p>
      </div>
    </Card>
  );
}

function LeaveTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Leave History
        </h3>
        <p className="text-slate-500">
          Leave requests and balance information will be displayed here.
        </p>
      </div>
    </Card>
  );
}

function TimelineTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Career Timeline
        </h3>
        <p className="text-slate-500">
          Employment history and career progression will appear here.
        </p>
      </div>
    </Card>
  );
}

function NotesTab({ employee }) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Notes</h3>
        <p className="text-slate-500">
          Internal notes and comments about this employee.
        </p>
      </div>
    </Card>
  );
}

export default function ProfileTabs({ employee }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto gap-2 bg-transparent p-0">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <User className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Documents
        </TabsTrigger>
        <TabsTrigger
          value="payroll"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Payroll
        </TabsTrigger>
        <TabsTrigger
          value="performance"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Award className="h-4 w-4 mr-2" />
          Performance
        </TabsTrigger>
        <TabsTrigger
          value="attendance"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Clock className="h-4 w-4 mr-2" />
          Attendance
        </TabsTrigger>
        <TabsTrigger
          value="leave"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Leave
        </TabsTrigger>
        <TabsTrigger
          value="timeline"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Timeline
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Notes
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview" className="mt-0">
          <OverviewTab employee={employee} />
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <DocumentsTab employee={employee} />
        </TabsContent>

        <TabsContent value="payroll" className="mt-0">
          <PayrollTab employee={employee} />
        </TabsContent>

        <TabsContent value="performance" className="mt-0">
          <PerformanceTab employee={employee} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-0">
          <AttendanceTab employee={employee} />
        </TabsContent>

        <TabsContent value="leave" className="mt-0">
          <LeaveTab employee={employee} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <TimelineTab employee={employee} />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <NotesTab employee={employee} />
        </TabsContent>
      </div>
    </Tabs>
  );
}