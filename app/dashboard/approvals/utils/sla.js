export function getSlaMeta(step) {
  if (!step.sla_hours || step.status !== "pending") {
    return null;
  }

  const createdAt = new Date(step.created_at);
  const now = new Date();

  const totalMs = step.sla_hours * 60 * 60 * 1000;
  const elapsedMs = now - createdAt;

  const remainingMs = Math.max(
    -totalMs,
    totalMs - elapsedMs
    );


  const progress = Math.min(
    100,
    Math.max(0, (elapsedMs / totalMs) * 100)
  );

  let level = "ok";
  if (progress >= 80) level = "danger";
  else if (progress >= 60) level = "warning";

  return {
    progress,
    remainingMs,
    overdue: remainingMs < 0,
    level,
  };
}

export function formatRemaining(ms) {
  const abs = Math.abs(ms);

  const hours = Math.floor(abs / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);

  return `${hours}h ${minutes}m`;
}
export function formatDuration(ms) {
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}
