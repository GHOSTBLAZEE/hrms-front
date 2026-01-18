import EmployeeStatutoryTab from "./EmployeeStatutoryTab";

export default function StatutoryPage({ params }) {
  const employeeId = Number(params.employeeId);
console.log(params);

  return <EmployeeStatutoryTab employeeId={employeeId} />;
}
