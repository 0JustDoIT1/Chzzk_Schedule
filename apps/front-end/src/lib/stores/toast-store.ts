import { IToastItem, TToastType } from "@/lib/types/toastType";
import { createStore } from "zustand";

export interface IToastState {
  toastList: IToastItem[];
}

export interface IToastActions {
  showToast: (type: TToastType, message: string) => void;
  hideToast: (id: string) => void;
}

export type TToastStore = IToastState & IToastActions;

export const defaultInitState: IToastState = {
  toastList: [],
};

const duration = 3000;
const animation = 500;

export const createToastStore = (initState: IToastState = defaultInitState) => {
  return createStore<TToastStore>()((set) => ({
    ...initState,
    showToast: (type: TToastType, message: string) => {
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
