"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Shield,
  Wallet,
  Briefcase,
  Search,
  Filter,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Phone,
  Mail,
  FileText,
  Info,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function MyBenefitsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch user's benefits
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-benefits", statusFilter],
    queryFn: async () => {
      if (!user?.employee_id) {
        throw new Error("Employee profile not found");
      }

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await apiClient.get(
        `/api/v1/employees/${user.employee_id}/benefits?${params}`
      );
      return response.data?.data || [];
    },
    enabled: !!user?.employee_id,
  });

  const benefits = data || [];

  // Filter by search
  const filteredBenefits = benefits.filter(
    (benefit) =>
      benefit.benefit_name?.toLowerCase().includes(search.toLowerCase()) ||
      benefit.benefit_type?.toLowerCase().includes(search.toLowerCase()) ||
      benefit.provider?.toLowerCase().includes(search.toLowerCase())
  );

  // Benefit type configurations
  const benefitTypes = {
    health_insurance: {
      label: "Health Insurance",
      icon: Heart,
      color: "rose",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      textColor: "text-rose-700",
    },
    life_insurance: {
      label: "Life Insurance",
      icon: Shield,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    retirement: {
      label: "Retirement Plan",
      icon: Wallet,
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
    },
    disability: {
      label: "Disability Insurance",
      icon: Shield,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
    wellness: {
      label: "Wellness Program",
      icon: Heart,
      color: "pink",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-700",
    },
    other: {
      label: "Other Benefits",
      icon: Briefcase,
      color: "slate",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      textColor: "text-slate-700",
    },
  };

  const getBenefitTypeConfig = (type) => {
    return benefitTypes[type] || benefitTypes.other;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Active", variant: "default", className: "bg-green-100 text-green-800 border-green-200" },
      pending: { label: "Pending", variant: "outline", className: "bg-amber-100 text-amber-800 border-amber-200" },
      expired: { label: "Expired", variant: "outline", className: "bg-red-100 text-red-800 border-red-200" },
      terminated: { label: "Terminated", variant: "outline", className: "bg-slate-100 text-slate-800 border-slate-200" },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!user?.employee_id) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Employee Profile Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You need an employee profile to access benefits
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Failed to load benefits</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.response?.data?.message || "Please try again"}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            My Benefits
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your employee benefits and coverage
          </p>
        </div>
        <Button
          variant="outline"
          className="border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Benefits Handbook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Benefits</p>
                <p className="text-3xl font-bold text-rose-600">{benefits.length}</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {benefits.filter((b) => b.status === "active").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">
                  {benefits.filter((b) => b.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Coverage</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    benefits
                      .filter((b) => b.status === "active")
                      .reduce((sum, b) => sum + (b.coverage_amount || 0), 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search benefits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBenefits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search || statusFilter !== "all"
                ? "No benefits found"
                : "No benefits enrolled"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Contact HR to enroll in available benefits"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBenefits.map((benefit) => {
            const typeConfig = getBenefitTypeConfig(benefit.benefit_type);
            const statusBadge = getStatusBadge(benefit.status);
            const Icon = typeConfig.icon;

            return (
              <Card
                key={benefit.id}
                className={`border-l-4 border-l-${typeConfig.color}-500 hover:shadow-lg transition-all`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${typeConfig.bgColor} border-2 ${typeConfig.borderColor} flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${typeConfig.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">
                        {benefit.benefit_name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={typeConfig.bgColor + " " + typeConfig.textColor + " " + typeConfig.borderColor}>
                          {typeConfig.label}
                        </Badge>
                        <Badge variant="outline" className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {benefit.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {benefit.description}
                    </p>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    {benefit.provider && (
                      <div className="flex items-start gap-2">
                        <Building className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Provider</p>
                          <p className="font-medium">{benefit.provider}</p>
                        </div>
                      </div>
                    )}

                    {benefit.coverage_amount && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Coverage</p>
                          <p className="font-medium">{formatCurrency(benefit.coverage_amount)}</p>
                        </div>
                      </div>
                    )}

                    {benefit.start_date && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Start Date</p>
                          <p className="font-medium">
                            {new Date(benefit.start_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {benefit.end_date && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">End Date</p>
                          <p className="font-medium">
                            {new Date(benefit.end_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {benefit.dependents_count > 0 && (
                      <div className="flex items-start gap-2 col-span-2">
                        <Users className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Dependents Covered</p>
                          <p className="font-medium">{benefit.dependents_count} dependents</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  {(benefit.contact_email || benefit.contact_phone) && (
                    <div className="pt-4 border-t space-y-2">
                      <p className="text-xs font-semibold text-slate-700">Provider Contact</p>
                      {benefit.contact_email && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <a href={`mailto:${benefit.contact_email}`} className="hover:text-blue-600">
                            {benefit.contact_email}
                          </a>
                        </div>
                      )}
                      {benefit.contact_phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <a href={`tel:${benefit.contact_phone}`} className="hover:text-blue-600">
                            {benefit.contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Info className="h-4 w-4 mr-1.5" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}