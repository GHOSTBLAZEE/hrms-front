import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Plane,
  Building2,
  MapPin,
  Layers,
  Briefcase,
  ClipboardList,
  FileBarChart2,
  Wallet,
  ShieldCheck,
  Clock,
  UserCheck,
  FileSpreadsheet,
  Bell,
  Calendar,
  TrendingUp,
  Lock,
  Settings2,
} from "lucide-react";

// This is your HRMS menu data
export const menuData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
    },
    {
      title: "Workforce",
      url: "#",
      icon: Users,
      permissions: ["view employees"],
      items: [
        {
          title: "Employees",
          url: "/dashboard/employees",
          permissions: ["view employees"],
        },
        {
          title: "My Profile",
          url: "/dashboard/profile",
          permissions: [],
        },
      ],
    },
    {
      title: "Attendance",
      url: "#",
      icon: CalendarCheck,
      permissions: ["view attendance", "view team attendance"],
      items: [
        {
          title: "My Attendance",
          url: "/dashboard/attendance",
          permissions: ["view attendance"],
        },
        {
          title: "Team Attendance",
          url: "/dashboard/attendance/team",
          permissions: ["view team attendance"],
        },
        {
          title: "Corrections",
          url: "/dashboard/attendance/corrections",
          permissions: ["view attendance", "approve attendance correction"],
        },
        {
          title: "Attendance Lock",
          url: "/dashboard/attendance/locks",
          permissions: ["lock attendance"],
        },
      ],
    },
    {
      title: "Leaves",
      url: "#",
      icon: Plane,
      permissions: ["view leave"],
      items: [
        {
          title: "My Leaves",
          url: "/dashboard/leaves",
          permissions: ["view leave"],
        },
        {
          title: "Leave Calendar",
          url: "/dashboard/leaves/calendar",
          permissions: ["view leave"],
        },
      ],
    },
    {
      title: "Approvals",
      url: "/dashboard/approvals",
      icon: ClipboardList,
      permissions: [
        "approve leave",
        "approve attendance correction",
        "approve unlock attendance",
      ],
      badge: "pending_count", // Optional: for showing notification count
    },
    {
      title: "Payroll",
      url: "#",
      icon: Wallet,
      permissions: ["view payroll", "view payslips"],
      items: [
        {
          title: "Payroll Runs",
          url: "/dashboard/payroll/runs",
          permissions: ["view payroll"],
        },
        {
          title: "My Payslips",
          url: "/dashboard/payroll/payslips",
          permissions: ["view payslips"],
        },
        {
          title: "Salary Structures",
          url: "/dashboard/payroll/salary-structures",
          permissions: ["manage salary structures"],
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileBarChart2,
      permissions: [
        "view attendance reports",
        "view leave reports",
        "view payroll reports",
        "view audit logs",
      ],
      items: [
        {
          title: "Attendance Reports",
          url: "/dashboard/reports/attendance",
          permissions: ["view attendance reports"],
        },
        {
          title: "Monthly Summary",
          url: "/dashboard/reports/attendance/monthly",
          permissions: ["view attendance reports"],
        },
        {
          title: "Attendance Integrity",
          url: "/dashboard/reports/attendance-integrity",
          permissions: ["view attendance reports"],
        },
        {
          title: "Leave Reports",
          url: "/dashboard/reports/leaves",
          permissions: ["view leave reports"],
        },
        {
          title: "Payroll Reports",
          url: "/dashboard/reports/payroll",
          permissions: ["view payroll reports"],
        },
        {
          title: "Audit Logs",
          url: "/dashboard/reports/audit-logs",
          permissions: ["view audit logs"],
        },
        {
          title: "Export History",
          url: "/dashboard/reports/exports",
          permissions: ["view exports"],
        },
      ],
    },
  ],

  settings: [
    {
      title: "Configuration",
      url: "#",
      icon: Settings2,
      permissions: [
        "manage companies",
        "manage locations",
        "manage departments",
        "manage designations",
      ],
      items: [
        {
          title: "Companies",
          url: "/dashboard/settings/companies",
          permissions: ["manage companies"],
        },
        {
          title: "Locations",
          url: "/dashboard/settings/locations",
          permissions: ["manage locations"],
        },
        {
          title: "Departments",
          url: "/dashboard/settings/departments",
          permissions: ["manage departments"],
        },
        {
          title: "Designations",
          url: "/dashboard/settings/designations",
          permissions: ["manage designations"],
        },
      ],
    },
    {
      title: "System",
      url: "#",
      icon: ShieldCheck,
      permissions: [
        "manage leave types",
        "manage approval templates",
        "manage roles",
        "manage permissions",
      ],
      items: [
        {
          title: "Leave Types",
          url: "/dashboard/settings/leave-types",
          permissions: ["manage leave types"],
        },
        {
          title: "Approval Workflows",
          url: "/dashboard/settings/approvals",
          permissions: ["manage approval templates"],
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/settings/roles",
          permissions: ["manage roles", "manage permissions"],
        },
      ],
    },
  ],
};

/* ================= HELPER FUNCTIONS ================= */

export function hasPermission(requiredPermissions = [], userPermissions = []) {
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

export function filterMenuItems(items, userPermissions) {
  return items
    .map((item) => {
      // Check if user can see parent item
      const canSeeParent = hasPermission(item.permissions, userPermissions);

      // Check if user can see any submenu items
      const filteredSubItems = item.items
        ? item.items.filter((sub) =>
            hasPermission(sub.permissions, userPermissions)
          )
        : [];

      // Show parent if:
      // 1. User has permission for parent, OR
      // 2. User can see at least one submenu item
      if (!canSeeParent && filteredSubItems.length === 0) {
        return null;
      }

      return {
        ...item,
        items: filteredSubItems.length > 0 ? filteredSubItems : undefined,
      };
    })
    .filter(Boolean);
}