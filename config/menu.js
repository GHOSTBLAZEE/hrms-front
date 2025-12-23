import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Plane,
  Settings,
  Building2,
  MapPin,
  Layers,
  Briefcase,
  ClipboardList,
  FileBarChart2,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export const menu = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
    },

    /* ================= EMPLOYEES ================= */
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: Users,
      permissions: ["view employees"],
    },

    /* ================= ATTENDANCE ================= */
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: CalendarCheck,
      permissions: ["view attendance"],
      subMenu: [
        {
          title: "My Attendance",
          url: "/dashboard/attendance/my",
          permissions: ["view attendance"],
        },
        {
          title: "Team Attendance",
          url: "/dashboard/attendance/team",
          permissions: ["view team attendance"],
        },
        {
          title: "Attendance Reports",
          url: "/dashboard/attendance/reports/monthly",
          permissions: ["view attendance reports"],
        },
      ],
    },

    /* ================= LEAVES ================= */
    {
      title: "Leaves",
      url: "/dashboard/leaves",
      icon: Plane,
      permissions: ["view leave"],
      subMenu: [
        {
          title: "My Leaves",
          url: "/dashboard/leaves/my",
          permissions: ["view leave"],
        },
        {
          title: "Leave Approvals",
          url: "/dashboard/leaves/approvals",
          permissions: ["approve leave"],
        },
        {
          title: "Leave Reports",
          url: "/dashboard/leaves/reports",
          permissions: ["view leave reports"],
        },
      ],
    },

    /* ================= PAYROLL ================= */
    {
      title: "Payroll",
      url: "/dashboard/payroll",
      icon: Wallet,
      permissions: ["view payroll"],
      subMenu: [
        {
          title: "Payroll Runs",
          url: "/dashboard/payroll/runs",
          permissions: ["view payroll"],
        },
        {
          title: "Attendance Lock",
          url: "/dashboard/payroll/attendance-locks",
          permissions: ["manage payroll"],
        },
        {
          title: "Payslips",
          url: "/dashboard/payroll/payslips",
          permissions: ["view payslips"],
        },
        {
          title: "Payroll Reports",
          url: "/dashboard/payroll/reports",
          permissions: ["view payroll reports"],
        },
      ],
    },

    /* ================= REPORTS ================= */
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileBarChart2,
      permissions: ["view reports"],
      subMenu: [
        {
          title: "Attendance Report",
          url: "/dashboard/attendance/reports/monthly",
          permissions: ["view attendance reports"],
        },
        {
          title: "Leave Report",
          url: "/dashboard/leaves/reports",
          permissions: ["view leave reports"],
        },
        {
          title: "Payroll Report",
          url: "/dashboard/reports/payroll",
          permissions: ["view payroll reports"],
        },
        {
          title: "Audit Logs",
          url: "/dashboard/reports/audit-logs",
          permissions: ["view audit logs"],
        },
      ],
    },
  ],

  /* ================= SETTINGS ================= */
  settings: [
    {
      title: "Companies",
      url: "/dashboard/settings/companies",
      icon: Building2,
      permissions: ["manage companies"],
    },
    {
      title: "Locations",
      url: "/dashboard/settings/locations",
      icon: MapPin,
      permissions: ["manage locations"],
    },
    {
      title: "Departments",
      url: "/dashboard/settings/departments",
      icon: Layers,
      permissions: ["manage departments"],
    },
    {
      title: "Designations",
      url: "/dashboard/settings/designations",
      icon: Briefcase,
      permissions: ["manage designations"],
    },
    {
      title: "Roles & Permissions",
      url: "/dashboard/settings/roles",
      icon: ShieldCheck,
      permissions: ["manage roles", "manage permissions"],
    },
  ],
};
