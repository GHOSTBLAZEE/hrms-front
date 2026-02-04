"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, User, Heart, Calendar } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function FamilyDetailsTab({ employee, employeeId }) {
  const { data: familyMembers, isLoading } = useQuery({
    queryKey: ["family-members", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/family-members`);
      return response.data?.data || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Members
            </CardTitle>
            <CardDescription>Spouse, children, and dependents information</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : familyMembers && familyMembers.length > 0 ? (
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">{member.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Relationship:</span>
                          <span className="capitalize">{member.relationship}</span>
                        </div>
                        {member.date_of_birth && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">DOB:</span>
                            <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      {member.phone && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Phone:</span> {member.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No family members added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
