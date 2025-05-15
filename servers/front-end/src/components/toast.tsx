"use client";

import React from "react";
import CheckCircleIcon from "~/public/assets/svg/check-circle";
import CloseIcon from "~/public/assets/svg/close";
import ErrorCircleIcon from "~/public/assets/svg/error-circle";
import InfoCircleIcon from "~/public/assets/svg/info-circle";
import WarningCircleIcon from "~/public/assets/svg/warning-circle";
import Portal from "./portal";
import { useToastStore } from "@/providers/toast-provider";
import { ToastItemProps } from "@/types/toastType";

const ToastItem = ({ id, type, message, shown, onClose }: ToastItemProps) => {
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
      } ${shown ? "animate-fadeIn" : "animate-fadeOut"}`}
    >
      <div className="flex items-center">
        <ToastIcon />
        <p className="text-sm font-normal">{message}</p>
      </div>
      <button
        type="button"
        className="ml-4 text-textNormal rounded-lg inline-flex items-center justify-center"
        onClick={() => onClose(id)}
      >
        <CloseIcon className="w-4 h-4 mb-1" />
      </button>
    </div>
  );
};

const ToastList = () => {
  const { toastList, hideToast } = useToastStore((state) => state);

  if (toastList.length === 0) return null;

  return (
    <Portal>
      <div className="fixed top-4 right-4 z-[99] flex flex-col gap-1 overflow-hidden md:top-8 md:right-8">
        {toastList.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            shown={toast.shown}
            onClose={hideToast}
          />
        ))}
      </div>
    </Portal>
  );
};

export default ToastList;
