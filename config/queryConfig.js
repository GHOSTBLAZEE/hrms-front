/**
 * Centralized React Query cache configurations
 */

export const QUERY_CONFIGS = {
  STATIC: {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },

  INFREQUENT: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  MODERATE: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  },

  FRESH: {
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  },

  REALTIME: {
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000,
  },

  IMMUTABLE: {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },

  USER_SESSION: {
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  },
};

export const QUERY_KEY_PRESETS = {
  // ============ STATIC DATA ============
  "leave-types":              "STATIC",
  "locations":                "STATIC",
  "departments":              "STATIC",
  "designations":             "STATIC",
  "approval-settings":        "STATIC",
  "approval-template":        "STATIC",
  "approval-approvers":       "STATIC",
  "approver-options":         "STATIC",
  "permissions-matrix":       "STATIC",
  "announcement-categories":  "STATIC",
  "company-settings":         "STATIC",
  "company-current":          "STATIC",   // company info for sidebar
  "company-feature-flags":    "STATIC",   // feature flags for nav

  // ============ INFREQUENT DATA (5 min) ============
  "shifts":                       "INFREQUENT",
  "shift":                        "INFREQUENT",
  "shift-employees":              "INFREQUENT",
  "employees":                    "INFREQUENT",
  "employee":                     "INFREQUENT",
  "employee-salary-structures":   "INFREQUENT",
  "salary-structures":            "INFREQUENT",
  "latest-payroll-run":           "INFREQUENT",
  "user-roles":                   "INFREQUENT",
  "user-permission-overrides":    "INFREQUENT",
  "approval-templates":           "INFREQUENT",
  "export-history":               "INFREQUENT",
  // Attendance monthly report: NOT immutable — can be recalculated/corrected
  "attendance-monthly-report":    "INFREQUENT",
  "attendance-report-monthly":    "INFREQUENT",

  // ============ MODERATE DATA (1 min) ============
  "dashboard":                    "MODERATE",

  // ============ FRESH DATA (30 sec) ============
  "notifications":                "FRESH",
  "my-leaves":                    "FRESH",
  "employee-leaves":              "FRESH",
  "team-leaves":                  "FRESH",
  "approvals":                    "FRESH",
  "approval":                     "FRESH",
  "approval-inbox":               "FRESH",
  "leave-approvals":              "FRESH",
  "my-attendance-corrections":    "FRESH",
  "attendance-corrections":       "FRESH",
  // FIX: attendance-lock is MUTABLE (lock/unlock operations exist)
  // was incorrectly set to IMMUTABLE which prevented cache invalidation from working
  "attendance-lock":              "FRESH",

  // ============ REALTIME DATA (10-30 sec) ============
  "attendance-today":             "REALTIME",
  "team-attendance-today":        "REALTIME",
  "punch-logs":                   "REALTIME",
  "active-sessions":              "REALTIME",

  // ============ IMMUTABLE DATA (Never refetch) ============
  // Only truly immutable: finalized payroll runs, audit trail
  "payroll-run":                  "IMMUTABLE",
  "payroll-runs-report":          "IMMUTABLE",
  "leave-reports":                "IMMUTABLE",
  "audit-logs":                   "IMMUTABLE",
  "access-history":               "IMMUTABLE",

  // ============ USER SESSION DATA ============
  "me":                           "USER_SESSION",
};

export function getConfigForKey(queryKey) {
  const key = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  const preset = QUERY_KEY_PRESETS[key] || "MODERATE";
  return QUERY_CONFIGS[preset];
}

export function mergeQueryConfig(preset, custom = {}) {
  if (!QUERY_CONFIGS[preset]) {
    console.warn(`Unknown preset: ${preset}. Using MODERATE.`);
    return { ...QUERY_CONFIGS.MODERATE, ...custom };
  }
  return { ...QUERY_CONFIGS[preset], ...custom };
}

export function getPresetName(queryKey) {
  const key = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  return QUERY_KEY_PRESETS[key] || "MODERATE (default)";
}