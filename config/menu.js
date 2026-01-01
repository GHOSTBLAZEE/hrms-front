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
  Lock,
  UserCheck,
} from "lucide-react";

export const menu = {
  /* ================= MAIN ================= */
  main: [
    /* ---------- Dashboard ---------- */
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
    },

    /* ---------- Employees ---------- */
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: Users,
      permissions: ["view employees"],
    },

    /* ---------- Approvals (CENTRAL) ---------- */
    {
      title: "Approvals",
      url: "/dashboard/approvals",
      icon: ClipboardList,
      permissions: [
        "approve leave",
        "approve attendance correction",
        "approve overtime",
      ],
    },

    /* ---------- Attendance ---------- */
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: CalendarCheck,
      permissions: ["view attendance"],
      subMenu: [
        {
          title: "My Attendance",
          url: "/dashboard/attendance",
          icon: UserCheck,
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
          permissions: ["view attendance corrections"],
        },
        {
          title: "Approvals",
          url: "/dashboard/attendance/approvals",
          permissions: ["approve attendance correction"],
        },
        {
          title: "Locks",
          url: "/dashboard/attendance/locks",
          icon: Lock,
          permissions: ["lock attendance"],
        },
      ],
    },

    /* ---------- Leaves ---------- */
    {
      title: "Leaves",
      url: "/dashboard/leaves",
      icon: Plane,
      permissions: ["view leave"],
      subMenu: [
        {
          title: "My Leaves",
          url: "/dashboard/leaves",
          permissions: ["view leave"],
        },
      ],
    },

    /* ---------- Payroll ---------- */
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
          title: "Payslips",
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

    /* ---------- Reports ---------- */
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileBarChart2,
      permissions: [
        "view attendance reports",
        "view leave reports",
        "view payroll reports",
        "view audit logs",
        "view exports",
      ],
      subMenu: [
        {
          title: "Attendance Reports",
          url: "/dashboard/reports/attendance",
          permissions: ["view attendance reports"],
        },
        {
          title: "Attendance Integrity",
          url: "/dashboard/reports/attendance-integrity",
          permissions: ["view audit logs"],
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
