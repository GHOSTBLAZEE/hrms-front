"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginApi } from "@/lib/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");

  const loginMutation = useMutation({
    mutationFn: () => loginApi({ email, password }),

    onSuccess: async () => {
      toast.success("Login successful");
      await queryClient.invalidateQueries(["me"]);
      router.push("/dashboard");
    },

    onError: (err) => {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Invalid email or password"
      );
    },
  });

  const loading = loginMutation.status === "pending";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">

        {/* LEFT PANEL */}
        <Card className="rounded-none border-r bg-primary text-primary-foreground">
          <CardContent className="h-full flex flex-col justify-center p-8 space-y-4">
            <h1 className="text-3xl font-bold">HRMS</h1>
            <p className="text-sm opacity-90">
              Enterprise Human Resource Management System
            </p>
            <p className="text-sm opacity-80">
              Manage employees, attendance, leave, payroll and more — all in one place.
            </p>
          </CardContent>
        </Card>

        {/* RIGHT PANEL */}
        <Card className="rounded-none">
          <CardContent className="p-8 space-y-5">
            <h2 className="text-xl font-semibold">Sign in</h2>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => loginMutation.mutate()}
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
