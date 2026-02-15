// lib/handleApiError.js
//
// Single source of truth for API error handling.
// getApiErrorMessage is the internal parser; handleApiError is the
// standard function to call in mutation onError callbacks.
//
import { toast } from "sonner";

/**
 * Parse an Axios error into a human-readable string.
 * Used internally by handleApiError and also exported for cases
 * where callers need the message string without toasting.
 */
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.errors) {
    const firstKey = Object.keys(error.response.data.errors)[0];
    return error.response.data.errors[firstKey]?.[0] ?? fallback;
  }

  return fallback;
}

/**
 * Standard error handler for mutation onError callbacks.
 *
 * @param {Error}  error
 * @param {object} options
 * @param {boolean} options.silent422 - If true, don't toast 422 errors
 *                                      (let RHF handle field-level display)
 * @param {string}  options.fallback  - Fallback message
 */
export function handleApiError(error, options = {}) {
  const { silent422 = false, fallback = "Something went wrong" } = options;

  const status = error?.response?.status;
  const data   = error?.response?.data;

  switch (status) {
    case 401:
      toast.error("Your session has expired. Please log in again.");
      return;

    case 403:
      toast.error("You do not have permission to perform this action.");
      return;

    case 404:
      toast.error("Requested resource was not found.");
      return;

    case 422:
      if (!silent422) {
        const firstKey = Object.keys(data?.errors ?? {})[0];
        const message =
          data?.errors?.[firstKey]?.[0] ??
          data?.message ??
          "Invalid input provided";
        toast.error(message);
      }
      return;

    case 429:
      toast.error("Too many requests. Please wait a moment and try again.");
      return;

    default:
      toast.error(getApiErrorMessage(error, fallback));
  }
}