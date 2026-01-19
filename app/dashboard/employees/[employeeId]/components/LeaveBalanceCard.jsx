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
    entitled,
    accrued,
    used,
    pending,
    available,
    allow_half_day,
  } = balance;
  
const barColor =
  used > entitled ? "bg-red-600" : "bg-blue-600";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          {name}{" "}
          <span className="text-muted-foreground">
            ({code})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <Row label="Entitled" value={entitled} />
        <Row label="Accrued" value={accrued} />
        <Row label="Used" value={used} />
        <Row label="Pending" value={pending} />
        <Row
          label="Available"
          value={available}
          highlight
        />

        <ProgressBar
          used={used}
          entitled={entitled}
        />

        {allow_half_day && (
          <div className="text-xs text-muted-foreground">
            Half-day allowed
          </div>
        )}
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
        {Number.isInteger(Number(value))
          ? value
          : Number(value).toString()}
      </span>
    </div>
  );
}

function ProgressBar({ used, entitled }) {
  const percent =
    entitled > 0
      ? Math.min((used / entitled) * 100, 100)
      : 0;

  return (
    <div className="pt-2">
      <div className="h-1.5 bg-muted rounded overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-muted-foreground mt-1">
        {used} of {entitled} used
      </div>
    </div>
  );
}
