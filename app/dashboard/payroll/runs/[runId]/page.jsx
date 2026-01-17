"use client";

import { use } from "react";
import PayrollRunDetailPage from "./PayrollRunDetailPage";

export default function Page({ params }) {
  const { runId } = use(params);

  return <PayrollRunDetailPage runId={runId} />;
}
