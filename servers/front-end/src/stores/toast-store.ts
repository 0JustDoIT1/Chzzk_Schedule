import { IToastItem, ToastType } from "@/types/toastType";
import { createStore } from "zustand";

export interface ToastState {
  toastList: IToastItem[];
}

export interface ToastActions {
  showToast: (type: ToastType, message: string) => void;
  hideToast: (id: string) => void;
}

export type ToastStore = ToastState & ToastActions;

export const defaultInitState: ToastState = {
  toastList: [],
};

const duration = 3000;
const animation = 500;

export const createToastStore = (initState: ToastState = defaultInitState) => {
  return createStore<ToastStore>()((set) => ({
    ...initState,
    showToast: (type: ToastType, message: string) => {
      const id = Date.now().toString();
      const newToast = { id, type, message, shown: true };

      set((state) => ({
        toastList: [...state.toastList, newToast],
      }));

      setTimeout(() => {
        set((state) => ({
          toastList: state.toastList.map((toast) =>
            toast.id === id ? { ...toast, shown: false } : toast
          ),
        }));
      }, duration - animation);

      setTimeout(() => {
        set((state) => ({
          toastList: state.toastList.filter((toast) => toast.id !== id),
        }));
      }, duration);
    },
    hideToast: (id: string) =>
      set((state) => ({
        toastList: state.toastList.filter((toast) => toast.id !== id),
      })),
  }));
};
