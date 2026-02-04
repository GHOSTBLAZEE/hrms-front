"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamTab({ employee }) {
  const router = useRouter();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const directReports = employee.directReports || [];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-blue-600" />
        Direct Reports
        {directReports.length > 0 && (
          <Badge variant="secondary">{directReports.length}</Badge>
        )}
      </h3>

      {directReports.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            This employee has no direct reports
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directReports.map((report) => (
            <Card
              key={report.id}
              className="p-5 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500"
              onClick={() => router.push(`/dashboard/employees/${report.id}`)}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-blue-100">
                  <AvatarImage src={report.user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {getInitials(report.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base truncate">
                    {report.user?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {report.designation?.name}
                  </p>
                  <div className="mt-3 space-y-1">
                    {report.user?.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{report.user.email}</span>
                      </div>
                    )}
                    {report.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{report.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}