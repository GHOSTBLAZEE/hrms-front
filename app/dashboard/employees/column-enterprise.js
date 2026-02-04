"use client";

import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, Mail, Phone } from "lucide-react";
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

// Status badge styling
const getStatusBadge = (status) => {
  const statusConfig = {
    active: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      label: "Active",
    },
    probation: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
      label: "Probation",
    },
    inactive: {
      variant: "secondary",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
      label: "Inactive",
    },
    terminated: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
      label: "Terminated",
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
};

// Employment type badge
const getEmploymentTypeBadge = (type) => {
  const typeConfig = {
    full_time: { label: "Full Time", className: "bg-blue-50 text-blue-700 border-blue-200" },
    part_time: { label: "Part Time", className: "bg-purple-50 text-purple-700 border-purple-200" },
    contract: { label: "Contract", className: "bg-orange-50 text-orange-700 border-orange-200" },
    intern: { label: "Intern", className: "bg-pink-50 text-pink-700 border-pink-200" },
  };

  const config = typeConfig[type?.toLowerCase()] || { label: type || "N/A", className: "" };

  return (
    <Badge variant="outline" className={`font-normal ${config.className}`}>
      {config.label}
    </Badge>
  );
};

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
          Employee ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-muted">
            <AvatarImage src={employee.user?.avatar} alt={employee.user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
              {employee.user?.name?.charAt(0) || employee.employee_code?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link 
              href={`/dashboard/employees/${employee.id}`}
              className="font-medium text-sm hover:text-primary hover:underline transition-colors"
            >
              {employee.employee_code}
            </Link>
            <span className="text-xs text-muted-foreground">
              ID: {employee.id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Employee Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex flex-col">
          <Link 
            href={`/dashboard/employees/${employee.id}`}
            className="font-medium hover:text-primary hover:underline transition-colors"
          >
            {employee.user?.name || "N/A"}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={`mailto:${employee.user?.email}`}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-3 w-3" />
                    {employee.user?.email}
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send email to {employee.user?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">
            {employee.designation?.name || "N/A"}
          </span>
          <span className="text-xs text-muted-foreground">
            {employee.department?.name || "No Department"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "department.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold"
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const department = row.original.department?.name;
      return (
        <Badge variant="outline" className="font-normal bg-slate-50">
          {department || "Unassigned"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "location.name",
    header: "Location",
    cell: ({ row }) => {
      const location = row.original.location?.name;
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{location || "N/A"}</span>
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
      const date = row.original.joined_at;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      
      const joinDate = new Date(date);
      const today = new Date();
      const monthsWorked = Math.floor(
        (today - joinDate) / (1000 * 60 * 60 * 24 * 30)
      );

      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-xs text-muted-foreground">
            {monthsWorked < 1
              ? "< 1 month"
              : monthsWorked === 1
              ? "1 month"
              : `${monthsWorked} months`}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <div className="flex items-center justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
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
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link 
                  href={`/dashboard/employees/${employee.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
