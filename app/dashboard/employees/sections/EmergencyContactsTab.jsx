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
import { Plus, Edit, Trash2, Phone, User, Heart, AlertCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function EmergencyContactsTab({ employee, employeeId }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    alternate_phone: "",
    is_primary: false,
  });

  // Fetch emergency contacts
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["emergency-contacts", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/emergency-contacts`);
      return response.data?.data || [];
    },
  });

  const createContact = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(`/api/v1/employees/${employeeId}/emergency-contacts`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts", employeeId] });
      toast.success("Emergency contact added successfully");
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add emergency contact");
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/api/v1/employees/${employeeId}/emergency-contacts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts", employeeId] });
      toast.success("Emergency contact updated successfully");
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update emergency contact");
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/v1/employees/${employeeId}/emergency-contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts", employeeId] });
      toast.success("Emergency contact deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete emergency contact");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContact) {
      updateContact.mutate({ id: editingContact.id, data: formData });
    } else {
      createContact.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "",
      phone: "",
      alternate_phone: "",
      is_primary: false,
    });
    setEditingContact(null);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || "",
      relationship: contact.relationship || "",
      phone: contact.phone || "",
      alternate_phone: contact.alternate_phone || "",
      is_primary: contact.is_primary || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this emergency contact?")) {
      deleteContact.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              People to contact in case of emergency
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
                </DialogTitle>
                <DialogDescription>
                  Provide details of the person to contact in emergencies
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternate_phone">Alternate Phone</Label>
                  <Input
                    id="alternate_phone"
                    type="tel"
                    value={formData.alternate_phone}
                    onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_primary" className="cursor-pointer">
                    Set as primary contact
                  </Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingContact ? "Update" : "Add"} Contact
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contacts && contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-l-4 border-l-primary/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{contact.name}</h4>
                        {contact.is_primary && (
                          <Badge variant="default">Primary</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Relationship:</span>
                          <span className="font-medium capitalize">{contact.relationship}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{contact.phone}</span>
                        </div>
                        {contact.alternate_phone && (
                          <div className="flex items-center gap-2 col-span-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Alternate:</span>
                            <span className="font-medium">{contact.alternate_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No emergency contacts added yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Add Contact" to add emergency contact information
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
