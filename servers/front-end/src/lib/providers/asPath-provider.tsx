"use client";

import { TAsPathStore, createAsPathStore } from "@/lib/stores/asPath-store";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { useStore } from "zustand";

export type TAsPathStoreApi = ReturnType<typeof createAsPathStore>;

export const AsPathStoreContext = createContext<TAsPathStoreApi | undefined>(
  undefined
);

export const AsPathStoreProvider = ({ children }: PropsWithChildren) => {
  const asPathRef = useRef<TAsPathStoreApi | null>(null);
  if (asPathRef.current === null) {
    asPathRef.current = createAsPathStore();
  }

  return (
    <AsPathStoreContext.Provider value={asPathRef.current}>
      {children}
    </AsPathStoreContext.Provider>
  );
};

export const useAsPathStore = <T,>(selector: (store: TAsPathStore) => T): T => {
  const asPathStoreContext = useContext(AsPathStoreContext);

  if (!asPathStoreContext) {
    throw new Error("useAsPathStore must be used within AsPathStoreProvider");
  }

  return useStore(asPathStoreContext, selector);
};
