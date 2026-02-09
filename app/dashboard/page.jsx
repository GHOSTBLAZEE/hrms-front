"use client";

import React from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Building2,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Pie,
  PieChart,
  Cell,
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

/* =========================================================
 | Interactive Attendance Chart Component
 |========================================================= */
function AttendanceTrendChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d");
    }
  }, [isMobile]);

  // Generate daily attendance data for the last 90 days
  const generateAttendanceData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends - only show weekday data
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) continue;
      
      // Simulate realistic attendance patterns for weekdays
      const basePresent = 1100 + Math.floor(Math.random() * 100);
      const baseAbsent = 30 + Math.floor(Math.random() * 30);
      const baseLeave = 40 + Math.floor(Math.random() * 40);
      
      data.push({
        date: date.toISOString().split('T')[0],
        present: basePresent,
        absent: baseAbsent,
        leave: baseLeave,
      });
    }
    
    return data;
  };

  const allAttendanceData = React.useMemo(() => generateAttendanceData(), []);

  const filteredData = allAttendanceData.filter((item) => {
    const date = new Date(item.date);
    const today = new Date();
    let daysToSubtract = 90;
    
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const chartConfig = {
    visitors: {
      label: "Employees",
    },
    present: {
      label: "Present",
      color: "hsl(var(--chart-1))",
    },
    leave: {
      label: "On Leave",
      color: "hsl(var(--chart-3))",
    },
    absent: {
      label: "Absent",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className="col-span-4 @container/card">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily attendance tracking with interactive time filters
          </span>
          <span className="@[540px]/card:hidden">Daily attendance</span>
        </CardDescription>
        <div className="flex items-center gap-2 pt-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            size="sm"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-40 @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 90 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPresent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-present)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-present)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLeave" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-leave)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-leave)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-absent)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-absent)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="absent"
              type="natural"
              fill="url(#fillAbsent)"
              stroke="var(--color-absent)"
              stackId="a"
            />
            <Area
              dataKey="leave"
              type="natural"
              fill="url(#fillLeave)"
              stroke="var(--color-leave)"
              stackId="a"
            />
            <Area
              dataKey="present"
              type="natural"
              fill="url(#fillPresent)"
              stroke="var(--color-present)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Sample data - replace with actual API calls
  const stats = {
    totalEmployees: 1248,
    activeToday: 1156,
    onLeave: 67,
    late: 25,
    employeeTrend: 12.5,
    attendanceTrend: -2.3,
    leaveTrend: 8.1,
    lateTrend: -15.2,
  };

  const departmentData = [
    { name: "Engineering", employees: 425, color: "#3b82f6" },
    { name: "Sales", employees: 312, color: "#10b981" },
    { name: "Marketing", employees: 158, color: "#f59e0b" },
    { name: "HR", employees: 89, color: "#8b5cf6" },
    { name: "Finance", employees: 134, color: "#ec4899" },
    { name: "Operations", employees: 130, color: "#06b6d4" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "leave",
      employee: "Sarah Johnson",
      avatar: "SJ",
      action: "requested 3 days leave",
      time: "5 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "attendance",
      employee: "Michael Chen",
      avatar: "MC",
      action: "marked late arrival",
      time: "12 minutes ago",
      status: "info",
    },
    {
      id: 3,
      type: "onboarding",
      employee: "Emma Wilson",
      avatar: "EW",
      action: "completed onboarding",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 4,
      type: "leave",
      employee: "David Kumar",
      avatar: "DK",
      action: "leave request approved",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 5,
      type: "attendance",
      employee: "Lisa Anderson",
      avatar: "LA",
      action: "attendance correction submitted",
      time: "3 hours ago",
      status: "pending",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: "Leave Request",
      employee: "John Doe",
      department: "Engineering",
      details: "Annual Leave - 5 days",
      date: "Dec 20 - Dec 24",
      urgent: true,
    },
    {
      id: 2,
      type: "Attendance Correction",
      employee: "Jane Smith",
      department: "Sales",
      details: "Missed punch-out",
      date: "Dec 15",
      urgent: false,
    },
    {
      id: 3,
      type: "Overtime Request",
      employee: "Mike Johnson",
      department: "Operations",
      details: "Weekend shift - 8 hours",
      date: "Dec 18",
      urgent: false,
    },
    {
      id: 4,
      type: "Leave Request",
      employee: "Sarah Williams",
      department: "Marketing",
      details: "Sick Leave - 2 days",
      date: "Dec 16 - Dec 17",
      urgent: true,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Company All-Hands",
      date: "Dec 22, 2024",
      time: "10:00 AM",
      attendees: 1248,
      type: "meeting",
    },
    {
      id: 2,
      title: "Q4 Performance Reviews",
      date: "Dec 26 - Dec 30",
      time: "All Day",
      attendees: 456,
      type: "deadline",
    },
    {
      id: 3,
      title: "Holiday Party",
      date: "Dec 23, 2024",
      time: "6:00 PM",
      attendees: 892,
      type: "event",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees.toLocaleString()}
          change={stats.employeeTrend}
          icon={Users}
          iconColor="text-blue-600"
          bgColor="bg-blue-50 dark:bg-blue-950"
        />
        <StatsCard
          title="Active Today"
          value={stats.activeToday.toLocaleString()}
          change={stats.attendanceTrend}
          icon={UserCheck}
          iconColor="text-green-600"
          bgColor="bg-green-50 dark:bg-green-950"
        />
        <StatsCard
          title="On Leave"
          value={stats.onLeave}
          change={stats.leaveTrend}
          icon={UserX}
          iconColor="text-orange-600"
          bgColor="bg-orange-50 dark:bg-orange-950"
        />
        <StatsCard
          title="Late Arrivals"
          value={stats.late}
          change={stats.lateTrend}
          icon={Clock}
          iconColor="text-red-600"
          bgColor="bg-red-50 dark:bg-red-950"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Attendance Trend - Interactive */}
        <AttendanceTrendChart />

        {/* Department Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {dept.employees}
                    </span>
                  </div>
                  <Progress
                    value={(dept.employees / stats.totalEmployees) * 100}
                    className="h-2"
                    style={{
                      "--progress-background": dept.color,
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                {pendingApprovals.length} items need your attention
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{item.employee}</p>
                      {item.urgent && (
                        <Badge variant="destructive" className="h-5 text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.type} • {item.details}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.employee}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "pending"
                        ? "secondary"
                        : activity.status === "success"
                        ? "default"
                        : "outline"
                    }
                    className="h-6 text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Upcoming Events */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Employee
            </Button>
            <Button variant="outline" className="justify-start" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
            <Button variant="outline" className="justify-start" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate Payroll
            </Button>
            <Button variant="outline" className="justify-start" size="sm">
              <Award className="mr-2 h-4 w-4" />
              Start Review Cycle
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.attendees}</p>
                      <p className="text-xs text-muted-foreground">attendees</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Event</DropdownMenuItem>
                        <DropdownMenuItem>Cancel Event</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
 | Stats Card Component
 |========================================================= */
function StatsCard({ title, value, change, icon: Icon, iconColor, bgColor }) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${bgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          {isPositive && (
            <>
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">+{change}%</span>
            </>
          )}
          {isNegative && (
            <>
              <ArrowDownRight className="h-3 w-3 text-red-600" />
              <span className="text-red-600 font-medium">{change}%</span>
            </>
          )}
          {!isPositive && !isNegative && (
            <span className="font-medium">No change</span>
          )}
          <span>from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}