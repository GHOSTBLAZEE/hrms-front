"use client";

import { CompanyFeatureProvider } from "@/hooks/useCompanyFeature";
import { FeatureFlagsProvider } from "@/hooks/useFeatureFlags";
import { initializeEcho } from "@/lib/echo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    try {
      initializeEcho();
    } catch (error) {
      console.error("Echo initialization failed:", error);
    }
  }, []);

  return (
    // QueryClientProvider MUST be outermost so every hook below can use useQuery
    <QueryClientProvider client={queryClient}>
      <FeatureFlagsProvider>
        <CompanyFeatureProvider>
          {children}
        </CompanyFeatureProvider>
      </FeatureFlagsProvider>
    </QueryClientProvider>
  );
}