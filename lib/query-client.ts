import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client per request — never share state across requests.
    return makeQueryClient();
  }
  // Browser: reuse a single client across the whole session.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
