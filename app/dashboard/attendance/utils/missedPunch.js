export function isLikelyMissedPunch({ logs = [], status, shift }) {
  if (status === "missed_punch") return true;

  if (!logs.length) return false;
  if (logs.length === 1) return true;

  const last = logs.at(-1);
  if (!shift || last.type !== "IN") return false;

  const [eh, em] = shift.end.split(":").map(Number);
  const end = new Date();
  end.setHours(eh, em, 0, 0);

  const graceMs = (shift.grace_minutes ?? 0) * 60000;
  return Date.now() > end.getTime() + graceMs;
}
