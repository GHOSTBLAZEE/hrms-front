import EmployeeStatutoryTab from "./EmployeeStatutoryTab";

export default function StatutoryPage({ params }) {
  const employeeId = Number(params.employeeId);

  return <EmployeeStatutoryTab employeeId={employeeId} />;
}
