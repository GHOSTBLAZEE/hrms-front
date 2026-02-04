"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  Users,
  Edit,
  MoreVertical,
  TrendingUp,
  UserPlus,
  FileText,
  Award,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import EditProfileDrawer from "./EditProfileDrawer";
import PromoteEmployeeDialog from "./PromoteEmployeeDialog";
import TransferEmployeeDialog from "./TransferEmployeeDialog";

export default function ProfileHeader({ employee, onUpdate }) {
  const [editOpen, setEditOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "onboarding":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "terminated":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getTenure = (joinedAt) => {
    if (!joinedAt) return "N/A";
    const start = new Date(joinedAt);
    const now = new Date();
    const months =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0)
      return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <>
      {/* Header Banner */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="px-6 pb-6">
          {/* Avatar & Name Section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 relative">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-2 ring-slate-100">
                <AvatarImage src={employee.user?.avatar} />
                <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {getInitials(employee.user?.name)}
                </AvatarFallback>
              </Avatar>

              {/* Name & Title */}
              <div className="space-y-1 sm:mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {employee.user?.name || "Unknown"}
                  </h1>
                  <Badge
                    variant="outline"
                    className={getStatusColor(employee.status)}
                  >
                    {employee.status?.charAt(0).toUpperCase() +
                      employee.status?.slice(1)}
                  </Badge>
                </div>
                <p className="text-slate-600 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {employee.designation?.name || "No Designation"} •{" "}
                  {employee.department?.name || "No Department"}
                </p>
                <p className="text-sm text-slate-500 font-mono">
                  {employee.employee_code}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {employee.can?.update && (
                <>
                  <Button
                    onClick={() => setEditOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => setPromoteOpen(true)}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Promote Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTransferOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Transfer Employee
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Letter
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Award className="h-4 w-4 mr-2" />
                        Add Performance Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="h-4 w-4 text-blue-600" />
                Contact Information
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                  <a
                    href={`mailto:${employee.user?.email}`}
                    className="text-slate-700 hover:text-blue-600 hover:underline"
                  >
                    {employee.user?.email || "—"}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-slate-700">
                    {employee.phone || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <MapPin className="h-4 w-4 text-blue-600" />
                Work Location
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-slate-700">
                    {employee.location?.name || "No Location"}
                  </span>
                </div>
                {employee.location?.address && (
                  <p className="text-slate-500 text-xs pl-6">
                    {employee.location.address}
                  </p>
                )}
              </div>
            </div>

            {/* Manager */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Users className="h-4 w-4 text-blue-600" />
                Reports To
              </div>
              <div className="text-sm">
                {employee.manager ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.manager.user?.avatar} />
                      <AvatarFallback className="text-xs bg-slate-200">
                        {getInitials(employee.manager.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">
                        {employee.manager.user?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {employee.manager.employee_code}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">No Manager</p>
                )}
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Calendar className="h-4 w-4 text-blue-600" />
                Employment Details
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-slate-700 font-medium">
                    {employee.joined_at
                      ? new Date(employee.joined_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tenure</p>
                  <p className="text-slate-700 font-medium">
                    {getTenure(employee.joined_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialogs */}
      <EditProfileDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={employee}
        onUpdate={onUpdate}
      />
      <PromoteEmployeeDialog
        open={promoteOpen}
        onOpenChange={setPromoteOpen}
        employee={employee}
        onUpdate={onUpdate}
      />
      <TransferEmployeeDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        employee={employee}
        onUpdate={onUpdate}
      />
    </>
  );
}