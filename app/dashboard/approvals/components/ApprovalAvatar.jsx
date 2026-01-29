"use client";

import clsx from "clsx";

export default function ApprovalAvatar({
  name,
  type = "user", // user | role
}) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={clsx(
        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
        type === "role"
          ? "bg-indigo-100 text-indigo-700"
          : "bg-primary/10 text-primary"
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
