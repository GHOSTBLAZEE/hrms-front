"use client";

import { useState } from "react";
import { X, Plus, Users, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useApproverOptions } from "../../hooks/useApproverOptions";

export default function ApproverSelector({ value = {}, onChange }) {
  const { users, roles, loading } = useApproverOptions();
  const [isAdding, setIsAdding] = useState(false);

  const approverType = value.approver_type || "role";
  const approverIds = value.approver_ids || [];

  const handleTypeChange = (newType) => {
    onChange({
      approver_type: newType,
      approver_ids: [],
    });
  };

  const handleAdd = (itemId) => {
    if (!itemId || approverIds.includes(itemId)) return;

    onChange({
      approver_type: approverType,
      approver_ids: [...approverIds, itemId],
    });
    
    setIsAdding(false);
  };

  const handleRemove = (id) => {
    onChange({
      approver_type: approverType,
      approver_ids: approverIds.filter((x) => x !== id),
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const list = approverType === "role" ? roles : users;
  const availableItems = list.filter((item) => !approverIds.includes(item.id));

  return (
    <div className="space-y-4">
      {/* Approver Type Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Approver Type
        </Label>
        <RadioGroup
          value={approverType}
          onValueChange={handleTypeChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="role" id="type-role" />
            <Label htmlFor="type-role" className="cursor-pointer flex items-center gap-2">
              <Users className="w-4 h-4" />
              Role
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="type-user" />
            <Label htmlFor="type-user" className="cursor-pointer flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              User
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Selected Approvers */}
      {approverIds.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Selected {approverType === "role" ? "Roles" : "Users"}
          </Label>
          <div className="flex flex-wrap gap-2">
            {approverIds.map((id) => {
              const item = list.find((x) => x.id === id);
              if (!item) return null;

              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  <span className="text-sm">{item.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-blue-200"
                    onClick={() => handleRemove(id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Approver */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Add {approverType === "role" ? "Role" : "User"}
        </Label>
        
        {availableItems.length === 0 ? (
          <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/50 rounded-md">
            All {approverType === "role" ? "roles" : "users"} have been added
          </div>
        ) : (
          <Select onValueChange={handleAdd} value="">
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${approverType}...`} />
            </SelectTrigger>
            <SelectContent>
              {availableItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    {approverType === "role" ? (
                      <Users className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <UserCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    {item.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Warning if no approvers selected */}
      {approverIds.length === 0 && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
          ⚠️ Please select at least one approver for this step
        </div>
      )}
    </div>
  );
}