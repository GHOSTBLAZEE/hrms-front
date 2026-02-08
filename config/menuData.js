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
  Award,
  GraduationCap,
  Target,
  UserPlus,
  FileText,
  Heart,
  Laptop,
  Timer,
  Receipt,
  Network,
  HelpCircle,
  Zap,
  BookOpen,
  Star,
  CheckCircle,
  Megaphone,
  BarChart3,
  DollarSign,
  Shield,
  Mail,
  MessageSquare,
  CloudDownload,
  Settings,
  Activity,
  Globe,
  Boxes,
} from "lucide-react";

// ============================================================================
// COMPLETE ENTERPRISE HRMS MENU STRUCTURE
// ============================================================================
// Includes ALL modules: Core + Training + Performance + Recruitment + 
// Self-Service + Asset Management + Expenses + Time Tracking + more
// 
// Features: i18n, breadcrumbs, search, shortcuts, analytics, feature flags,
// multi-tenancy, badges, status labels, external links, and more
// ============================================================================

export const menuData = {
  // ================= MAIN NAVIGATION =================
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      i18nKey: "menu.dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
      breadcrumb: {
        label: "Dashboard",
        path: ["Dashboard"],
      },
      searchKeywords: ["home", "overview", "main", "start", "analytics", "insights"],
      quickAccess: true,
      shortcut: {
        key: "d",
        modifier: "ctrl+shift",
        description: "Go to Dashboard",
      },
      analytics: {
        event: "navigate_dashboard",
        category: "navigation",
      },
      meta: {
        pageTitle: "Dashboard | HRMS",
        description: "HRMS Dashboard - Overview and Analytics",
      },
      mobileVisible: true,
      mobileOrder: 1,
    },

    // ================= WORKFORCE MANAGEMENT =================
    {
      id: "workforce",
      title: "Workforce",
      i18nKey: "menu.workforce",
      url: "#",
      icon: Users,
      permissions: ["view employees"],
      searchKeywords: ["employees", "staff", "workers", "team", "people", "hr", "workforce"],
      analytics: {
        event: "menu_workforce",
        category: "navigation",
      },
      mobileVisible: true,
      mobileOrder: 2,
      items: [
        {
          id: "all-employees",
          title: "All Employees",
          i18nKey: "menu.workforce.all_employees",
          url: "/dashboard/employees",
          permissions: ["view employees"],
          icon: Users,
          breadcrumb: {
            label: "Employees",
            parent: "Workforce",
            path: ["Dashboard", "Workforce", "Employees"],
          },
          searchKeywords: ["employee list", "staff directory", "team members", "people", "directory"],
          quickAccess: true,
          shortcut: {
            key: "e",
            modifier: "ctrl+shift",
          },
          analytics: {
            event: "view_employees",
            category: "workforce",
          },
          meta: {
            pageTitle: "All Employees | HRMS",
            description: "View and manage all employees in the organization",
          },
        },
        {
          id: "org-chart",
          title: "Organization Chart",
          i18nKey: "menu.workforce.org_chart",
          url: "/dashboard/org-chart",
          permissions: ["view organization"],
          icon: Network,
          breadcrumb: {
            label: "Org Chart",
            parent: "Workforce",
            path: ["Dashboard", "Workforce", "Organization Chart"],
          },
          searchKeywords: ["org chart", "hierarchy", "structure", "reporting"],
          analytics: {
            event: "view_org_chart",
            category: "workforce",
          },
        },
        {
          id: "my-profile",
          title: "My Profile",
          i18nKey: "menu.workforce.my_profile",
          url: "/dashboard/profile",
          permissions: [],
          icon: UserCheck,
          breadcrumb: {
            label: "My Profile",
            parent: "Workforce",
            path: ["Dashboard", "Workforce", "My Profile"],
          },
          searchKeywords: ["profile", "personal info", "my details", "settings"],
          quickAccess: true,
          shortcut: {
            key: "p",
            modifier: "ctrl+shift",
          },
          analytics: {
            event: "view_profile",
            category: "workforce",
          },
        },
        {
          id: "shift-management",
          title: "Shift Management",
          i18nKey: "menu.workforce.shifts",
          url: "/dashboard/shifts",
          permissions: ["manage shifts"],
          icon: Clock,
          breadcrumb: {
            label: "Shifts",
            parent: "Workforce",
            path: ["Dashboard", "Workforce", "Shifts"],
          },
          searchKeywords: ["shifts", "schedules", "rosters", "timing", "work schedules"],
          analytics: {
            event: "manage_shifts",
            category: "workforce",
          },
        },
      ],
    },

    // ================= ATTENDANCE MANAGEMENT =================
    {
      id: "attendance",
      title: "Attendance",
      i18nKey: "menu.attendance",
      url: "#",
      icon: CalendarCheck,
      permissions: ["view attendance", "view team attendance"],
      searchKeywords: ["attendance", "time tracking", "clock in", "presence", "check in"],
      analytics: {
        event: "menu_attendance",
        category: "navigation",
      },
      mobileVisible: true,
      mobileOrder: 3,
      items: [
        {
          id: "my-attendance",
          title: "My Attendance",
          i18nKey: "menu.attendance.my_attendance",
          url: "/dashboard/attendance",
          permissions: ["view attendance"],
          icon: Clock,
          breadcrumb: {
            label: "My Attendance",
            parent: "Attendance",
            path: ["Dashboard", "Attendance", "My Attendance"],
          },
          searchKeywords: ["my time", "my clock in", "my records", "my attendance"],
          quickAccess: true,
          analytics: {
            event: "view_my_attendance",
            category: "attendance",
          },
        },
        {
          id: "team-attendance",
          title: "Team Attendance",
          i18nKey: "menu.attendance.team",
          url: "/dashboard/attendance/team",
          permissions: ["view team attendance"],
          icon: UsersRound,
          breadcrumb: {
            label: "Team Attendance",
            parent: "Attendance",
            path: ["Dashboard", "Attendance", "Team"],
          },
          searchKeywords: ["team time", "staff attendance", "team presence"],
          analytics: {
            event: "view_team_attendance",
            category: "attendance",
          },
        },
        {
          id: "attendance-corrections",
          title: "Corrections",
          i18nKey: "menu.attendance.corrections",
          url: "/dashboard/attendance/corrections",
          permissions: ["view attendance", "approve attendance correction"],
          icon: ClipboardList,
          breadcrumb: {
            label: "Corrections",
            parent: "Attendance",
            path: ["Dashboard", "Attendance", "Corrections"],
          },
          searchKeywords: ["corrections", "adjustments", "fixes", "amendments"],
          notifications: {
            type: "count",
            source: "pending_corrections",
            color: "orange",
            refreshInterval: 60000,
          },
          analytics: {
            event: "view_corrections",
            category: "attendance",
          },
        },
        {
          id: "attendance-monthly-reports",
          title: "Monthly Reports",
          i18nKey: "menu.attendance.reports",
          url: "/dashboard/attendance/reports/monthly",
          permissions: ["view attendance reports"],
          icon: FileSpreadsheet,
          breadcrumb: {
            label: "Reports",
            parent: "Attendance",
            path: ["Dashboard", "Attendance", "Reports"],
          },
          searchKeywords: ["reports", "monthly", "summary", "attendance report"],
          analytics: {
            event: "view_attendance_reports",
            category: "attendance",
          },
        },
        {
          id: "attendance-lock",
          title: "Attendance Lock",
          i18nKey: "menu.attendance.lock",
          url: "/dashboard/attendance/locks",
          permissions: ["lock attendance"],
          icon: Lock,
          breadcrumb: {
            label: "Lock",
            parent: "Attendance",
            path: ["Dashboard", "Attendance", "Lock"],
          },
          searchKeywords: ["lock", "freeze", "finalize", "close period"],
          audit: {
            trackAccess: true,
            sensitivityLevel: "high",
          },
          analytics: {
            event: "manage_attendance_lock",
            category: "attendance",
          },
        },
      ],
    },

    // ================= TIME TRACKING =================
    {
      id: "time-tracking",
      title: "Time Tracking",
      i18nKey: "menu.time_tracking",
      url: "#",
      icon: Timer,
      permissions: ["track time", "view timesheets"],
      searchKeywords: ["time tracking", "timesheets", "hours", "billable", "projects"],
      analytics: {
        event: "menu_time_tracking",
        category: "navigation",
      },
      items: [
        {
          id: "my-timesheets",
          title: "My Timesheets",
          i18nKey: "menu.time_tracking.my_timesheets",
          url: "/dashboard/time-tracking/timesheets",
          permissions: ["track time"],
          icon: Timer,
          breadcrumb: {
            label: "My Timesheets",
            parent: "Time Tracking",
            path: ["Dashboard", "Time Tracking", "Timesheets"],
          },
          searchKeywords: ["log time", "track hours", "timesheet entry"],
          quickAccess: true,
          analytics: {
            event: "view_timesheets",
            category: "time_tracking",
          },
        },
        {
          id: "team-timesheets",
          title: "Team Timesheets",
          i18nKey: "menu.time_tracking.team",
          url: "/dashboard/time-tracking/team",
          permissions: ["view team timesheets"],
          icon: UsersRound,
          breadcrumb: {
            label: "Team Timesheets",
            parent: "Time Tracking",
            path: ["Dashboard", "Time Tracking", "Team"],
          },
          searchKeywords: ["team hours", "team time"],
          analytics: {
            event: "view_team_timesheets",
            category: "time_tracking",
          },
        },
        {
          id: "projects",
          title: "Projects",
          i18nKey: "menu.time_tracking.projects",
          url: "/dashboard/time-tracking/projects",
          permissions: ["manage projects"],
          icon: Briefcase,
          breadcrumb: {
            label: "Projects",
            parent: "Time Tracking",
            path: ["Dashboard", "Time Tracking", "Projects"],
          },
          searchKeywords: ["projects", "tasks", "work items"],
          analytics: {
            event: "manage_projects",
            category: "time_tracking",
          },
        },
      ],
    },

    // ================= LEAVE MANAGEMENT =================
    {
      id: "leaves",
      title: "Leaves",
      i18nKey: "menu.leaves",
      url: "#",
      icon: Plane,
      permissions: ["view leave"],
      searchKeywords: ["leaves", "time off", "vacation", "pto", "absence", "holiday"],
      analytics: {
        event: "menu_leaves",
        category: "navigation",
      },
      mobileVisible: true,
      mobileOrder: 4,
      items: [
        {
          id: "my-leaves",
          title: "My Leaves",
          i18nKey: "menu.leaves.my_leaves",
          url: "/dashboard/leaves",
          permissions: ["view leave"],
          icon: Calendar,
          description: "Apply and manage your leaves",
          breadcrumb: {
            label: "My Leaves",
            parent: "Leaves",
            path: ["Dashboard", "Leaves", "My Leaves"],
          },
          searchKeywords: ["my leave", "apply leave", "leave balance", "request time off"],
          quickAccess: true,
          shortcut: {
            key: "l",
            modifier: "ctrl+shift",
          },
          analytics: {
            event: "view_my_leaves",
            category: "leaves",
          },
        },
        {
          id: "team-calendar",
          title: "Team Calendar",
          i18nKey: "menu.leaves.team_calendar",
          url: "/dashboard/leaves/team",
          permissions: ["view team leaves"],
          icon: CalendarDays,
          description: "View team availability",
          breadcrumb: {
            label: "Team Calendar",
            parent: "Leaves",
            path: ["Dashboard", "Leaves", "Team Calendar"],
          },
          searchKeywords: ["team calendar", "who's out", "availability", "team leaves"],
          analytics: {
            event: "view_team_calendar",
            category: "leaves",
          },
        },
        {
          id: "leave-balance",
          title: "Leave Balance",
          i18nKey: "menu.leaves.balance",
          url: "/dashboard/leaves/balance",
          permissions: [],
          icon: BarChart3,
          breadcrumb: {
            label: "Balance",
            parent: "Leaves",
            path: ["Dashboard", "Leaves", "Balance"],
          },
          searchKeywords: ["leave balance", "accrual", "remaining days"],
          analytics: {
            event: "view_leave_balance",
            category: "leaves",
          },
        },
      ],
    },

    // ================= RECRUITMENT =================
    {
      id: "recruitment",
      title: "Recruitment",
      i18nKey: "menu.recruitment",
      url: "#",
      icon: UserPlus,
      permissions: ["view jobs", "manage recruitment"],
      searchKeywords: ["recruitment", "hiring", "jobs", "candidates", "interviews", "talent"],
      featureFlag: "enable_recruitment",
      analytics: {
        event: "menu_recruitment",
        category: "navigation",
      },
      items: [
        {
          id: "job-openings",
          title: "Job Openings",
          i18nKey: "menu.recruitment.jobs",
          url: "/dashboard/recruitment/jobs",
          permissions: ["manage jobs"],
          icon: Briefcase,
          breadcrumb: {
            label: "Jobs",
            parent: "Recruitment",
            path: ["Dashboard", "Recruitment", "Jobs"],
          },
          searchKeywords: ["jobs", "positions", "openings", "vacancies"],
          analytics: {
            event: "manage_jobs",
            category: "recruitment",
          },
        },
        {
          id: "candidates",
          title: "Candidates",
          i18nKey: "menu.recruitment.candidates",
          url: "/dashboard/recruitment/candidates",
          permissions: ["view candidates"],
          icon: Users,
          breadcrumb: {
            label: "Candidates",
            parent: "Recruitment",
            path: ["Dashboard", "Recruitment", "Candidates"],
          },
          searchKeywords: ["candidates", "applicants", "prospects", "talent pool"],
          notifications: {
            type: "count",
            source: "new_applications",
            color: "blue",
          },
          analytics: {
            event: "view_candidates",
            category: "recruitment",
          },
        },
        {
          id: "interviews",
          title: "Interviews",
          i18nKey: "menu.recruitment.interviews",
          url: "/dashboard/recruitment/interviews",
          permissions: ["schedule interviews"],
          icon: Calendar,
          breadcrumb: {
            label: "Interviews",
            parent: "Recruitment",
            path: ["Dashboard", "Recruitment", "Interviews"],
          },
          searchKeywords: ["interviews", "schedule", "calendar"],
          analytics: {
            event: "manage_interviews",
            category: "recruitment",
          },
        },
        {
          id: "offer-letters",
          title: "Offer Letters",
          i18nKey: "menu.recruitment.offers",
          url: "/dashboard/recruitment/offers",
          permissions: ["manage offers"],
          icon: FileText,
          breadcrumb: {
            label: "Offers",
            parent: "Recruitment",
            path: ["Dashboard", "Recruitment", "Offers"],
          },
          searchKeywords: ["offer letters", "job offers", "contracts"],
          analytics: {
            event: "manage_offers",
            category: "recruitment",
          },
        },
      ],
    },

    // ================= ONBOARDING =================
    {
      id: "onboarding",
      title: "Onboarding",
      i18nKey: "menu.onboarding",
      url: "#",
      icon: UserCheck,
      permissions: ["manage onboarding", "view onboarding"],
      searchKeywords: ["onboarding", "new hire", "welcome", "orientation"],
      analytics: {
        event: "menu_onboarding",
        category: "navigation",
      },
      items: [
        {
          id: "new-hires",
          title: "New Hires",
          i18nKey: "menu.onboarding.new_hires",
          url: "/dashboard/onboarding/new-hires",
          permissions: ["view onboarding"],
          icon: UserPlus,
          breadcrumb: {
            label: "New Hires",
            parent: "Onboarding",
            path: ["Dashboard", "Onboarding", "New Hires"],
          },
          searchKeywords: ["new hires", "joiners", "new employees"],
          notifications: {
            type: "count",
            source: "pending_onboarding",
            color: "green",
          },
          analytics: {
            event: "view_new_hires",
            category: "onboarding",
          },
        },
        {
          id: "onboarding-checklists",
          title: "Checklists",
          i18nKey: "menu.onboarding.checklists",
          url: "/dashboard/onboarding/checklists",
          permissions: ["manage onboarding"],
          icon: ClipboardList,
          breadcrumb: {
            label: "Checklists",
            parent: "Onboarding",
            path: ["Dashboard", "Onboarding", "Checklists"],
          },
          searchKeywords: ["checklists", "tasks", "onboarding process"],
          analytics: {
            event: "manage_checklists",
            category: "onboarding",
          },
        },
        {
          id: "offboarding",
          title: "Offboarding",
          i18nKey: "menu.onboarding.offboarding",
          url: "/dashboard/onboarding/offboarding",
          permissions: ["manage offboarding"],
          icon: UserCheck,
          breadcrumb: {
            label: "Offboarding",
            parent: "Onboarding",
            path: ["Dashboard", "Onboarding", "Offboarding"],
          },
          searchKeywords: ["offboarding", "exit", "separation", "resignation"],
          analytics: {
            event: "manage_offboarding",
            category: "onboarding",
          },
        },
      ],
    },

    // ================= TRAINING & DEVELOPMENT =================
    {
      id: "training",
      title: "Learning & Development",
      i18nKey: "menu.training",
      url: "#",
      icon: GraduationCap,
      permissions: ["view training", "manage training"],
      searchKeywords: ["training", "learning", "courses", "development", "skills", "education"],
      status: "new",
      analytics: {
        event: "menu_training",
        category: "navigation",
      },
      items: [
        {
          id: "my-training",
          title: "My Training",
          i18nKey: "menu.training.my_training",
          url: "/dashboard/training",
          permissions: ["view training"],
          icon: Award,
          breadcrumb: {
            label: "My Training",
            parent: "Learning & Development",
            path: ["Dashboard", "Learning & Development", "My Training"],
          },
          searchKeywords: ["my training", "my courses", "my learning"],
          quickAccess: true,
          analytics: {
            event: "view_my_training",
            category: "training",
          },
        },
        {
          id: "team-training",
          title: "Team Training",
          i18nKey: "menu.training.team",
          url: "/dashboard/training/team",
          permissions: ["view team training"],
          icon: Users,
          breadcrumb: {
            label: "Team Training",
            parent: "Learning & Development",
            path: ["Dashboard", "Learning & Development", "Team"],
          },
          searchKeywords: ["team training", "team development"],
          analytics: {
            event: "view_team_training",
            category: "training",
          },
        },
        {
          id: "training-catalog",
          title: "Training Catalog",
          i18nKey: "menu.training.catalog",
          url: "/dashboard/training/catalog",
          permissions: ["manage training"],
          icon: BookOpen,
          breadcrumb: {
            label: "Catalog",
            parent: "Learning & Development",
            path: ["Dashboard", "Learning & Development", "Catalog"],
          },
          searchKeywords: ["catalog", "courses", "programs", "training library"],
          analytics: {
            event: "view_catalog",
            category: "training",
          },
        },
        {
          id: "certifications",
          title: "Certifications",
          i18nKey: "menu.training.certifications",
          url: "/dashboard/training/certifications",
          permissions: ["view certifications"],
          icon: Award,
          breadcrumb: {
            label: "Certifications",
            parent: "Learning & Development",
            path: ["Dashboard", "Learning & Development", "Certifications"],
          },
          searchKeywords: ["certifications", "certificates", "credentials"],
          analytics: {
            event: "view_certifications",
            category: "training",
          },
        },
      ],
    },

    // ================= PERFORMANCE MANAGEMENT =================
    {
      id: "performance",
      title: "Performance",
      i18nKey: "menu.performance",
      url: "#",
      icon: Target,
      permissions: ["view performance", "manage performance"],
      searchKeywords: ["performance", "goals", "reviews", "appraisals", "kpi", "okr"],
      analytics: {
        event: "menu_performance",
        category: "navigation",
      },
      items: [
        {
          id: "my-goals",
          title: "My Goals",
          i18nKey: "menu.performance.my_goals",
          url: "/dashboard/performance/goals",
          permissions: [],
          icon: Target,
          breadcrumb: {
            label: "My Goals",
            parent: "Performance",
            path: ["Dashboard", "Performance", "My Goals"],
          },
          searchKeywords: ["my goals", "objectives", "okr", "kpi"],
          quickAccess: true,
          analytics: {
            event: "view_my_goals",
            category: "performance",
          },
        },
        {
          id: "performance-reviews",
          title: "Reviews",
          i18nKey: "menu.performance.reviews",
          url: "/dashboard/performance/reviews",
          permissions: ["view reviews"],
          icon: ClipboardList,
          breadcrumb: {
            label: "Reviews",
            parent: "Performance",
            path: ["Dashboard", "Performance", "Reviews"],
          },
          searchKeywords: ["reviews", "appraisals", "evaluations", "assessments"],
          notifications: {
            type: "count",
            source: "pending_reviews",
            color: "purple",
          },
          analytics: {
            event: "view_reviews",
            category: "performance",
          },
        },
        {
          id: "team-performance",
          title: "Team Performance",
          i18nKey: "menu.performance.team",
          url: "/dashboard/performance/team",
          permissions: ["view team performance"],
          icon: TrendingUp,
          breadcrumb: {
            label: "Team Performance",
            parent: "Performance",
            path: ["Dashboard", "Performance", "Team"],
          },
          searchKeywords: ["team performance", "team metrics"],
          analytics: {
            event: "view_team_performance",
            category: "performance",
          },
        },
        {
          id: "feedback",
          title: "360° Feedback",
          i18nKey: "menu.performance.feedback",
          url: "/dashboard/performance/feedback",
          permissions: ["view feedback"],
          icon: MessageSquare,
          breadcrumb: {
            label: "Feedback",
            parent: "Performance",
            path: ["Dashboard", "Performance", "Feedback"],
          },
          searchKeywords: ["feedback", "360", "peer review"],
          analytics: {
            event: "view_feedback",
            category: "performance",
          },
        },
      ],
    },

    // ================= EMPLOYEE SELF-SERVICE =================
    {
      id: "my-hr",
      title: "My HR",
      i18nKey: "menu.my_hr",
      url: "#",
      icon: UserCheck,
      permissions: [],
      searchKeywords: ["my hr", "self service", "employee portal", "my documents"],
      analytics: {
        event: "menu_my_hr",
        category: "navigation",
      },
      items: [
        {
          id: "my-documents",
          title: "My Documents",
          i18nKey: "menu.my_hr.documents",
          url: "/dashboard/my-hr/documents",
          permissions: [],
          icon: FileText,
          breadcrumb: {
            label: "Documents",
            parent: "My HR",
            path: ["Dashboard", "My HR", "Documents"],
          },
          searchKeywords: ["documents", "files", "contracts", "letters"],
          analytics: {
            event: "view_documents",
            category: "my_hr",
          },
        },
        {
          id: "my-benefits",
          title: "My Benefits",
          i18nKey: "menu.my_hr.benefits",
          url: "/dashboard/my-hr/benefits",
          permissions: [],
          icon: Heart,
          breadcrumb: {
            label: "Benefits",
            parent: "My HR",
            path: ["Dashboard", "My HR", "Benefits"],
          },
          searchKeywords: ["benefits", "perks", "insurance", "health"],
          analytics: {
            event: "view_benefits",
            category: "my_hr",
          },
        },
        {
          id: "my-assets",
          title: "My Assets",
          i18nKey: "menu.my_hr.assets",
          url: "/dashboard/my-hr/assets",
          permissions: [],
          icon: Laptop,
          breadcrumb: {
            label: "Assets",
            parent: "My HR",
            path: ["Dashboard", "My HR", "Assets"],
          },
          searchKeywords: ["assets", "equipment", "laptop", "devices"],
          analytics: {
            event: "view_my_assets",
            category: "my_hr",
          },
        },
        {
          id: "my-expenses",
          title: "My Expenses",
          i18nKey: "menu.my_hr.expenses",
          url: "/dashboard/my-hr/expenses",
          permissions: [],
          icon: Receipt,
          breadcrumb: {
            label: "Expenses",
            parent: "My HR",
            path: ["Dashboard", "My HR", "Expenses"],
          },
          searchKeywords: ["expenses", "reimbursement", "claims"],
          analytics: {
            event: "view_my_expenses",
            category: "my_hr",
          },
        },
      ],
    },

    // ================= EXPENSES =================
    {
      id: "expenses",
      title: "Expense Management",
      i18nKey: "menu.expenses",
      url: "#",
      icon: Receipt,
      permissions: ["submit expenses", "approve expenses"],
      searchKeywords: ["expenses", "reimbursement", "claims", "receipts", "travel"],
      analytics: {
        event: "menu_expenses",
        category: "navigation",
      },
      items: [
        {
          id: "submit-expense",
          title: "Submit Expense",
          i18nKey: "menu.expenses.submit",
          url: "/dashboard/expenses/submit",
          permissions: ["submit expenses"],
          icon: Receipt,
          breadcrumb: {
            label: "Submit",
            parent: "Expenses",
            path: ["Dashboard", "Expenses", "Submit"],
          },
          searchKeywords: ["submit expense", "new claim"],
          quickAccess: true,
          analytics: {
            event: "submit_expense",
            category: "expenses",
          },
        },
        {
          id: "my-expenses-list",
          title: "My Expenses",
          i18nKey: "menu.expenses.my_expenses",
          url: "/dashboard/expenses/my-expenses",
          permissions: ["submit expenses"],
          icon: FileText,
          breadcrumb: {
            label: "My Expenses",
            parent: "Expenses",
            path: ["Dashboard", "Expenses", "My Expenses"],
          },
          searchKeywords: ["my expenses", "my claims"],
          analytics: {
            event: "view_my_expenses_list",
            category: "expenses",
          },
        },
        {
          id: "team-expenses",
          title: "Team Expenses",
          i18nKey: "menu.expenses.team",
          url: "/dashboard/expenses/team",
          permissions: ["approve expenses"],
          icon: UsersRound,
          breadcrumb: {
            label: "Team Expenses",
            parent: "Expenses",
            path: ["Dashboard", "Expenses", "Team"],
          },
          searchKeywords: ["team expenses", "approve expenses"],
          notifications: {
            type: "count",
            source: "pending_expenses",
            color: "orange",
          },
          analytics: {
            event: "view_team_expenses",
            category: "expenses",
          },
        },
      ],
    },

    // ================= ASSETS =================
    {
      id: "assets",
      title: "Asset Management",
      i18nKey: "menu.assets",
      url: "#",
      icon: Laptop,
      permissions: ["manage assets", "view assets"],
      searchKeywords: ["assets", "equipment", "inventory", "devices", "laptops"],
      analytics: {
        event: "menu_assets",
        category: "navigation",
      },
      items: [
        {
          id: "all-assets",
          title: "All Assets",
          i18nKey: "menu.assets.all",
          url: "/dashboard/assets",
          permissions: ["view assets"],
          icon: Boxes,
          breadcrumb: {
            label: "All Assets",
            parent: "Assets",
            path: ["Dashboard", "Assets", "All"],
          },
          searchKeywords: ["asset inventory", "equipment list"],
          analytics: {
            event: "view_all_assets",
            category: "assets",
          },
        },
        {
          id: "asset-assignments",
          title: "Assignments",
          i18nKey: "menu.assets.assignments",
          url: "/dashboard/assets/assignments",
          permissions: ["manage assets"],
          icon: UserCheck,
          breadcrumb: {
            label: "Assignments",
            parent: "Assets",
            path: ["Dashboard", "Assets", "Assignments"],
          },
          searchKeywords: ["asset assignment", "allocation"],
          analytics: {
            event: "view_assignments",
            category: "assets",
          },
        },
        {
          id: "asset-requests",
          title: "Requests",
          i18nKey: "menu.assets.requests",
          url: "/dashboard/assets/requests",
          permissions: ["view assets"],
          icon: ClipboardList,
          breadcrumb: {
            label: "Requests",
            parent: "Assets",
            path: ["Dashboard", "Assets", "Requests"],
          },
          searchKeywords: ["asset request", "equipment request"],
          notifications: {
            type: "count",
            source: "pending_asset_requests",
            color: "blue",
          },
          analytics: {
            event: "view_asset_requests",
            category: "assets",
          },
        },
      ],
    },

    // ================= APPROVALS =================
    {
      id: "approvals",
      title: "Approvals",
      i18nKey: "menu.approvals",
      url: "/dashboard/approvals",
      icon: ClipboardList,
      permissions: [
        "approve leave",
        "approve attendance correction",
        "approve unlock attendance",
        "approve expenses",
        "approve timesheets",
      ],
      breadcrumb: {
        label: "Approvals",
        path: ["Dashboard", "Approvals"],
      },
      searchKeywords: ["approvals", "pending", "requests", "workflow", "approvals queue"],
      notifications: {
        type: "count",
        source: "pending_approvals",
        color: "red",
        refreshInterval: 30000,
        showZero: false,
      },
      quickAccess: true,
      shortcut: {
        key: "a",
        modifier: "ctrl+shift",
      },
      analytics: {
        event: "view_approvals",
        category: "approvals",
      },
      meta: {
        pageTitle: "Pending Approvals | HRMS",
        description: "Manage pending approval requests",
      },
      mobileVisible: true,
      mobileOrder: 5,
    },

    // ================= PAYROLL =================
    {
      id: "payroll",
      title: "Payroll",
      i18nKey: "menu.payroll",
      url: "#",
      icon: Wallet,
      permissions: ["view payroll", "view payslips"],
      searchKeywords: ["payroll", "salary", "compensation", "pay", "wages"],
      visibility: {
        plans: ["business", "enterprise"],
        featureFlag: "enable_payroll",
      },
      analytics: {
        event: "menu_payroll",
        category: "navigation",
      },
      items: [
        {
          id: "payroll-runs",
          title: "Payroll Runs",
          i18nKey: "menu.payroll.runs",
          url: "/dashboard/payroll/runs",
          permissions: ["view payroll"],
          icon: Wallet,
          breadcrumb: {
            label: "Payroll Runs",
            parent: "Payroll",
            path: ["Dashboard", "Payroll", "Runs"],
          },
          searchKeywords: ["payroll processing", "salary run", "pay period"],
          audit: {
            trackAccess: true,
            sensitivityLevel: "high",
          },
          analytics: {
            event: "view_payroll_runs",
            category: "payroll",
          },
        },
        {
          id: "my-payslips",
          title: "My Payslips",
          i18nKey: "menu.payroll.payslips",
          url: "/dashboard/payroll/payslips",
          permissions: ["view payslips"],
          icon: FileSpreadsheet,
          breadcrumb: {
            label: "Payslips",
            parent: "Payroll",
            path: ["Dashboard", "Payroll", "Payslips"],
          },
          searchKeywords: ["payslips", "pay stubs", "salary slips", "pay statement"],
          quickAccess: true,
          analytics: {
            event: "view_payslips",
            category: "payroll",
          },
        },
        {
          id: "salary-structures",
          title: "Salary Structures",
          i18nKey: "menu.payroll.structures",
          url: "/dashboard/payroll/salary-structures",
          permissions: ["manage salary structures"],
          icon: TrendingUp,
          breadcrumb: {
            label: "Structures",
            parent: "Payroll",
            path: ["Dashboard", "Payroll", "Structures"],
          },
          searchKeywords: ["salary structure", "pay components", "compensation structure"],
          analytics: {
            event: "manage_salary_structures",
            category: "payroll",
          },
        },
        {
          id: "tax-declarations",
          title: "Tax Declarations",
          i18nKey: "menu.payroll.tax",
          url: "/dashboard/payroll/tax",
          permissions: ["view tax"],
          icon: FileText,
          breadcrumb: {
            label: "Tax",
            parent: "Payroll",
            path: ["Dashboard", "Payroll", "Tax"],
          },
          searchKeywords: ["tax", "declarations", "exemptions", "tax forms"],
          analytics: {
            event: "view_tax",
            category: "payroll",
          },
        },
      ],
    },

    // ================= ANNOUNCEMENTS =================
    {
      id: "announcements",
      title: "Announcements",
      i18nKey: "menu.announcements",
      url: "/dashboard/announcements",
      icon: Megaphone,
      permissions: [],
      breadcrumb: {
        label: "Announcements",
        path: ["Dashboard", "Announcements"],
      },
      searchKeywords: ["announcements", "news", "updates", "communications"],
      notifications: {
        type: "dot",
        source: "unread_announcements",
        color: "blue",
      },
      analytics: {
        event: "view_announcements",
        category: "communication",
      },
      mobileVisible: true,
    },

    // ================= REPORTS & ANALYTICS =================
    {
      id: "reports",
      title: "Reports",
      i18nKey: "menu.reports",
      url: "#",
      icon: FileBarChart2,
      permissions: [
        "view attendance reports",
        "view leave reports",
        "view payroll reports",
        "view audit logs",
      ],
      searchKeywords: ["reports", "analytics", "insights", "data", "dashboards"],
      analytics: {
        event: "menu_reports",
        category: "navigation",
      },
      items: [
        {
          id: "attendance-reports",
          title: "Attendance Reports",
          i18nKey: "menu.reports.attendance",
          url: "/dashboard/reports/attendance",
          permissions: ["view attendance reports"],
          icon: CalendarCheck,
          breadcrumb: {
            label: "Attendance Reports",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Attendance"],
          },
          searchKeywords: ["attendance analytics", "attendance data"],
          analytics: {
            event: "view_attendance_reports",
            category: "reports",
          },
        },
        {
          id: "attendance-integrity",
          title: "Attendance Integrity",
          i18nKey: "menu.reports.integrity",
          url: "/dashboard/reports/attendance-integrity",
          permissions: ["view attendance reports"],
          icon: ShieldCheck,
          status: "beta",
          breadcrumb: {
            label: "Integrity",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Integrity"],
          },
          searchKeywords: ["integrity", "anomalies", "fraud detection", "compliance"],
          featureFlag: "enable_integrity_reports",
          analytics: {
            event: "view_integrity_reports",
            category: "reports",
          },
        },
        {
          id: "leave-reports",
          title: "Leave Reports",
          i18nKey: "menu.reports.leaves",
          url: "/dashboard/reports/leaves",
          permissions: ["view leave reports"],
          icon: Plane,
          breadcrumb: {
            label: "Leave Reports",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Leaves"],
          },
          searchKeywords: ["leave analytics", "absence data"],
          analytics: {
            event: "view_leave_reports",
            category: "reports",
          },
        },
        {
          id: "payroll-reports",
          title: "Payroll Reports",
          i18nKey: "menu.reports.payroll",
          url: "/dashboard/reports/payroll",
          permissions: ["view payroll reports"],
          icon: Wallet,
          breadcrumb: {
            label: "Payroll Reports",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Payroll"],
          },
          searchKeywords: ["payroll analytics", "salary data"],
          audit: {
            trackAccess: true,
            sensitivityLevel: "high",
          },
          analytics: {
            event: "view_payroll_reports",
            category: "reports",
          },
        },
        {
          id: "headcount-analytics",
          title: "Headcount Analytics",
          i18nKey: "menu.reports.headcount",
          url: "/dashboard/reports/headcount",
          permissions: ["view hr analytics"],
          icon: Users,
          breadcrumb: {
            label: "Headcount",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Headcount"],
          },
          searchKeywords: ["headcount", "workforce analytics", "demographics"],
          analytics: {
            event: "view_headcount",
            category: "reports",
          },
        },
        {
          id: "audit-logs",
          title: "Audit Logs",
          i18nKey: "menu.reports.audit",
          url: "/dashboard/reports/audit-logs",
          permissions: ["view audit logs"],
          icon: History,
          breadcrumb: {
            label: "Audit Logs",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Audit"],
          },
          searchKeywords: ["audit trail", "activity log", "security logs"],
          audit: {
            trackAccess: true,
            sensitivityLevel: "critical",
          },
          analytics: {
            event: "view_audit_logs",
            category: "reports",
          },
        },
        {
          id: "export-history",
          title: "Export History",
          i18nKey: "menu.reports.exports",
          url: "/dashboard/reports/exports",
          permissions: ["view exports"],
          icon: CloudDownload,
          breadcrumb: {
            label: "Exports",
            parent: "Reports",
            path: ["Dashboard", "Reports", "Exports"],
          },
          searchKeywords: ["exports", "downloads", "data export"],
          analytics: {
            event: "view_exports",
            category: "reports",
          },
        },
      ],
    },
  ],

  // ================= SETTINGS & CONFIGURATION =================
  settings: [
    {
      id: "organization",
      title: "Organization",
      i18nKey: "menu.settings.organization",
      url: "#",
      icon: Building2,
      permissions: [
        "manage companies",
        "manage locations",
        "manage departments",
        "manage designations",
      ],
      searchKeywords: ["organization", "structure", "hierarchy", "setup"],
      analytics: {
        event: "menu_organization",
        category: "settings",
      },
      items: [
        {
          id: "companies",
          title: "Companies",
          i18nKey: "menu.settings.companies",
          url: "/dashboard/settings/companies",
          permissions: ["manage companies"],
          icon: Building2,
          breadcrumb: {
            label: "Companies",
            parent: "Organization",
            path: ["Dashboard", "Settings", "Organization", "Companies"],
          },
          searchKeywords: ["company settings", "business units"],
          visibility: {
            tenantTypes: ["multi-tenant"],
          },
          analytics: {
            event: "manage_companies",
            category: "settings",
          },
        },
        {
          id: "locations",
          title: "Locations",
          i18nKey: "menu.settings.locations",
          url: "/dashboard/settings/locations",
          permissions: ["manage locations"],
          icon: MapPin,
          breadcrumb: {
            label: "Locations",
            parent: "Organization",
            path: ["Dashboard", "Settings", "Organization", "Locations"],
          },
          searchKeywords: ["offices", "branches", "sites", "locations"],
          analytics: {
            event: "manage_locations",
            category: "settings",
          },
        },
        {
          id: "departments",
          title: "Departments",
          i18nKey: "menu.settings.departments",
          url: "/dashboard/settings/departments",
          permissions: ["manage departments"],
          icon: Layers,
          breadcrumb: {
            label: "Departments",
            parent: "Organization",
            path: ["Dashboard", "Settings", "Organization", "Departments"],
          },
          searchKeywords: ["departments", "teams", "divisions", "units"],
          analytics: {
            event: "manage_departments",
            category: "settings",
          },
        },
        {
          id: "designations",
          title: "Designations",
          i18nKey: "menu.settings.designations",
          url: "/dashboard/settings/designations",
          permissions: ["manage designations"],
          icon: Briefcase,
          breadcrumb: {
            label: "Designations",
            parent: "Organization",
            path: ["Dashboard", "Settings", "Organization", "Designations"],
          },
          searchKeywords: ["positions", "titles", "roles", "job titles"],
          analytics: {
            event: "manage_designations",
            category: "settings",
          },
        },
      ],
    },
    {
      id: "system-settings",
      title: "System Settings",
      i18nKey: "menu.settings.system",
      url: "#",
      icon: Settings2,
      permissions: [
        "manage leave types",
        "manage approval templates",
        "manage roles",
        "manage permissions",
      ],
      searchKeywords: ["system", "configuration", "settings", "admin"],
      analytics: {
        event: "menu_system_settings",
        category: "settings",
      },
      items: [
        {
          id: "leave-types",
          title: "Leave Types",
          i18nKey: "menu.settings.leave_types",
          url: "/dashboard/settings/leave-types",
          permissions: ["manage leave types"],
          icon: Plane,
          breadcrumb: {
            label: "Leave Types",
            parent: "System Settings",
            path: ["Dashboard", "Settings", "System", "Leave Types"],
          },
          searchKeywords: ["leave policies", "leave configuration"],
          analytics: {
            event: "manage_leave_types",
            category: "settings",
          },
        },
        {
          id: "approval-workflows",
          title: "Approval Workflows",
          i18nKey: "menu.settings.workflows",
          url: "/dashboard/settings/approvals/templates",
          permissions: ["manage approval templates"],
          icon: ClipboardList,
          breadcrumb: {
            label: "Workflows",
            parent: "System Settings",
            path: ["Dashboard", "Settings", "System", "Workflows"],
          },
          searchKeywords: ["workflows", "approval chains", "approval templates"],
          analytics: {
            event: "manage_workflows",
            category: "settings",
          },
        },
        {
          id: "roles-permissions",
          title: "Roles & Permissions",
          i18nKey: "menu.settings.roles",
          url: "/dashboard/settings/permissions",
          permissions: ["manage roles", "manage permissions"],
          icon: ShieldCheck,
          breadcrumb: {
            label: "Roles",
            parent: "System Settings",
            path: ["Dashboard", "Settings", "System", "Roles"],
          },
          searchKeywords: ["access control", "rbac", "security", "permissions"],
          audit: {
            trackAccess: true,
            sensitivityLevel: "critical",
          },
          analytics: {
            event: "manage_roles",
            category: "settings",
          },
        },
        {
          id: "general-settings",
          title: "General Settings",
          i18nKey: "menu.settings.general",
          url: "/dashboard/settings/general",
          permissions: ["manage settings"],
          icon: Settings,
          breadcrumb: {
            label: "General",
            parent: "System Settings",
            path: ["Dashboard", "Settings", "System", "General"],
          },
          searchKeywords: ["general settings", "preferences", "configuration"],
          analytics: {
            event: "manage_general_settings",
            category: "settings",
          },
        },
        {
          id: "integrations",
          title: "Integrations",
          i18nKey: "menu.settings.integrations",
          url: "/dashboard/settings/integrations",
          permissions: ["manage integrations"],
          icon: Zap,
          breadcrumb: {
            label: "Integrations",
            parent: "System Settings",
            path: ["Dashboard", "Settings", "System", "Integrations"],
          },
          searchKeywords: ["integrations", "api", "third party", "connectors"],
          analytics: {
            event: "manage_integrations",
            category: "settings",
          },
        },
      ],
    },
  ],

  // ================= HELP & SUPPORT =================
  help: [
    {
      id: "help-center",
      title: "Help Center",
      i18nKey: "menu.help.center",
      url: "https://help.example.com",
      icon: HelpCircle,
      permissions: [],
      external: true,
      target: "_blank",
      searchKeywords: ["help", "support", "documentation", "guide"],
      analytics: {
        event: "open_help_center",
        category: "help",
      },
    },
    {
      id: "whats-new",
      title: "What's New",
      i18nKey: "menu.help.whats_new",
      url: "/dashboard/whats-new",
      icon: Star,
      permissions: [],
      searchKeywords: ["what's new", "updates", "releases", "changelog"],
      analytics: {
        event: "view_whats_new",
        category: "help",
      },
    },
    {
      id: "contact-support",
      title: "Contact Support",
      i18nKey: "menu.help.contact",
      url: "/dashboard/support",
      icon: Mail,
      permissions: [],
      searchKeywords: ["contact", "support", "help desk", "ticket"],
      analytics: {
        event: "contact_support",
        category: "help",
      },
    },
  ],
};

