import EmployeeProfilePage from "./EmployeeProfilePage";

export default async function Page({ params }) {
  const { employeeId } = await params;

  return (
    <EmployeeProfilePage employeeId={Number(employeeId)} />
  );
}
