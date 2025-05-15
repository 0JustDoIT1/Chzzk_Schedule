"use client";

import ToastList from "@/components/toast";
import { createToastStore, ToastStore } from "@/stores/toast-store";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ToastStoreApi = ReturnType<typeof createToastStore>;

export const ToastStoreContext = createContext<ToastStoreApi | undefined>(
  undefined
);

export interface ToastStoreProviderProps {
  children: ReactNode;
}

export const ToastStoreProvider = ({ children }: ToastStoreProviderProps) => {
  const storeRef = useRef<ToastStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createToastStore();
  }

  return (
    <ToastStoreContext.Provider value={storeRef.current}>
      {children}
      <ToastList />
    </ToastStoreContext.Provider>
  );
};

export const useToastStore = <T,>(selector: (store: ToastStore) => T): T => {
  const toastStoreContext = useContext(ToastStoreContext);

  if (!toastStoreContext) {
    throw new Error("useToastStore must be used within ToastStoreProvider");
  }

  return useStore(toastStoreContext, selector);
};
