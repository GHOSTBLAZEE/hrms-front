"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function LeaveBalanceCard({ balance }) {
  const {
    name,
    code,
    accrued = 0,
    used = 0,
    pending = 0,
    available = 0,
    allow_half_day,
    is_paid = true,
    annual_limit,
  } = balance;

  const showProgress =
    is_paid && typeof annual_limit === "number";

  const percent =
    showProgress && annual_limit > 0
      ? Math.min((used / annual_limit) * 100, 100)
      : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          <span>
            {name}{" "}
            <span className="text-muted-foreground">
              ({code})
            </span>
          </span>

          {!is_paid && (
            <span className="text-xs rounded bg-red-100 text-red-700 px-2 py-0.5">
              Unpaid (LOP)
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <Row label="Accrued" value={accrued} />
        <Row label="Used" value={used} />
        <Row label="Pending" value={pending} />
        <Row
          label="Available"
          value={available}
          highlight
        />

        {/* Progress */}
        {showProgress && (
          <ProgressBar
            percent={percent}
            used={used}
            limit={annual_limit}
          />
        )}

        {/* Rules */}
        <div className="text-xs text-muted-foreground space-y-1 pt-1">
          {allow_half_day && <div>✔ Half-day allowed</div>}

          {!is_paid && (
            <div className="text-red-600">
              ⚠ This leave reduces salary in payroll
            </div>
          )}

          {pending > 0 && (
            <div>
              ⏳ Pending leaves not yet deducted
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span
        className={
          highlight
            ? "font-medium text-green-600"
            : "font-medium"
        }
      >
        {Number(value) || 0}
      </span>
    </div>
  );
}

function ProgressBar({ percent, used, limit }) {
  return (
    <div className="pt-2">
      <div className="h-1.5 bg-muted rounded overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-muted-foreground mt-1">
        {used} of {limit} used
      </div>
    </div>
  );
}
