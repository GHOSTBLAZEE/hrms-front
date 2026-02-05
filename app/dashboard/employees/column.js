"use client";

import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { format } from "date-fns";

/* =========================================================
 | Status Badge Configuration
 |========================================================= */
const getStatusBadge = (status) => {
  const statusConfig = {
    active: {
      variant: "default",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200",
      label: "Active",
    },
    probation: {
      variant: "secondary",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200",
      label: "Probation",
    },
    inactive: {
      variant: "secondary",
      className: "bg-slate-50 text-slate-700 hover:bg-slate-50 border-slate-200",
      label: "Inactive",
    },
    terminated: {
      variant: "destructive",
      className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200",
      label: "Terminated",
    },
    resigned: {
      variant: "secondary",
      className: "bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200",
      label: "Resigned",
    },
    suspended: {
      variant: "destructive",
      className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200",
      label: "Suspended",
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} className={`${config.className} font-medium px-2.5 py-0.5`}>
      {config.label}
    </Badge>
  );
};

/* =========================================================
 | Employment Type Badge Configuration
 |========================================================= */
const getEmploymentTypeBadge = (type) => {
  const typeConfig = {
    full_time: { 
      label: "Full Time", 
      className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50" 
    },
    part_time: { 
      label: "Part Time", 
      className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50" 
    },
    contract: { 
      label: "Contract", 
      className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50" 
    },
    intern: { 
      label: "Intern", 
      className: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-50" 
    },
    consultant: { 
      label: "Consultant", 
      className: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50" 
    },
  };

  const config = typeConfig[type?.toLowerCase()] || { 
    label: type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Not Set", 
    className: "bg-gray-50 text-gray-600 border-gray-200" 
  };

  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-0.5 ${config.className}`}>
      {config.label}
    </Badge>
  );
};

/* =========================================================
 | Utility Functions
 |========================================================= */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid Date";
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/* =========================================================
 | Employee Table Columns
 |========================================================= */
export const columns = [
  {
    accessorKey: "employee_code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Employee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const employee = row.original;
      const fullName = employee.user?.name || 
                      `${employee.user?.first_name || ''} ${employee.user?.last_name || ''}`.trim();
      
      return (
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-10 w-10 border-2 border-muted ring-2 ring-background">
            <AvatarImage 
              src={employee.user?.avatar || employee.user?.profile_photo} 
              alt={fullName} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-sm">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <Link 
              href={`/dashboard/employees/${employee.id}`}
              className="font-semibold text-sm hover:text-primary hover:underline transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {fullName || "Unknown"}
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{employee.employee_code}</span>
              {employee.user?.email && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={`mailto:${employee.user.email}`}
                          className="hover:text-primary transition-colors truncate max-w-[180px] flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{employee.user.email}</span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Send email to {fullName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "designation.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const employee = row.original;
      const designation = employee.designation?.name;
      const department = employee.department?.name;
      
      return (
        <div className="flex flex-col gap-1.5 py-2">
          <span className="font-medium text-sm">
            {designation || <span className="text-muted-foreground">No Position</span>}
          </span>
          {department && (
            <div className="flex items-center gap-1.5">
              <Badge 
                variant="outline" 
                className="font-normal text-xs bg-slate-50/80 text-slate-700 border-slate-200"
              >
                {department}
              </Badge>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "location.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const location = row.original.location;
      
      if (!location?.name) {
        return <span className="text-sm text-muted-foreground">Not Set</span>;
      }

      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{location.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "employment_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.employment_type;
      return getEmploymentTypeBadge(type);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "joined_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Join Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const joinDate = row.original.joined_at;
      
      return (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{formatDate(joinDate)}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right font-semibold">Actions</div>,
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <div className="flex items-center justify-end gap-1">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/dashboard/employees/${employee.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-semibold">Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link 
                  href={`/dashboard/employees/${employee.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Full Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  href={`/dashboard/employees/${employee.id}/edit`}
                  className="flex items-center cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Details</span>
                </Link>
              </DropdownMenuItem>
              
              {employee.user?.email && (
                <DropdownMenuItem asChild>
                  <a
                    href={`mailto:${employee.user.email}`}
                    className="flex items-center cursor-pointer"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Send Email</span>
                  </a>
                </DropdownMenuItem>
              )}
              
              {employee.user?.phone && (
                <DropdownMenuItem asChild>
                  <a
                    href={`tel:${employee.user.phone}`}
                    className="flex items-center cursor-pointer"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    <span>Call Employee</span>
                  </a>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add your deactivate handler here
                  console.log('Deactivate employee:', employee.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Deactivate</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

/* =========================================================
 | Global Search Configuration
 | Define which fields should be searchable
 |========================================================= */
export const employeeSearchKeys = [
  "employee_code",
  "user.name",
  "user.first_name",
  "user.last_name",
  "user.email",
  "designation.name",
  "department.name",
  "location.name",
  "status",
  "employment_type",
];