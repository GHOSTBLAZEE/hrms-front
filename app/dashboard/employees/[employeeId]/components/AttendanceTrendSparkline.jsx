"use client";

import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AttendanceTrendSparkline({ data }) {
  if (!data?.length) return null;

  return (
    <ResponsiveContainer width="100%" height={64}>
      <LineChart data={data}>
        {/* Present Days */}
        <Line
          type="monotone"
          dataKey="present_days"
          strokeWidth={2}
          dot={<LockAwareDot />}
          isAnimationActive={false}
        />

        {/* Payable Days */}
        <Line
          type="monotone"
          dataKey="payable_days"
          strokeDasharray="4 4"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />

        <Tooltip
          formatter={(value, name) => [
            value,
            name === "present_days"
              ? "Present Days"
              : "Payable Days",
          ]}
          labelFormatter={(_, payload) =>
            payload?.[0]?.payload?.label
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function LockAwareDot({ cx, cy, payload }) {
  if (cx == null || cy == null) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill={payload.locked ? "#16a34a" : "#64748b"}
    />
  );
}
