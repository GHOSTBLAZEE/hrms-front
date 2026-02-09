"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeProfilePage from "@/app/dashboard/employees/[employeeId]/EmployeeProfilePage";

export default function MyProfilePage() {
  const { user, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state - user not found
  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Profile Not Available</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unable to load your profile. Please try logging in again.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check if user has employee record
  if (!user.employee_id) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <User className="h-10 w-10 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold">Employee Profile Not Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your account is not linked to an employee record. 
              Please contact HR for assistance.
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-left">
            <p className="text-sm font-medium mb-1">Account Information:</p>
            <p className="text-xs text-muted-foreground">Name: {user.name}</p>
            <p className="text-xs text-muted-foreground">Email: {user.email}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success - render employee profile with current user's employee_id
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information
        </p>
      </div>

      {/* Reuse Employee Profile Component */}
      <EmployeeProfilePage employeeId={user.employee_id} />
    </div>
  );
}