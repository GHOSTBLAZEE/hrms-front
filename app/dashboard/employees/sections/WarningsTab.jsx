"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Plus, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function WarningsTab({ employee }) {
  const [open, setOpen] = useState(false);
  const [acknowledgeOpen, setAcknowledgeOpen] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const queryClient = useQueryClient();

  const { data: warnings = [], isLoading } = useQuery({
    queryKey: ["employee-warnings", employee.id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/employees/${employee.id}/warnings`);
      if (!response.ok) throw new Error("Failed to fetch warnings");
      return response.json();
    },
  });

  const createWarningMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/v1/employees/${employee.id}/warnings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create warning");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-warnings", employee.id]);
      toast.success("Warning issued successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to issue warning");
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async ({ warningId, response }) => {
      const res = await fetch(
        `/api/v1/employees/${employee.id}/warnings/${warningId}/acknowledge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_response: response }),
        }
      );
      if (!res.ok) throw new Error("Failed to acknowledge warning");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-warnings", employee.id]);
      toast.success("Warning acknowledged");
      setAcknowledgeOpen(false);
      setSelectedWarning(null);
    },
    onError: () => {
      toast.error("Failed to acknowledge warning");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      type: formData.get("type"),
      severity: formData.get("severity"),
      category: formData.get("category"),
      subject: formData.get("subject"),
      description: formData.get("description"),
      issued_date: formData.get("issued_date"),
      expiry_date: formData.get("expiry_date") || null,
      action_taken: formData.get("action_taken") || null,
    };
    createWarningMutation.mutate(data);
  };

  const handleAcknowledge = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    acknowledgeMutation.mutate({
      warningId: selectedWarning.id,
      response: formData.get("response"),
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[severity] || "";
  };

  const getTypeColor = (type) => {
    const colors = {
      verbal: "bg-gray-100 text-gray-800 border-gray-200",
      written: "bg-blue-100 text-blue-800 border-blue-200",
      final: "bg-orange-100 text-orange-800 border-orange-200",
      suspension: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[type] || "";
  };

  const totalWarnings = warnings.length;
  const activeWarnings = warnings.filter((w) => w.status === "active").length;
  const acknowledgedWarnings = warnings.filter((w) => w.acknowledged_at).length;

  return (
    <div className="space-y-6">
      {/* Stats and Actions */}
      <div className="flex items-center justify-between">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Warnings</CardDescription>
              <CardTitle className="text-2xl">{totalWarnings}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-2xl text-orange-600">
                {activeWarnings}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Acknowledged</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {acknowledgedWarnings}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Issue Warning
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Issue Warning</DialogTitle>
                <DialogDescription>
                  Issue a disciplinary warning to {employee.full_name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verbal">Verbal Warning</SelectItem>
                        <SelectItem value="written">Written Warning</SelectItem>
                        <SelectItem value="final">Final Warning</SelectItem>
                        <SelectItem value="suspension">Suspension</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select name="severity" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="conduct">Conduct</SelectItem>
                      <SelectItem value="policy_violation">Policy Violation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief subject line"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Detailed description of the incident"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issued_date">Issue Date</Label>
                    <Input
                      id="issued_date"
                      name="issued_date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                    <Input id="expiry_date" name="expiry_date" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action_taken">Action Taken</Label>
                  <Textarea
                    id="action_taken"
                    name="action_taken"
                    rows={2}
                    placeholder="Any immediate action taken"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createWarningMutation.isPending}>
                  {createWarningMutation.isPending ? "Issuing..." : "Issue Warning"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Warnings List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Loading warnings...
            </CardContent>
          </Card>
        ) : warnings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No warnings found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This employee has a clean record
              </p>
            </CardContent>
          </Card>
        ) : (
          warnings.map((warning) => (
            <Card key={warning.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getTypeColor(warning.type)}>
                        {warning.type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getSeverityColor(warning.severity)}>
                        {warning.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {warning.category.replace("_", " ").toUpperCase()}
                      </Badge>
                      {warning.acknowledged_at && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          ACKNOWLEDGED
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{warning.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Issued on {new Date(warning.issued_date).toLocaleDateString()} by{" "}
                      {warning.issued_by_name || "HR"}
                      {warning.expiry_date &&
                        ` · Expires on ${new Date(warning.expiry_date).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  {!warning.acknowledged_at && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedWarning(warning);
                        setAcknowledgeOpen(true);
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {warning.description}
                  </div>
                </div>
                {warning.action_taken && (
                  <div>
                    <div className="text-sm font-medium mb-1">Action Taken</div>
                    <div className="text-sm text-muted-foreground">
                      {warning.action_taken}
                    </div>
                  </div>
                )}
                {warning.employee_response && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">Employee Response</div>
                    <div className="text-sm text-muted-foreground">
                      {warning.employee_response}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Acknowledged on{" "}
                      {new Date(warning.acknowledged_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Acknowledge Dialog */}
      <Dialog open={acknowledgeOpen} onOpenChange={setAcknowledgeOpen}>
        <DialogContent>
          <form onSubmit={handleAcknowledge}>
            <DialogHeader>
              <DialogTitle>Acknowledge Warning</DialogTitle>
              <DialogDescription>
                Provide your response to this warning (optional)
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                name="response"
                rows={4}
                placeholder="Enter your response or acknowledgment..."
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAcknowledgeOpen(false);
                  setSelectedWarning(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={acknowledgeMutation.isPending}>
                {acknowledgeMutation.isPending ? "Acknowledging..." : "Acknowledge"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
