import { Card } from "@/components/ui/card";

export default function LeaveBalanceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="h-36 animate-pulse" />
      ))}
    </div>
  );
}
