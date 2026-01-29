"use client";

import { initializeEcho } from "@/lib/echo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  // useState ensures the client is created once per session
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    // 🔍 DEBUG: Check environment variables
    console.log('🔍 REVERB CONFIG:', {
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      host: process.env.NEXT_PUBLIC_REVERB_HOST,
      port: process.env.NEXT_PUBLIC_REVERB_PORT,
      scheme: process.env.NEXT_PUBLIC_REVERB_SCHEME,
    });

    // Initialize Echo on client side
    try {
      const echo = initializeEcho();
      console.log('✅ Echo initialized:', echo);
    } catch (error) {
      console.error('❌ Echo initialization failed:', error);
    }

    // Cleanup on unmount
    return () => {
      // if (echo) {
      //   echo.disconnect();
      // }
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
