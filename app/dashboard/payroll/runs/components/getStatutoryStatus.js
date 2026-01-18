export function getStatutoryStatus(statutory) {
  if (!statutory.pf_applicable) {
    return { type: "na", label: "PF N/A" };
  }

  if (!statutory.uan || statutory.uan.trim() === "") {
    return { type: "error", label: "Missing UAN" };
  }

  return { type: "ok", label: "PF Ready" };
}
