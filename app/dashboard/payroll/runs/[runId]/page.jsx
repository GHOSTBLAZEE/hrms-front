"use client";

import PayrollRunDetailPage from "./PayrollRunDetailPage";

export default function Page({ params }) {
  return <PayrollRunDetailPage runId={params.runId} />;
}
