// lib/handleApiError.js
import { toast } from "sonner";

export function handleApiError(error, options = {}) {
  const {
    silent422 = false,
    fallback = "Something went wrong",
  } = options;

  const status = error?.response?.status;
  const data = error?.response?.data;

  // 🔐 Not authenticated
  if (status === 401) {
    toast.error("Your session has expired. Please log in again.");
    return;
  }

  // 🚫 Permission denied
  if (status === 403) {
    toast.error("You do not have permission to perform this action.");
    return;
  }

  // 🔍 Not found (common in multi-tenant HRMS)
  if (status === 404) {
    toast.error("Requested resource was not found.");
    return;
  }

  // 🧾 Validation errors (let forms handle these)
  if (status === 422) {
    if (!silent422) {
      const firstKey = Object.keys(data?.errors ?? {})[0];
      const message =
        data?.errors?.[firstKey]?.[0] ??
        data?.message ??
        "Invalid input provided";

      toast.error(message);
    }
    return;
  }

  // 💥 Everything else
  toast.error(data?.message ?? fallback);
}
