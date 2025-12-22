import apiClient from "@/lib/apiClient";

export async function logAuditEvent(event, payload) {
  await apiClient.post("/api/v1/audit-log", {
    event,
    ...payload,
  });
}
