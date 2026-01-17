export default function PayrollTotalsFooter({ totals }) {
  if (!totals) return null;

  return (
    <div className="border rounded-md p-4 flex justify-end gap-8 text-sm">
      <Stat label="Total Gross" value={totals.gross} />
      <Stat label="Total Deductions" value={totals.deductions} />
      <Stat label="Total Net Pay" value={totals.net_pay} strong />
    </div>
  );
}

function Stat({ label, value, strong }) {
  return (
    <div className="text-right">
      <div className="text-muted-foreground">{label}</div>
      <div className={strong ? "font-semibold" : ""}>
        {value}
      </div>
    </div>
  );
}
