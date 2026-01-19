"use client";

import LeaveBalanceCards from "../components/LeaveBalanceCards";
import LeaveHistory from "../components/LeaveHistory";



export default function LeavesTab({ employee }) {
  return (
    <div className="space-y-6">
      {/* Leave Balances */}
      <section>
        <h3 className="text-sm font-medium mb-2">
          Leave Balances
        </h3>

        <LeaveBalanceCards employeeId={employee.id} />
      </section>

      {/* Leave History */}
      <section>
        <h3 className="text-sm font-medium mb-2">
          Leave History
        </h3>

        <LeaveHistory employeeId={employee.id} />
      </section>
    </div>
  );
}
