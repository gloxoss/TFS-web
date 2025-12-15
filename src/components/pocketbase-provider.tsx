"use client";

import { createBrowserClient } from "@/lib/pocketbase/client";
import { TypedPocketBase } from "@/lib/pocketbase/types";
import { AuthRecord } from "pocketbase";
import { createContext, useContext, useEffect, useRef } from "react";

const PocketBaseContext = createContext<TypedPocketBase | null>(null);

export function usePocketBase() {
  return useContext(PocketBaseContext)!;
}

export function useUser() {
  const client = usePocketBase();
  return client.authStore.record;
}

export function PocketBaseProvider({
  initialToken,
  initialUser,
  children,
}: {
  initialToken: string;
  initialUser: AuthRecord;
  children?: React.ReactNode;
}) {
  const clientRef = useRef<TypedPocketBase>(createBrowserClient());

  // Hydrate the store with the user model, but NO token (to prevent XSS leakage).
  // The token is safely stored in an HttpOnly cookie and used by Server Actions.
  if (initialToken !== clientRef.current.authStore.token || initialUser?.id !== clientRef.current.authStore.model?.id) {
    clientRef.current.authStore.save('', initialUser);
  }

  // Effect to keep the store in sync if props change (though typically Layout only renders once per navigation)
  useEffect(() => {
    clientRef.current.authStore.save('', initialUser);
  }, [initialUser]);

  return (
    <PocketBaseContext.Provider value={clientRef.current}>
      {children}
    </PocketBaseContext.Provider>
  );
}
