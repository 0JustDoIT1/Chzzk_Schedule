"use client";

import React from "react";
import CheckCircleIcon from "~/public/assets/svg/check-circle";
import CloseIcon from "~/public/assets/svg/close";
import ErrorCircleIcon from "~/public/assets/svg/error-circle";
import InfoCircleIcon from "~/public/assets/svg/info-circle";
import WarningCircleIcon from "~/public/assets/svg/warning-circle";
import Portal from "./portal";
import { useToastStore } from "@/lib/providers/toast-provider";
import type { IToastIcon, IToastItem } from "@/lib/types/toastType";
import clsx from "clsx";

const ToastIcon = ({ type }: IToastIcon) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="text-green-600 w-5 h-5 mr-3" />;
    case "info":
      return <InfoCircleIcon className="text-blue-600 w-5 h-5 mr-3" />;
    case "warning":
      return <WarningCircleIcon className="text-yellow-600 w-5 h-5 mr-3" />;
    case "error":
      return <ErrorCircleIcon className="text-red-600 w-5 h-5 mr-3" />;
    default:
      return null;
  }
};

const ToastItem = ({ id, type, message, shown }: IToastItem) => {
  const hideToast = useToastStore((state) => state.hideToast);

  const toastColor: Record<string, string> = {
    success: "bg-green-200 text-green-800",
    info: "bg-blue-200 text-blue-800",
    warning: "bg-orange-200 text-yellow-800",
    error: "bg-red-200 text-red-800",
    default: "bg-textMain",
  };

  const bgColor = toastColor[type] ?? toastColor.default;

  return (
    <div
      className={clsx(
        "flex items-center justify-between w-full min-w-64 max-w-[400px] px-4 py-4 rounded-md shadow-lg",
        bgColor,
        shown ? "animate-fadeIn" : "animate-fadeOut"
      )}
    >
      <div className="flex items-center">
        <ToastIcon type={type} />
        <p className="text-sm font-normal">{message}</p>
      </div>
      <button
        type="button"
        className="ml-4 text-textNormal rounded-lg inline-flex items-center justify-center"
        onClick={() => hideToast(id)}
        aria-label="토스트 메세지 닫기"
      >
        <CloseIcon className="w-4 h-4 mb-1" />
      </button>
    </div>
  );
};

const ToastList = () => {
  const toastList = useToastStore((state) => state.toastList);

  if (toastList?.length) return null;

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
          />
        ))}
      </div>
    </Portal>
  );
};

export default ToastList;
