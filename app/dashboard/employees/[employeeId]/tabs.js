import AttendanceTab from "../sections/AttendanceTab";
import AuditTab from "../sections/AuditTab";
import DocumentsTab from "../sections/DocumentsTab";
import LeavesTab from "../sections/LeavesTab";
import OverviewTab from "../sections/OverviewTab";
import PayrollTab from "../sections/PayrollTab";
import EmployeeSalaryTab from "./salary/EmployeeSalaryTab";



export const tabs = [
  {
    key: "overview",
    title: "Overview",
    component: OverviewTab,
    permissions: ["view employees"],
  },
  {
    key: "attendance",
    title: "Attendance",
    component: AttendanceTab,
    permissions: ["view attendance"],
  },
  {
    key: "leaves",
    title: "Leaves",
    component: LeavesTab,
    permissions: ["view leave"],
  },
  {
    key: "salary",
    title: "Salary",
    component: EmployeeSalaryTab,
    permissions: ["manage salary structures"],
  },
  {
    key: "payroll",
    title: "Payroll",
    component: PayrollTab,
    permissions: ["view payslips"],
  },
  {
    key: "documents",
    title: "Documents",
    component: DocumentsTab,
    permissions: ["view employee documents"],
  },
  {
    key: "audit",
    title: "Audit",
    component: AuditTab,
    permissions: ["update employees"],
  },
];

