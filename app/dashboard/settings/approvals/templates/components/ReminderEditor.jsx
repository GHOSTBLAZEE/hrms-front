"use client";

export default function ReminderEditor({ value = [], onChange }) {
  const reminder = value[0] ?? {
    after_days: 2,
    repeat_every_days: 1,
  };

  function update(key, val) {
    onChange([
      {
        ...reminder,
        [key]: Number(val),
      },
    ]);
  }

  return (
    <div className="border rounded-md p-3 space-y-2 bg-muted/20">
      <p className="text-xs font-medium">Reminder</p>

      <div className="flex gap-3">
        <label className="text-xs flex items-center gap-1">
          After
          <input
            type="number"
            min="1"
            value={reminder.after_days}
            onChange={(e) => update("after_days", e.target.value)}
            className="w-14 border rounded px-1 py-0.5"
          />
          days
        </label>

        <label className="text-xs flex items-center gap-1">
          Repeat every
          <input
            type="number"
            min="1"
            value={reminder.repeat_every_days}
            onChange={(e) =>
              update("repeat_every_days", e.target.value)
            }
            className="w-14 border rounded px-1 py-0.5"
          />
          days
        </label>
      </div>
    </div>
  );
}
