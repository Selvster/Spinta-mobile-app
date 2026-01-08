import { QueryClient } from '@tanstack/react-query';

// Shared QueryClient instance for use in React components and interceptors
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
