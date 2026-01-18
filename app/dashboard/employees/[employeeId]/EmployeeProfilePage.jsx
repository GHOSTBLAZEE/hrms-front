"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";
import ProfileHeader from "./components/ProfileHeader";
import TabNavigation from "./components/TabNavigation";
import { tabs } from "./tabs";

export default function EmployeeProfilePage({ employeeId }) {
  const { user } = useAuth();

  if (!employeeId) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Invalid employee
      </div>
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["employee-profile", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/v1/employees/${employeeId}`
      );
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading profile…</div>;
  if (error) return <div className="p-6">Access denied</div>;

  return (
    <div className="p-6 space-y-6">
      <ProfileHeader employee={data} />
      <TabNavigation
        tabs={tabs}
        employee={data}
        employeeId={employeeId}
      />
    </div>
  );
}
