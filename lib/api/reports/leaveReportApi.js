import apiClient from "@/lib/apiClient";

export async function exportLeaveReportApi() {
  const res = await apiClient.get(
    "/reports/leaves/export",
    { responseType: "blob" }
  );
  return res.data;
}
