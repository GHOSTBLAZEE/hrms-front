export const routePermissions = [
  {
    path: "/dashboard/attendance/reports",
    permissions: ["view attendance reports"],
  },
  {
    path: "/dashboard/payroll",
    permissions: ["view payroll"],
  },
  {
    path: "/dashboard/payroll/reports",
    permissions: ["view payroll reports"],
  },
  {
    path: "/dashboard/leaves/reports",
    permissions: ["view leave reports"],
  },
  {
    path: "/dashboard/reports/audit-logs",
    permissions: ["view audit logs"],
  },
  {
    path: "/dashboard/settings",
    permissions: [
      "manage companies",
      "manage locations",
      "manage departments",
      "manage designations",
      "manage roles",
      "manage permissions",
    ],
  },
];
