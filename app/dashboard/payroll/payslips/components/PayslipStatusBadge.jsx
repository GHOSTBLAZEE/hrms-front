import { Badge } from "@/components/ui/badge";

const VARIANT = {
  finalized: "success",
};

export default function PayslipStatusBadge({ status }) {
  return (
    <Badge variant={VARIANT[status] || "secondary"}>
      {status}
    </Badge>
  );
}
