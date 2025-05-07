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

const duration = 3000;
const animation = 500;

export const ToastProvider = ({ children }: ToastProvider) => {
  const [toastList, setToastList] = useState<ToastItem[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    const newToast = { id, type, message, shown: true };
    setToastList((prevList) => [...prevList, newToast]);

    setTimeout(() => {
      setToastList((prevList) =>
        prevList.map((toast) =>
          toast.id === id ? { ...toast, shown: false } : toast
        )
      );
    }, duration - animation);
    setTimeout(() => {
      setToastList((prevList) => prevList.filter((toast) => toast.id !== id));
    }, duration);
  };

  const hideToast = (id: string) => {
    setToastList((prevList) => prevList.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toastList, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
