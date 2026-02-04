"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Edit, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import EditStatutoryDialog from "../components/EditStatutoryDialog";

export default function StatutoryTab({ employee, employeeId, onUpdate }) {
  const [editOpen, setEditOpen] = useState(false);

  const statutory = employee.statutory;

  const InfoRow = ({ label, value, verified }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-base font-medium text-slate-900">
          {value || (
            <span className="text-muted-foreground italic">Not provided</span>
          )}
        </p>
      </div>
      {verified !== undefined && (
        <div>
          {verified ? (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              <AlertCircle className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Statutory Compliance Details
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              PF, ESI, and other statutory information
            </p>
          </div>
          {employee.can?.update && (
            <Button
              onClick={() => setEditOpen(true)}
              variant="outline"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          )}
        </div>

        {!statutory ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Statutory Details
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Statutory compliance information has not been added yet
            </p>
            {employee.can?.update && (
              <Button
                onClick={() => setEditOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Add Statutory Details
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* PF Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-semibold text-base">Provident Fund (PF)</h4>
                {statutory.pf_applicable ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Applicable
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Applicable
                  </Badge>
                )}
              </div>

              {statutory.pf_applicable && (
                <div className="space-y-1">
                  <InfoRow
                    label="Universal Account Number (UAN)"
                    value={statutory.uan}
                    verified={statutory.uan_verified}
                  />
                  <InfoRow
                    label="PF Account Number"
                    value={statutory.pf_number}
                  />
                  <InfoRow
                    label="Restrict PF Contribution Wages"
                    value={
                      statutory.restrict_pf_wages
                        ? "Yes - Capped at ₹15,000"
                        : "No - Full Basic + DA"
                    }
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* ESI Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-semibold text-base">
                  Employee State Insurance (ESI)
                </h4>
                {statutory.esi_applicable ? (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Applicable
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Applicable
                  </Badge>
                )}
              </div>

              {statutory.esi_applicable && (
                <div className="space-y-1">
                  <InfoRow
                    label="ESI Number"
                    value={statutory.esi_number}
                    verified={statutory.esi_verified}
                  />
                  <InfoRow
                    label="ESI Dispensary"
                    value={statutory.esi_dispensary}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Additional Statutory */}
            <div>
              <h4 className="font-semibold text-base mb-4">
                Additional Information
              </h4>
              <div className="space-y-1">
                <InfoRow label="PAN Number" value={statutory.pan_number} />
                <InfoRow label="Aadhar Number" value={statutory.aadhar_number} />
                <InfoRow
                  label="Bank Account Number"
                  value={statutory.bank_account_number}
                />
                <InfoRow label="IFSC Code" value={statutory.ifsc_code} />
              </div>
            </div>

            {/* Compliance Status */}
            <Card className="p-4 bg-slate-50 border-slate-200">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Compliance Status
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">UAN</p>
                  {statutory.uan ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">ESI</p>
                  {statutory.esi_number ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">PAN</p>
                  {statutory.pan_number ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-400 mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Bank</p>
                  {statutory.bank_account_number ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-400 mx-auto" />
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>

      <EditStatutoryDialog
        employeeId={employeeId}
        statutory={statutory}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}