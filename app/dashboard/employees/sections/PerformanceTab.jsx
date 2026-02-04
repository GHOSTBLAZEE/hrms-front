"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Award, Plus, Star, TrendingUp, Target } from "lucide-react";
// import AddPerformanceDialog from "../components/AddPerformanceDialog";

export default function PerformanceTab({ employee, employeeId, onUpdate }) {
  const [addOpen, setAddOpen] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["employee-performance", employeeId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/employees/${employeeId}/performance`);
      return res.data.data || [];
    },
  });

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-emerald-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-amber-600";
    return "text-red-600";
  };

  const getRatingBadge = (rating) => {
    if (rating >= 4.5) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (rating >= 3.5) return "bg-blue-100 text-blue-700 border-blue-200";
    if (rating >= 2.5) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Performance Overview */}
        {reviews && reviews.length > 0 && (
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Overview
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest performance metrics
                </p>
              </div>
              {employee.can?.update && (
                <Button
                  onClick={() => setAddOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(() => {
                const latestReview = reviews[0];
                const avgRating =
                  reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) /
                  reviews.length;

                return (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Latest Rating
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-4xl font-bold ${getRatingColor(latestReview.overall_rating)}`}>
                          {latestReview.overall_rating?.toFixed(1)}
                        </p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= latestReview.overall_rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Average Rating
                      </p>
                      <p className={`text-4xl font-bold ${getRatingColor(avgRating)}`}>
                        {avgRating.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Based on {reviews.length} review{reviews.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Total Reviews
                      </p>
                      <p className="text-4xl font-bold text-slate-900">{reviews.length}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
        )}

        {/* Performance Reviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Performance Reviews
            </h3>
            {employee.can?.update && !reviews?.length && (
              <Button
                onClick={() => setAddOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            )}
          </div>

          {!reviews || reviews.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Performance Reviews
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                No performance reviews have been recorded yet
              </p>
              {employee.can?.update && (
                <Button
                  onClick={() => setAddOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Review
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{review.review_period}</h4>
                        <Badge className={getRatingBadge(review.overall_rating)}>
                          {review.overall_rating?.toFixed(1)} / 5.0
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reviewed by {review.reviewer?.name} on{" "}
                        {new Date(review.review_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= review.overall_rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  {review.ratings && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {Object.entries(review.ratings).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">
                              {key.replace("_", " ")}
                            </span>
                            <span className="text-sm font-semibold">{value}/5</span>
                          </div>
                          <Progress value={(value / 5) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comments */}
                  {review.comments && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 mb-2">Comments:</p>
                      <p className="text-sm text-slate-600">{review.comments}</p>
                    </div>
                  )}

                  {/* Goals */}
                  {review.goals && review.goals.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Goals for Next Period:
                      </p>
                      <ul className="space-y-1">
                        {review.goals.map((goal, index) => (
                          <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* <AddPerformanceDialog
        employeeId={employeeId}
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={onUpdate}
      /> */}
    </>
  );
}