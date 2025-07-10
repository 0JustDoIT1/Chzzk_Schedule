export type TToastType = "success" | "info" | "warning" | "error" | "default";

export interface IToastItem {
  id: string;
  type: TToastType;
  message: string;
  shown: boolean;
}
