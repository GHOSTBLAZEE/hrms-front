// lib/getApiErrorMessage.js
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.errors) {
    const firstKey = Object.keys(error.response.data.errors)[0];
    return error.response.data.errors[firstKey]?.[0];
  }

  return fallback;
}
