"use client";

import { createContext, useContext } from "react";

/**
 * Whether the visitor is signed in, read from the server session in the shop layout.
 *
 * Client components need this to decide whether an action is worth a round-trip — the wishlist
 * persists to Supabase for signed-in users and to localStorage for everyone else.
 */
const SessionContext = createContext<{ authenticated: boolean }>({
  authenticated: false,
});

export function useSession() {
  return useContext(SessionContext);
}

export default function SessionProvider({
  authenticated,
  children,
}: {
  authenticated: boolean;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ authenticated }}>
      {children}
    </SessionContext.Provider>
  );
}
