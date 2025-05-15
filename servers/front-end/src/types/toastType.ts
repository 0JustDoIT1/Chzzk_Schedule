export type ToastType = "success" | "info" | "warning" | "error" | "default";

export interface IToastItem {
  id: string;
  type: ToastType;
  message: string;
  shown: boolean;
}
