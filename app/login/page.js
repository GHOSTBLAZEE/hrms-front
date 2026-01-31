"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

import { loginApi } from "@/lib/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("admin@nova.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const loginMutation = useMutation({
    mutationFn: () => loginApi({ email, password }),

    onSuccess: async () => {
      toast.success("Welcome back!", {
        description: "Login successful. Redirecting to dashboard..."
      });

      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.replace("/dashboard");
    },

    onError: (err) => {
      const message = err?.data?.message || err?.message || "Invalid email or password";
      toast.error("Login Failed", {
        description: message
      });
      setErrors({ general: message });
    },
  });

  const loading = loginMutation.status === "pending";

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    loginMutation.mutate();
  };

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Comprehensive employee data and lifecycle management"
    },
    {
      icon: Calendar,
      title: "Leave & Attendance",
      description: "Automated leave tracking and attendance monitoring"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Real-time insights and performance metrics"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
        {/* LEFT PANEL - Brand & Features */}
        <Card className="rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none border-r-0 lg:border-r bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl overflow-hidden">
          <CardContent className="h-full flex flex-col justify-between p-8 lg:p-12 relative">
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>

            <div className="space-y-8 relative z-10">
              {/* Logo & Brand */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500 rounded-xl">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">SLDINFOSOFT HRMS</h1>
                    <p className="text-sm text-blue-200 font-medium">Enterprise Edition</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Modern Human Resource Management System built for enterprise organizations
                </p>
              </div>

              {/* Features Grid */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
                  Key Features
                </h3>
                <div className="grid gap-4">
                  {features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <feature.icon className="h-5 w-5 text-blue-300" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-white mb-0.5">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-3 relative z-10">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>© 2026 SLDINFOSOFT HRMS. All rights reserved.</span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Secured
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT PANEL - Login Form */}
        <Card className="rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none bg-white shadow-2xl">
          <CardContent className="p-8 lg:p-12 h-full flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-sm text-slate-600">
                  Sign in to access your HRMS dashboard
                </p>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: null }));
                    }}
                    placeholder="admin@example.com"
                    className={cn(
                      "pl-11 h-12 border-2 text-base",
                      errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                    )}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    onClick={() => toast.info("Please contact your administrator")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors(prev => ({ ...prev, password: null }));
                    }}
                    placeholder="Enter your password"
                    className={cn(
                      "pl-11 pr-11 h-12 border-2 text-base",
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                    )}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  Keep me signed in
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Need Help?</span>
                </div>
              </div>

              {/* Help Text */}
              <div className="text-center space-y-2">
                <p className="text-sm text-slate-600">
                  Contact your system administrator for account access
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}