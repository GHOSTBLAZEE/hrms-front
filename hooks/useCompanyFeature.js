"use client";

import { useState, useEffect, useContext, createContext } from "react";

// Company Feature Context (renamed to avoid conflicts)
const CompanyFeatureContext = createContext({
  companyFeature: null,
  isLoading: true,
});

export function CompanyFeatureProvider({ children }) {
  const [companyFeature, setCompanyFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch company/tenant information from your API
    const fetchCompanyFeature = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch("/api/company/current");
        // const data = await response.json();
        
        // Mock company data for now
        const mockCompany = {
          id: 1,
          name: "HRMS",
          tagline: "Enterprise System",
          plan: "enterprise", // free, business, enterprise
          type: "multi-tenant", // single-tenant, multi-tenant
          settings: {
            timezone: "UTC",
            dateFormat: "MM/DD/YYYY",
            currency: "USD",
          },
        };

        setCompanyFeature(mockCompany);
      } catch (error) {
        console.error("Failed to fetch company feature:", error);
        setCompanyFeature(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyFeature();
  }, []);

  return (
    <CompanyFeatureContext.Provider value={{ companyFeature, isLoading, setCompanyFeature }}>
      {children}
    </CompanyFeatureContext.Provider>
  );
}

export function useCompanyFeature() {
  const context = useContext(CompanyFeatureContext);
  if (context === undefined) {
    throw new Error("useCompanyFeature must be used within a CompanyFeatureProvider");
  }
  return context;
}