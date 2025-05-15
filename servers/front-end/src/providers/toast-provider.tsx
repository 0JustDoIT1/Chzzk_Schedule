"use client";

import ToastList from "@/components/toast";
import { createToastStore, ToastStore } from "@/stores/toast-store";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ToastStoreApi = ReturnType<typeof createToastStore>;

export const ToastStoreContext = createContext<ToastStoreApi | undefined>(
  undefined
);

export interface IToastStoreProvider {
  children: ReactNode;
}

export const ToastStoreProvider = ({ children }: IToastStoreProvider) => {
  const toastRef = useRef<ToastStoreApi | null>(null);
  if (toastRef.current === null) {
    toastRef.current = createToastStore();
  }

  return (
    <ToastStoreContext.Provider value={toastRef.current}>
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
