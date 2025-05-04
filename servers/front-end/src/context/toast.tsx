"use client";

import { ToastItem, ToastType } from "@/components/toast";
import { createContext, ReactNode, useContext, useState } from "react";

interface ToastContext {
  toastList: ToastItem[];
  showToast: (type: ToastType, message: string) => void;
  hideToast: (id: string) => void;
}

interface ToastProvider {
  children: ReactNode;
}

const ToastContext = createContext<ToastContext>({
  toastList: [],
  showToast: () => {},
  hideToast: () => {},
});

export const ToastProvider = ({ children }: ToastProvider) => {
  const [toastList, setToastList] = useState<ToastItem[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToastList([...toastList, { id, type, message }]);
  };

  const hideToast = (id: string) => {
    const filterToast = toastList.filter((item) => item.id !== id);
    setToastList(filterToast);
  };

  return (
    <ToastContext.Provider value={{ toastList, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
