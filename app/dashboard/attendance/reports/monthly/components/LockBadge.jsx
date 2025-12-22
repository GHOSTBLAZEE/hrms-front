import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LockBadge({ locked, reason }) {
  if (!locked) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
          🔒 Locked
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {reason || "Attendance locked for payroll"}
      </TooltipContent>
    </Tooltip>
  );
}
