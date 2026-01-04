export function renderNotificationTitle(n) {
  return n.title;
}

export function renderNotificationDescription(n) {
  switch (n.type) {
    case "attendance_unlock_requested":
      return `Unlock requested for ${n.data.month}/${n.data.year}`;

    case "attendance_unlock_approved":
      return `Unlock approved for ${n.data.month}/${n.data.year}`;

    case "attendance_unlock_rejected":
      return `Unlock rejected for ${n.data.month}/${n.data.year}`;

    default:
      return n.message;
  }
}
