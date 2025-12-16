"use client";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/useCompanies";

export default function CompaniesPage() {
  const { data, remove } = useCompanies();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Companies</h1>
      {data?.data.map((c) => (
        <div key={c.id} className="flex justify-between border p-3 rounded">
          <span>{c.name}</span>
          {c.can.delete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => remove.mutate(c.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
