"use client";

import { useEffect } from "react";
import { useApproverOptions } from "../../hooks/useApproverOptions";

export default function ApproverSelector({ value=[], onChange }) {
  const { users,roles,loading } = useApproverOptions();

  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading approvers…</div>;
  }

  function add(type, item) {
    if (value.approver_ids.includes(item.id)) return;

    onChange({
      approver_type: type,
      approver_ids: [...value.approver_ids, item.id],
    });
  }

  function remove(id) {
    onChange({
      ...value,
      approver_ids: value.approver_ids.filter(x => x !== id),
    });
  }

  const list = value.approver_type === "role" ? roles : users;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium">Approvers</p>

      {/* Type */}
      <div className="flex gap-2">
        {["user", "role"].map(t => (
          <button
            key={t}
            onClick={() =>
              onChange({ approver_type: t, approver_ids: [] })
            }
            className={`px-2 py-1 text-xs border rounded
              ${value.approver_type === t ? "bg-muted" : ""}
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Selected */}
      <div className="flex flex-wrap gap-2">
        {value.approver_ids.map(id => {
          const item = list.find(x => x.id === id);
          if (!item) return null;

          return (
            <span
              key={id}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded"
            >
              {item.name}
              <button onClick={() => remove(id)}>✕</button>
            </span>
          );
        })}
      </div>

      {/* Add */}
      <select
        className="border rounded px-2 py-1 text-xs"
        value=""
        onChange={(e) => {
          const item = list.find(x => x.id == e.target.value);
          if (item) add(value.approver_type, item);
        }}
      >
        <option value="">+ Add {value.approver_type}</option>
        {list.map(x => (
          <option key={x.id} value={x.id}>{x.name}</option>
        ))}
      </select>
    </div>
  );
}
