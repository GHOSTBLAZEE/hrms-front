"use client"

import { useState } from "react"
import { Plus, Search, Clock, Users, Settings, TrendingUp, Filter, UserCheck, UserX, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CreateShiftDrawer from "./components/CreateShiftDrawer"
import EditShiftDrawer from "./components/EditShiftDrawer"
import { useShifts } from "./hooks/use-shifts"

export default function ShiftsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)

  // ✅ Real API call - fetch shifts with metrics
  const { data, isLoading, error } = useShifts({
    search: search,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
  })

  // Extract from enterprise API response
  const shifts = data?.shifts || []
  const metrics = data?.metrics || {
    total_employees: 0,
    assigned_employees: 0,
    unassigned_employees: 0,
    active_shifts: 0,
    total_shifts: 0,
    assignment_rate: 0,
  }

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.name.toLowerCase().includes(search.toLowerCase()) ||
      shift.code?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && shift.is_active) ||
      (statusFilter === "inactive" && !shift.is_active)
    return matchesSearch && matchesStatus
  })

  const handleEdit = (shift) => {
    setSelectedShift(shift)
    setEditOpen(true)
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <p className="text-red-500 mb-2">Failed to load shifts</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Shift Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage work shifts and employee assignments
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Shift
        </Button>
      </div>

      {/* Enterprise Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Employees */}
        <Card className="p-6 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              {isLoading ? (
                <Skeleton className="h-10 w-20 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {metrics.total_employees}
                </p>
              )}
            </div>
            <Users className="h-10 w-10 text-blue-500 opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">Company workforce</p>
        </Card>

        {/* Assigned Employees */}
        <Card className="p-6 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned</p>
              {isLoading ? (
                <Skeleton className="h-10 w-20 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {metrics.assigned_employees}
                </p>
              )}
            </div>
            <UserCheck className="h-10 w-10 text-emerald-500 opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">Employees with shifts</p>
        </Card>

        {/* Unassigned Employees */}
        <Card className="p-6 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
              {isLoading ? (
                <Skeleton className="h-10 w-20 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {metrics.unassigned_employees}
                </p>
              )}
            </div>
            <UserX className="h-10 w-10 text-amber-500 opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">Pending assignment</p>
        </Card>

        {/* Active Shifts */}
        <Card className="p-6 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Shifts</p>
              {isLoading ? (
                <Skeleton className="h-10 w-20 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {metrics.active_shifts}
                </p>
              )}
            </div>
            <Clock className="h-10 w-10 text-purple-500 opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">
            of {metrics.total_shifts} total shifts
          </p>
        </Card>

        {/* Assignment Rate */}
        <Card className="p-6 border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-background col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Assignment Rate</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {metrics.assignment_rate}%
                  </p>
                )}
              </div>
              {!isLoading && (
                <div className="space-y-2">
                  <Progress value={metrics.assignment_rate} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {metrics.assigned_employees} of {metrics.total_employees} employees assigned
                  </p>
                </div>
              )}
            </div>
            <Target className="h-10 w-10 text-teal-500 opacity-20 ml-4" />
          </div>
        </Card>
      </div>

      {/* Alert for low assignment rate */}
      {!isLoading && metrics.assignment_rate < 50 && metrics.total_employees > 0 && (
        <Card className="p-4 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-400">
                Low Assignment Rate Alert
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-500 mt-1">
                {metrics.unassigned_employees} employees are not assigned to any shift. Consider reviewing and assigning them to optimize workforce allocation.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shifts by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Shifts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Shift Name</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Time Range</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
              <TableHead className="font-semibold">Break</TableHead>
              <TableHead className="font-semibold">Assigned</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : filteredShifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-medium">
                    {search || statusFilter !== "all" ? "No shifts found" : "No shifts created yet"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {search || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first shift to get started"}
                  </p>
                  {!search && statusFilter === "all" && (
                    <Button
                      onClick={() => setCreateOpen(true)}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Shift
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredShifts.map((shift) => (
                <TableRow key={shift.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {shift.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {shift.code || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{shift.time_range}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{shift.duration}h</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {shift.break_duration} min
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{shift.employees_count || 0}</span>
                      {shift.employees_count === 0 && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                          Empty
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {shift.is_active ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(shift)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Drawers */}
      <CreateShiftDrawer open={createOpen} onOpenChange={setCreateOpen} />
      <EditShiftDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        shift={selectedShift}
      />
    </div>
  )
}