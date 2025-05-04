"use client";

import { useToast } from "@/context/toast";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "~/public/assets/svg/check-circle";
import CloseIcon from "~/public/assets/svg/close";
import ErrorCircleIcon from "~/public/assets/svg/error-circle";
import InfoCircleIcon from "~/public/assets/svg/info-circle";
import WarningCircleIcon from "~/public/assets/svg/warning-circle";

export type ToastType = "success" | "info" | "warning" | "error" | "default";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

const duration = 2000;
const animation = 500;

const ToastItem = ({ id, type, message }: ToastItem) => {
  const [visible, setVisible] = useState<boolean>(true);
  const { hideToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    const hideTimer = setTimeout(() => {
      hideToast(id);
    }, duration + animation);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [id, hideToast]);

  const toastColor = {
    success: "bg-green-200 text-green-800",
    info: "bg-blue-200 text-blue-800",
    warning: "bg-orange-200 text-yellow-800",
    error: "bg-red-200 text-red-800",
    default: "bg-textMain",
  };

  const ToastIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircleIcon className="text-green-600 w-5 h-5 mr-3 mb-[0.5px]" />
        );
      case "info":
        return (
          <InfoCircleIcon className="text-blue-600 w-5 h-5 mr-3 mb-[0.5px]" />
        );
      case "warning":
        return (
          <WarningCircleIcon className="text-yellow-600 w-5 h-5 mr-3 mb-[0.5px]" />
        );
      case "error":
        return (
          <ErrorCircleIcon className="text-red-600 w-5 h-5 mr-3 mb-[0.5px]" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-center justify-between w-full min-w-64 max-w-[360px] px-4 py-4 rounded-md shadow-lg ${
        toastColor[type]
      } ${visible ? "animate-fadeIn" : "animate-fadeOut"}`}
    >
      <div className="flex items-center">
        <ToastIcon />
        <p className="text-sm font-normal">{message}</p>
      </div>
      <button
        type="button"
        className="ml-4 text-textNormal rounded-lg inline-flex items-center justify-center"
        onClick={() => hideToast(id)}
      >
        <CloseIcon className="w-4 h-4 mb-1" />
      </button>
    </div>
  );
};

const ToastList = () => {
  const { toastList } = useToast();

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[99] flex flex-col gap-1 overflow-hidden md:top-8 md:right-8">
      {toastList.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
        />
      ))}
    </div>
  );
};

export default ToastList;
