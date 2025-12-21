"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SalaryComponentForm({
  initialData,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <Input
        name="name"
        placeholder="Component name"
        defaultValue={initialData?.name}
        required
      />

      <Select
        name="type"
        defaultValue={initialData?.type}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Component type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="earning">Earning</SelectItem>
          <SelectItem value="deduction">Deduction</SelectItem>
        </SelectContent>
      </Select>

      <Select
        name="calculation_type"
        defaultValue={initialData?.calculation_type}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Calculation type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fixed">Fixed</SelectItem>
          <SelectItem value="percentage">Percentage</SelectItem>
          <SelectItem value="formula">Formula</SelectItem>
        </SelectContent>
      </Select>

      <Input
        name="value"
        type="number"
        placeholder="Value (optional)"
        defaultValue={initialData?.value ?? ""}
      />

      <Select
        name="based_on"
        defaultValue={initialData?.based_on}
      >
        <SelectTrigger>
          <SelectValue placeholder="Based on (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ctc">CTC</SelectItem>
          <SelectItem value="gross">Gross</SelectItem>
          <SelectItem value="basic">Basic</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-3">
        <Switch
          name="taxable"
          defaultChecked={initialData?.taxable}
        />
        <span className="text-sm">Taxable</span>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          name="active"
          defaultChecked={initialData?.active ?? true}
        />
        <span className="text-sm">Active</span>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          Save Component
        </Button>
      </div>
    </form>
  );
}
