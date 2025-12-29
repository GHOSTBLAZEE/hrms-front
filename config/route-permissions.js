export const routePermissions = [
  /* ================= ATTENDANCE ================= */
  {
    path: "/dashboard/attendance",
    permissions: ["view attendance"],
  },

  /* ================= LEAVES ================= */
  {
    path: "/dashboard/leaves",
    permissions: ["view leave"],
  },

  /* ================= PAYROLL ================= */
  {
    path: "/dashboard/payroll",
    permissions: ["view payroll"],
  },

  /* ================= REPORTS ================= */
  {
    path: "/dashboard/reports/attendance",
    permissions: ["view attendance reports"],
  },
  {
    path: "/dashboard/reports/leaves",
    permissions: ["view leave reports"],
  },
  {
    path: "/dashboard/reports/payroll",
    permissions: ["view payroll reports"],
  },
  {
    path: "/dashboard/reports/audit-logs",
    permissions: ["view audit logs"],
  },
  {
    path: "/dashboard/reports/exports",
    permissions: ["view exports"],
  },

  /* ================= SETTINGS ================= */
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
