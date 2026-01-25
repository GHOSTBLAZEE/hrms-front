import { APPROVAL_MODULES } from "../utils/approvalModules";

export default function ModuleSidebar({ value, onChange }) {
  return (
    <div className="w-64 border-r bg-muted/30 p-3 space-y-1">
      {APPROVAL_MODULES.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm
            ${
              value === m.key
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }
          `}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
