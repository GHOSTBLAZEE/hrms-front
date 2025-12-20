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
} from "lucide-react"

export const menu = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      permissions: [],
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: Users,
      permissions: ["view employees"],
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: CalendarCheck,
      permissions: ["view attendance"],
    },
    {
      title: "Leaves",
      url: "/dashboard/leaves",
      icon: Plane,
      permissions: ["view leave"],
    },
  ],
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
  ],
}
