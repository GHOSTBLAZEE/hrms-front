import EmployeeProfilePage from "./EmployeeProfilePage";

export default async function Page({ params }) {
  const resolvedParams = await params;
  console.log("Resolved params:", resolvedParams);
  
  const employeeId = resolvedParams.employeeId;
  console.log("Employee ID:", employeeId, "Type:", typeof employeeId);
  
  return (
    <EmployeeProfilePage employeeId={Number(employeeId)} />
  );
}