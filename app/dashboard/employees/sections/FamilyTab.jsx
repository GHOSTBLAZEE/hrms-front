"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Plus, Phone, AlertCircle } from "lucide-react";
import AddFamilyDialog from "../components/AddFamilyDialog";

export default function FamilyTab({ employee, employeeId, onUpdate }) {
  const [addOpen, setAddOpen] = useState(false);

  const { data: family, isLoading } = useQuery({
    queryKey: ["employee-family", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/family`);
      return res.data.data || [];
    },
  });

  const getRelationshipBadge = (relationship) => {
    const colors = {
      spouse: "bg-pink-100 text-pink-700 border-pink-200",
      parent: "bg-blue-100 text-blue-700 border-blue-200",
      child: "bg-purple-100 text-purple-700 border-purple-200",
      sibling: "bg-teal-100 text-teal-700 border-teal-200",
      other: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[relationship] || colors.other;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Family & Emergency Contacts
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Dependent and emergency contact information
            </p>
          </div>
          {employee.can?.update && (
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          )}
        </div>

        {!family || family.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Family Contacts
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              No family or emergency contacts have been added
            </p>
            {employee.can?.update && (
              <Button
                onClick={() => setAddOpen(true)}
                className="bg-gradient-to-r from-pink-600 to-rose-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {family.map((member) => (
              <Card key={member.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{member.name}</h4>
                      <Badge className={getRelationshipBadge(member.relationship)}>
                        {member.relationship}
                      </Badge>
                    </div>
                    {member.date_of_birth && (
                      <p className="text-sm text-muted-foreground">
                        DOB: {new Date(member.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {member.is_emergency_contact && (
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Emergency
                    </Badge>
                  )}
                </div>

                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}

                {member.occupation && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Occupation: {member.occupation}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>

      <AddFamilyDialog
        employeeId={employeeId}
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}