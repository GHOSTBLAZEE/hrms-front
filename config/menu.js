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
  CalendarDays,
  UsersRound,
  History,
} from "lucide-react";

// ✅ OPTIMIZED HRMS Menu with proper enterprise organization
export const menuData = {
  // ================= MAIN NAVIGATION =================
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
    },
    
    // ================= WORKFORCE MANAGEMENT =================
    {
      title: "Workforce",
      url: "#",
      icon: Users,
      permissions: ["view employees"],
      items: [
        {
          title: "All Employees",
          url: "/dashboard/employees",
          permissions: ["view employees"],
          icon: Users,
        },
        {
          title: "My Profile",
          url: "/dashboard/profile",
          permissions: [],
          icon: UserCheck,
        },
      ],
    },
    
    // ================= ATTENDANCE MANAGEMENT =================
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
          icon: Clock,
        },
        {
          title: "Team Attendance",
          url: "/dashboard/attendance/team",
          permissions: ["view team attendance"],
          icon: UsersRound,
        },
        {
          title: "Corrections",
          url: "/dashboard/attendance/corrections",
          permissions: ["view attendance", "approve attendance correction"],
          icon: ClipboardList,
        },
        {
          title: "Monthly Reports",
          url: "/dashboard/attendance/reports/monthly",
          permissions: ["view attendance reports"],
          icon: FileSpreadsheet,
        },
        {
          title: "Attendance Lock",
          url: "/dashboard/attendance/locks",
          permissions: ["lock attendance"],
          icon: Lock,
        },
      ],
    },
    
    // ================= LEAVE MANAGEMENT =================
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
          icon: Calendar,
          description: "Apply and manage your leaves",
        },
        {
          title: "Team Calendar",
          url: "/dashboard/leaves/team",
          permissions: ["view team leaves"],
          icon: CalendarDays,
          description: "View team availability",
        },
      ],
    },
    
    // ================= APPROVALS =================
    {
      title: "Approvals",
      url: "/dashboard/approvals",
      icon: ClipboardList,
      permissions: [
        "approve leave",
        "approve attendance correction",
        "approve unlock attendance",
      ],
      badge: "pending_count",
    },
    
    // ================= PAYROLL =================
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
          icon: Wallet,
        },
        {
          title: "My Payslips",
          url: "/dashboard/payroll/payslips",
          permissions: ["view payslips"],
          icon: FileSpreadsheet,
        },
        {
          title: "Salary Structures",
          url: "/dashboard/payroll/salary-structures",
          permissions: ["manage salary structures"],
          icon: TrendingUp,
        },
      ],
    },
    
    // ================= REPORTS & ANALYTICS =================
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
          icon: CalendarCheck,
        },
        {
          title: "Attendance Integrity",
          url: "/dashboard/reports/attendance-integrity",
          permissions: ["view attendance reports"],
          icon: ShieldCheck,
        },
        {
          title: "Leave Reports",
          url: "/dashboard/reports/leaves",
          permissions: ["view leave reports"],
          icon: Plane,
        },
        {
          title: "Payroll Reports",
          url: "/dashboard/reports/payroll",
          permissions: ["view payroll reports"],
          icon: Wallet,
        },
        {
          title: "Audit Logs",
          url: "/dashboard/reports/audit-logs",
          permissions: ["view audit logs"],
          icon: History,
        },
        {
          title: "Export History",
          url: "/dashboard/reports/exports",
          permissions: ["view exports"],
          icon: FileSpreadsheet,
        },
      ],
    },
  ],

  // ================= SETTINGS & CONFIGURATION =================
  settings: [
    {
      title: "Organization",
      url: "#",
      icon: Building2,
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
          icon: Building2,
        },
        {
          title: "Locations",
          url: "/dashboard/settings/locations",
          permissions: ["manage locations"],
          icon: MapPin,
        },
        {
          title: "Departments",
          url: "/dashboard/settings/departments",
          permissions: ["manage departments"],
          icon: Layers,
        },
        {
          title: "Designations",
          url: "/dashboard/settings/designations",
          permissions: ["manage designations"],
          icon: Briefcase,
        },
      ],
    },
    {
      title: "System Settings",
      url: "#",
      icon: Settings2,
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
          icon: Plane,
        },
        {
          title: "Approval Workflows",
          url: "/dashboard/settings/approvals/templates",
          permissions: ["manage approval templates"],
          icon: ClipboardList,
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/settings/permissions",
          permissions: ["manage roles", "manage permissions"],
          icon: ShieldCheck,
        },
      ],
    },
  ],
};

/* ================= HELPER FUNCTIONS ================= */

/**
 * Check if user has any of the required permissions
 */
export function hasPermission(requiredPermissions = [], userPermissions = []) {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!userPermissions || userPermissions.length === 0) return false;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Filter menu items based on user permissions
 * Returns only items the user can access
 */
export function filterMenuItems(items, userPermissions) {
  if (!items || !Array.isArray(items)) return [];
  
  return items
    .map((item) => {
      // Check if user can see parent item
      const canSeeParent = hasPermission(item.permissions, userPermissions);

      // Filter submenu items
      const filteredSubItems = item.items
        ? filterMenuItems(item.items, userPermissions)
        : [];

      // Show parent if user has permission OR can see submenu items
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

/**
 * Get filtered navigation for current user
 */
export function getFilteredNavigation(userPermissions = []) {
  return {
    navMain: filterMenuItems(menuData.navMain, userPermissions),
    settings: filterMenuItems(menuData.settings, userPermissions),
  };
}

/**
 * Check if current path matches menu item
 */
export function isActiveRoute(itemUrl, currentPath) {
  if (itemUrl === "/dashboard" && currentPath === "/dashboard") return true;
  if (itemUrl === "/dashboard") return false;
  return currentPath.startsWith(itemUrl);
}