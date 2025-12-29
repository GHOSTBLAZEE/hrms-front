import apiClient from "@/lib/apiClient";

export const exportAttendanceMonthlyReportApi = async ({ year, month }) => {
  const res = await apiClient.get(
    "/api/v1/reports/attendance/monthly/export",
    {
      params: { year, month },
      responseType: "blob", // IMPORTANT
    }
  );

  return res.data;
};

export const exportAttendanceMonthlyReportPdfApi = async ({ year, month }) => {
  const res = await apiClient.get(
    "/api/v1/reports/attendance/monthly/pdf",
    {
      params: { year, month },
      responseType: "blob",
    }
  );

  return res.data;
};
