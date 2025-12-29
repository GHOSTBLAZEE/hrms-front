import React from "react";
import EmployeeProfilePage from "./EmployeeProfilePage";

export default function Page({ params }) {
  const { employeeId } = React.use(params);

  return (
    <EmployeeProfilePage employeeId={employeeId} />
  );
}
