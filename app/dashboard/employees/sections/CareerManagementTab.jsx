"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, AlertTriangle, LogOut, Plus, Calendar, Building } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function CareerManagementTab({ employee, employeeId }) {
  const { data: promotions } = useQuery({
    queryKey: ["promotions", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/promotions`);
      return response.data?.data || [];
    },
  });

  const { data: transfers } = useQuery({
    queryKey: ["transfers", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/transfers`);
      return response.data?.data || [];
    },
  });

  const { data: warnings } = useQuery({
    queryKey: ["warnings", employeeId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/employees/${employeeId}/warnings`);
      return response.data?.data || [];
    },
  });

  return (
    <Tabs defaultValue="promotions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="promotions">Promotions</TabsTrigger>
        <TabsTrigger value="transfers">Transfers</TabsTrigger>
        <TabsTrigger value="warnings">Warnings</TabsTrigger>
      </TabsList>

      <TabsContent value="promotions">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Promotions & Career Growth
                </CardTitle>
                <CardDescription>History of promotions and career progression</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Promotion
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {promotions && promotions.length > 0 ? (
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <Card key={promo.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{promo.new_designation?.name || promo.new_designation}</h4>
                          <Badge variant="success">Promoted</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          From: {promo.old_designation?.name || promo.old_designation}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Effective: {new Date(promo.effective_date).toLocaleDateString()}
                        </div>
                        {promo.reason && <p className="text-sm">{promo.reason}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No promotions recorded yet
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transfers">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Transfers & Relocations
                </CardTitle>
                <CardDescription>History of department and location transfers</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transfer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transfers && transfers.length > 0 ? (
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <Card key={transfer.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">
                            {transfer.new_department?.name || transfer.new_location?.name}
                          </h4>
                          <Badge variant="outline">Transfer</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          From: {transfer.old_department?.name || transfer.old_location?.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Effective: {new Date(transfer.effective_date).toLocaleDateString()}
                        </div>
                        {transfer.reason && <p className="text-sm">{transfer.reason}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No transfers recorded yet
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="warnings">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Warnings & Disciplinary Actions
                </CardTitle>
                <CardDescription>Disciplinary history and warnings</CardDescription>
              </div>
              <Button size="sm" variant="destructive">
                <Plus className="h-4 w-4 mr-2" />
                Add Warning
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {warnings && warnings.length > 0 ? (
              <div className="space-y-4">
                {warnings.map((warning) => (
                  <Card key={warning.id} className="border-l-4 border-l-destructive">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{warning.title}</h4>
                          <Badge variant="destructive">{warning.severity}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(warning.issue_date).toLocaleDateString()}
                        </div>
                        <p className="text-sm">{warning.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No warnings on record
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
