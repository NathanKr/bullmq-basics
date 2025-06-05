// app/providers.tsx
"use client"; // This component needs to be a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client instance outside the component to ensure it's not recreated on each render
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
