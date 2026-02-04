"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, FileText, Calendar, CreditCard } from "lucide-react";
import apiClient from "@/lib/apiClient";

const ID_TYPES = [
  { value: "national_id", label: "National ID Card" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "tax_id", label: "Tax ID" },
  { value: "social_security", label: "Social Security" },
  { value: "other", label: "Other" },
];

export default function IdentificationTab({ employee, employeeId }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id_type: "",
    id_number: "",
    issue_date: "",
    expiry_date: "",
    issuing_authority: "",
  });

  const { data: identifications, isLoading } = useQuery({
    queryKey: ["identifications", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/identifications`);
      return response.data?.data || [];
    },
  });

  const createId = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/identifications`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identifications", employeeId] });
      toast.success("Identification document added successfully");
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const updateId = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}/identifications/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identifications", employeeId] });
      toast.success("Identification document updated successfully");
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const deleteId = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/identifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identifications", employeeId] });
      toast.success("Identification document deleted successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateId.mutate({ id: editingId.id, data: formData });
    } else {
      createId.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      id_type: "",
      id_number: "",
      issue_date: "",
      expiry_date: "",
      issuing_authority: "",
    });
    setEditingId(null);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setFormData({
      id_type: id.id_type || "",
      id_number: id.id_number || "",
      issue_date: id.issue_date || "",
      expiry_date: id.expiry_date || "",
      issuing_authority: id.issuing_authority || "",
    });
    setIsDialogOpen(true);
  };

  const getIdLabel = (type) => ID_TYPES.find(t => t.value === type)?.label || type;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Identification Documents
            </CardTitle>
            <CardDescription>National IDs, passports, and other identification</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Add"} Identification Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Document Type *</Label>
                  <Select
                    value={formData.id_type}
                    onValueChange={(value) => setFormData({ ...formData, id_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Document Number *</Label>
                  <Input
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    placeholder="Enter document number"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Issuing Authority</Label>
                  <Input
                    value={formData.issuing_authority}
                    onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })}
                    placeholder="e.g., Government of India"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingId ? "Update" : "Add"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : identifications && identifications.length > 0 ? (
          <div className="grid gap-4">
            {identifications.map((id) => (
              <Card key={id.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">{getIdLabel(id.id_type)}</h4>
                      </div>
                      <p className="text-sm"><span className="text-muted-foreground">Number:</span> {id.id_number}</p>
                      {id.issue_date && <p className="text-sm"><span className="text-muted-foreground">Issued:</span> {new Date(id.issue_date).toLocaleDateString()}</p>}
                      {id.expiry_date && <p className="text-sm"><span className="text-muted-foreground">Expires:</span> {new Date(id.expiry_date).toLocaleDateString()}</p>}
                      {id.issuing_authority && <p className="text-sm"><span className="text-muted-foreground">Authority:</span> {id.issuing_authority}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteId.mutate(id.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No identification documents added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
