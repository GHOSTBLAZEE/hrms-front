"use client";

import PayslipViewerPage from "./PayslipViewerPage";

export default function Page({ params }) {
  return (
    <PayslipViewerPage payslipId={params.payslipId} />
  );
}
