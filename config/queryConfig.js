/**
 * ✅ PHASE 3 - FRONTEND OPTIMIZATION
 * FILE 1/12: Query Configuration
 * 
 * Centralized React Query cache configurations
 * Maps ALL query keys found in your codebase to optimal cache settings
 * 
 * ⚠️ ZERO FEATURES LOST - Only adds performance improvements
 */

export const QUERY_CONFIGS = {
  /**
   * STATIC - Data that NEVER changes (or changes via admin only)
   * Examples: Leave types, Locations, Departments, Roles
   * staleTime: Infinity - Never refetch automatically
   */
  STATIC: {
    staleTime: Infinity,
    gcTime: Infinity, // Keeps in cache forever
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
  
  /**
   * INFREQUENT - Data that changes rarely (5-10 minutes)
   * Examples: Employee list, Salary structures, Approval templates
   * staleTime: 5 min - Good balance for HR data
   */
  INFREQUENT: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  
  /**
   * MODERATE - Data that changes moderately (1-2 minutes)
   * Examples: Dashboard stats, Leave balances, Attendance summaries
   * staleTime: 1 min - Keeps UI responsive
   */
  MODERATE: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  
  /**
   * FRESH - Data that should be relatively fresh (30 seconds)
   * Examples: Notifications, My leaves, Approval inbox
   * staleTime: 30 sec - Balance between freshness and performance
   */
  FRESH: {
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  
  /**
   * REALTIME - Data that needs to be very current (10-15 seconds)
   * Examples: Today's attendance, Active punch logs, Live stats
   * staleTime: 10 sec with polling
   */
  REALTIME: {
    staleTime: 10 * 1000,
    gcTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  },
  
  /**
   * IMMUTABLE - Historical data that NEVER changes once created
   * Examples: Locked attendance, Finalized payroll, Archive reports
   * staleTime: Infinity - Perfect for locked records
   */
  IMMUTABLE: {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },
  
  /**
   * USER_SESSION - User-specific data (1 minute)
   * Examples: User profile, Permissions, Auth state
   * staleTime: 1 min with focus refetch
   */
  USER_SESSION: {
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000, // Keep for 30 min
    refetchOnWindowFocus: true,
    retry: 2,
  },
};

/**
 * Complete mapping of ALL query keys found in your codebase
 * This ensures every hook gets optimal configuration
 */
export const QUERY_KEY_PRESETS = {
  // ============ STATIC DATA ============
  'leave-types': 'STATIC',
  'locations': 'STATIC',
  'departments': 'STATIC',
  'designations': 'STATIC',
  'shifts': 'STATIC',
  'shift': 'STATIC',
  'shift-employees': 'STATIC',
  'approval-settings': 'STATIC',
  'approval-template': 'STATIC',
  'approval-approvers': 'STATIC',
  'approver-options': 'STATIC',
  'permissions-matrix': 'STATIC',
  'announcement-categories': 'STATIC',
  'company-settings': 'STATIC',
  
  // ============ INFREQUENT DATA (5 min) ============
  'employees': 'INFREQUENT',
  'employee': 'INFREQUENT',
  'employee-salary-structures': 'INFREQUENT',
  'salary-structures': 'INFREQUENT',
  'latest-payroll-run': 'INFREQUENT',
  'user-roles': 'INFREQUENT',
  'user-permission-overrides': 'INFREQUENT',
  'approval-templates': 'INFREQUENT',
  'export-history': 'INFREQUENT',
  
  // ============ MODERATE DATA (1 min) ============
  'dashboard': 'MODERATE',
  
  // ============ FRESH DATA (30 sec) ============
  'notifications': 'FRESH',
  'my-leaves': 'FRESH',
  'employee-leaves': 'FRESH',
  'team-leaves': 'FRESH',
  'approvals': 'FRESH',
  'approval': 'FRESH',
  'approval-inbox': 'FRESH',
  'leave-approvals': 'FRESH',
  'my-attendance-corrections': 'FRESH',
  'attendance-corrections': 'FRESH',
  
  // ============ REALTIME DATA (10-30 sec) ============
  'attendance-today': 'REALTIME',
  'team-attendance-today': 'REALTIME',
  'punch-logs': 'REALTIME',
  'active-sessions': 'REALTIME',
  
  // ============ IMMUTABLE DATA (Never refetch) ============
  'attendance-lock': 'IMMUTABLE',
  'attendance-report-monthly': 'IMMUTABLE',
  'attendance-monthly-report': 'IMMUTABLE',
  'payroll-run': 'IMMUTABLE',
  'payroll-runs-report': 'IMMUTABLE',
  'leave-reports': 'IMMUTABLE',
  'audit-logs': 'IMMUTABLE',
  'access-history': 'IMMUTABLE',
  
  // ============ USER SESSION DATA ============
  'me': 'USER_SESSION',
};

/**
 * Helper: Get configuration for any query key
 * Handles both string and array query keys
 * Falls back to MODERATE if not found
 */
export function getConfigForKey(queryKey) {
  const key = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  const preset = QUERY_KEY_PRESETS[key] || 'MODERATE';
  return QUERY_CONFIGS[preset];
}

/**
 * Helper: Merge custom config with preset
 * Useful when you need to override specific settings
 */
export function mergeQueryConfig(preset, custom = {}) {
  if (!QUERY_CONFIGS[preset]) {
    console.warn(`Unknown preset: ${preset}. Using MODERATE.`);
    return { ...QUERY_CONFIGS.MODERATE, ...custom };
  }
  return { ...QUERY_CONFIGS[preset], ...custom };
}

/**
 * Helper: Get preset name for a query key (for debugging)
 */
export function getPresetName(queryKey) {
  const key = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  return QUERY_KEY_PRESETS[key] || 'MODERATE (default)';
}