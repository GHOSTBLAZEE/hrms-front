import { Badge } from "@/components/ui/badge";

export default function StatutoryStatusBadge({ status }) {
  if (status.type === "error") {
    return <Badge variant="destructive">Missing UAN</Badge>;
  }

  if (status.type === "ok") {
    return <Badge className="bg-green-600">PF Ready</Badge>;
  }

  return <Badge variant="secondary">PF N/A</Badge>;
}
