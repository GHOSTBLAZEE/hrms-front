"use client";

import { CompanyFeatureProvider } from "@/hooks/useCompanyFeature";
import { FeatureFlagsProvider } from "@/hooks/useFeatureFlags";
import { initializeEcho } from "@/lib/echo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  // useState ensures the client is created once per session
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    try {
      const echo = initializeEcho();
    } catch (error) {
      console.error('❌ Echo initialization failed:', error);
    }

    // Cleanup on unmoun
    return () => {
      // if (echo) {
      //   echo.disconnect();
      // }
    };
  }, []);
  return (
    <FeatureFlagsProvider>
      <CompanyFeatureProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </CompanyFeatureProvider>
    </FeatureFlagsProvider>
  );
}
