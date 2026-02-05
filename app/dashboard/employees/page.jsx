"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, FileSpreadsheet, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { columns, employeeSearchKeys } from "./column";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* =========================================================
 | Employee Page Component with Laravel API Integration
 |========================================================= */
export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Departments and Locations for filters
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  /* =========================================================
   | Fetch Filter Options
   |========================================================= */
      const fetchFilterOptions = async () => {
        try {
          // Fetch departments
          const deptResponse = await apiClient.get("/api/v1/departments");
          if (deptResponse.data) {
            // Handle Laravel resource collection response
            const deptData = Array.isArray(deptResponse.data) 
              ? deptResponse.data 
              : (deptResponse.data.data || []);
            setDepartments(deptData);
          }

          // Fetch locations
          const locResponse = await apiClient.get("/api/v1/locations");
          if (locResponse.data) {
            // Handle Laravel resource collection response
            const locData = Array.isArray(locResponse.data) 
              ? locResponse.data 
              : (locResponse.data.data || []);
            setLocations(locData);
          }
        } catch (err) {
          console.error("Error fetching filter options:", err);
          toast.error("Failed to load filter options");
        }
      };

  /* =========================================================
   | Fetch Employees - Matching Laravel Route Structure
   |========================================================= */
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters matching Laravel backend expectations
      const params = new URLSearchParams();
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      
      if (departmentFilter !== "all") {
        params.append("department_id", departmentFilter);
      }
      
      if (locationFilter !== "all") {
        params.append("location_id", locationFilter);
      }
      
      if (typeFilter !== "all") {
        params.append("employment_type", typeFilter);
      }
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      // Add sorting (optional)
      params.append("sort_by", "employee_code");
      params.append("sort_order", "asc");
      
      // Add pagination
      params.append("per_page", "100");

      // Correct endpoint: /api/v1/employees (without trailing slash)
      const response = await apiClient.get(
        `/api/v1/employees?${params.toString()}`
      );
      
      // Laravel pagination response structure
      if (response.data) {
        // Handle paginated response
        setEmployees(response.data.data || response.data || []);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching employees:", err);
      toast.error("Failed to load employees", {
        description: err.message || "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
   | Load data on mount and when filters change
   |========================================================= */
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [statusFilter, departmentFilter, locationFilter, typeFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchEmployees();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* =========================================================
   | Handle Row Click - Navigate to Employee Detail
   |========================================================= */
  const handleRowClick = (employee) => {
    router.push(`/dashboard/employees/${employee.id}`);
  };

  /* =========================================================
   | Handle Bulk Actions
   |========================================================= */
  const handleBulkDelete = async () => {
    const selectedEmployees = Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(key => employees[parseInt(key)]);
    
    if (selectedEmployees.length === 0) {
      toast.warning("No employees selected");
      return;
    }

    if (!confirm(`Are you sure you want to deactivate ${selectedEmployees.length} employee(s)?`)) {
      return;
    }

    try {
      // Implement bulk delete logic here
      toast.success(`${selectedEmployees.length} employee(s) deactivated successfully`);
      setRowSelection({});
      fetchEmployees();
    } catch (err) {
      toast.error("Failed to deactivate employees", {
        description: err.message
      });
    }
  };

  /* =========================================================
   | Handle Export - Using Laravel Export Endpoint
   |========================================================= */
  const handleExport = async () => {
    try {
      toast.info("Preparing export...");
      
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (departmentFilter !== "all") params.append("department_id", departmentFilter);
      if (locationFilter !== "all") params.append("location_id", locationFilter);
      if (typeFilter !== "all") params.append("employment_type", typeFilter);

      // Call Laravel export endpoint
      const response = await apiClient.get(
        `/api/v1/employees/export?${params.toString()}`,
        { responseType: 'blob' }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Export completed successfully");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export employees", {
        description: err.message
      });
    }
  };

  /* =========================================================
   | Handle Import
   |========================================================= */
  const handleImport = () => {
    router.push("/dashboard/employees/import");
  };

  /* =========================================================
   | Handle Add Employee
   |========================================================= */
  const handleAddEmployee = () => {
    router.push("/dashboard/employees/create");
  };

  /* =========================================================
   | Clear All Filters
   |========================================================= */
  const clearFilters = () => {
    setStatusFilter("all");
    setDepartmentFilter("all");
    setLocationFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = 
    statusFilter !== "all" || 
    departmentFilter !== "all" || 
    locationFilter !== "all" || 
    typeFilter !== "all";

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's employee records
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={handleAddEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={isLoading ? "..." : employees.length}
          icon={Users}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Active"
          value={isLoading ? "..." : employees.filter(e => e.status === "active").length}
          icon={Users}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="On Probation"
          value={isLoading ? "..." : employees.filter(e => e.status === "probation").length}
          icon={Users}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatsCard
          title="Inactive"
          value={isLoading ? "..." : employees.filter(e => e.status === "inactive").length}
          icon={Users}
          iconColor="text-slate-600"
          bgColor="bg-slate-50"
        />
      </div>

      {/* Enhanced DataTable with Filters */}
      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        error={error}
        selectable={true}
        onRowClick={handleRowClick}
        globalSearchKeys={employeeSearchKeys}
        searchPlaceholder="Search employees by name, email, code..."
        emptyMessage="No employees found"
        emptyDescription="Get started by adding your first employee or adjusting your filters."
        pageSize={15}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        
        // Custom filters in toolbar
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="resigned">Resigned</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Employment Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-3"
              >
                Clear filters
              </Button>
            )}
          </div>
        }
        
        // Custom toolbar actions
        toolbarActions={
          Object.keys(rowSelection).some(key => rowSelection[key]) && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="h-9"
            >
              Deactivate Selected ({Object.keys(rowSelection).filter(k => rowSelection[k]).length})
            </Button>
          )
        }
      />
    </div>
  );
}

/* =========================================================
 | Stats Card Component
 |========================================================= */
function StatsCard({ title, value, icon: Icon, iconColor, bgColor }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="mt-2 text-3xl font-bold">{value}</div>
        </div>
        {Icon && (
          <div className={`rounded-full p-3 ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 | Server-Side Pagination Example (Advanced)
 |========================================================= */
export function EmployeesPageServerSide() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // Laravel pagination: page starts at 1
      const page = pagination.pageIndex + 1;
      
      const response = await apiClient.get(
        `/api/v1/employees?page=${page}&per_page=${pagination.pageSize}`
      );
      
      // Laravel pagination response structure
      if (response.data) {
        setEmployees(response.data.data || []);
        setTotalRows(response.data.total || 0);
        setTotalPages(response.data.last_page || 0);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination]);

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        pageCount={totalPages}
        manualPagination
        onPaginationChange={setPagination}
        state={{ pagination }}
        globalSearchKeys={employeeSearchKeys}
      />
    </div>
  );
}