// ============================================================================
// ENHANCED HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user has required permissions with complex logic support
 */
export function hasPermission(item, userPermissions = [], user = null) {
  if (!item.permissions || item.permissions.length === 0) return true;
  if (!userPermissions || userPermissions.length === 0) return false;

  if (item.permissionLogic) {
    return evaluatePermissionLogic(item.permissionLogic, userPermissions, user);
  }

  return item.permissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Evaluate complex permission logic
 */
function evaluatePermissionLogic(logic, userPermissions, user) {
  const { operator, conditions } = logic;

  const results = conditions.map((condition) => {
    if (condition.permissions) {
      return condition.permissions.some((perm) => userPermissions.includes(perm));
    }
    if (condition.roles && user?.roles) {
      return condition.roles.some((role) => user.roles.includes(role));
    }
    if (condition.customCheck && user) {
      return evaluateCustomCheck(condition.customCheck, user);
    }
    return false;
  });

  return operator === "AND" ? results.every(Boolean) : results.some(Boolean);
}

/**
 * Evaluate custom permission checks
 */
function evaluateCustomCheck(check, user) {
  switch (check) {
    case "isCompanyOwner":
      return user.isOwner === true;
    case "isAdmin":
      return user.isAdmin === true;
    default:
      return false;
  }
}

/**
 * Check visibility based on feature flags, plans, etc.
 */
export function isVisible(item, context = {}) {
  const { featureFlags = {}, userPlan = "", tenantType = "", user = null } = context;

  if (item.featureFlag && !featureFlags[item.featureFlag]) {
    return false;
  }

  if (item.visibility) {
    const { plans, tenantTypes, featureFlag } = item.visibility;

    if (plans && !plans.includes(userPlan)) {
      return false;
    }

    if (tenantTypes && !tenantTypes.includes(tenantType)) {
      return false;
    }

    if (featureFlag && !featureFlags[featureFlag]) {
      return false;
    }
  }

  if (item.showIf) {
    if (item.showIf.userProperty && user && !user[item.showIf.userProperty]) {
      return false;
    }
  }

  return true;
}

/**
 * Filter menu items based on permissions and visibility
 */
export function filterMenuItems(items, userPermissions, context = {}) {
  if (!items || !Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!isVisible(item, context)) {
        return null;
      }

      const canSeeParent = hasPermission(item, userPermissions, context.user);

      const filteredSubItems = item.items
        ? filterMenuItems(item.items, userPermissions, context)
        : [];

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
 * Get filtered navigation for current user with context
 */
export function getFilteredNavigation(userPermissions = [], context = {}) {
  return {
    navMain: filterMenuItems(menuData.navMain, userPermissions, context),
    settings: filterMenuItems(menuData.settings, userPermissions, context),
    help: filterMenuItems(menuData.help, userPermissions, context),
  };
}

/**
 * Check if current path matches menu item (improved)
 */
export function isActiveRoute(itemUrl, currentPath) {
  if (!itemUrl || itemUrl === "#") return false;
  if (itemUrl === "/dashboard" && currentPath === "/dashboard") return true;
  if (itemUrl === "/dashboard") return false;
  return currentPath.startsWith(itemUrl);
}

/**
 * Get breadcrumb path for current route
 */
export function getBreadcrumb(currentPath, menuItems = [...menuData.navMain, ...menuData.settings]) {
  for (const item of menuItems) {
    if (item.url === currentPath && item.breadcrumb) {
      return item.breadcrumb.path;
    }
    if (item.items) {
      const found = getBreadcrumb(currentPath, item.items);
      if (found) return found;
    }
  }
  return ["Dashboard"];
}

/**
 * Get breadcrumb with URLs for current route (for clickable breadcrumbs)
 */
export function getBreadcrumbWithUrls(currentPath, menuItems = [...menuData.navMain, ...menuData.settings], parentItems = []) {
  for (const item of menuItems) {
    // Build breadcrumb trail with URLs
    const currentTrail = [
      ...parentItems,
      { label: item.title, url: item.url }
    ];

    // If this is the current page
    if (item.url === currentPath) {
      // Use the breadcrumb path if available, otherwise use the trail we built
      if (item.breadcrumb && item.breadcrumb.path) {
        // Map the breadcrumb path to include URLs
        return currentTrail.map((crumb, index) => ({
          label: item.breadcrumb.path[index] || crumb.label,
          url: crumb.url
        }));
      }
      return currentTrail;
    }

    // Search in sub-items
    if (item.items && item.items.length > 0) {
      const found = getBreadcrumbWithUrls(currentPath, item.items, currentTrail);
      if (found && found.length > 0) return found;
    }
  }

  // Default: just Dashboard
  if (parentItems.length === 0) {
    return [{ label: "Dashboard", url: "/dashboard" }];
  }

  return [];
}

/**
 * Search menu items by keywords
 */
export function searchMenu(query, menuItems = [...menuData.navMain, ...menuData.settings]) {
  const results = [];
  const searchQuery = query.toLowerCase();

  function search(items) {
    for (const item of items) {
      const titleMatch = item.title.toLowerCase().includes(searchQuery);
      const keywordMatch = item.searchKeywords?.some((kw) =>
        kw.toLowerCase().includes(searchQuery)
      );

      if (titleMatch || keywordMatch) {
        results.push({
          ...item,
          breadcrumb: item.breadcrumb?.path || [item.title],
        });
      }

      if (item.items) {
        search(item.items);
      }
    }
  }

  search(menuItems);
  return results;
}

/**
 * Get quick access menu items
 */
export function getQuickAccessItems(menuItems = [...menuData.navMain, ...menuData.settings]) {
  const items = [];

  function collect(menuItems) {
    for (const item of menuItems) {
      if (item.quickAccess) {
        items.push(item);
      }
      if (item.items) {
        collect(item.items);
      }
    }
  }

  collect(menuItems);
  return items;
}

/**
 * Get mobile navigation items
 */
export function getMobileNavigation(userPermissions = [], context = {}) {
  const allItems = filterMenuItems(menuData.navMain, userPermissions, context);
  
  return allItems
    .filter(item => item.mobileVisible)
    .sort((a, b) => (a.mobileOrder || 999) - (b.mobileOrder || 999));
}

/**
 * Track menu analytics
 */
export function trackMenuClick(item) {
  if (item.analytics && typeof window !== "undefined" && window.gtag) {
    window.gtag("event", item.analytics.event, {
      event_category: item.analytics.category,
      event_label: item.title,
    });
  }
}

/**
 * Get keyboard shortcuts map
 */
export function getKeyboardShortcuts(menuItems = [...menuData.navMain, ...menuData.settings]) {
  const shortcuts = new Map();

  function collect(items) {
    for (const item of items) {
      if (item.shortcut) {
        const key = `${item.shortcut.modifier}+${item.shortcut.key}`.toLowerCase();
        shortcuts.set(key, {
          url: item.url,
          title: item.title,
          description: item.shortcut.description || `Navigate to ${item.title}`,
        });
      }
      if (item.items) {
        collect(item.items);
      }
    }
  }

  collect(menuItems);
  return shortcuts;
}

/**
 * Get all menu items as flat array
 */
export function getFlatMenuItems(menuItems = [...menuData.navMain, ...menuData.settings]) {
  const items = [];

  function flatten(menuItems) {
    for (const item of menuItems) {
      items.push(item);
      if (item.items) {
        flatten(item.items);
      }
    }
  }

  flatten(menuItems);
  return items;
}