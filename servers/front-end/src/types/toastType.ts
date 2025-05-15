export type ToastType = "success" | "info" | "warning" | "error" | "default";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  shown: boolean;
}
