import { createStore } from "zustand";

export interface AsPathState {
  previousAsPath: string | null;
  currentAsPath: string | null;
}

export interface AsPathActions {
  setAsPathData: (path: string) => void;
}

export type AsPathStore = AsPathState & AsPathActions;

export const defaultInitState: AsPathState = {
  previousAsPath: null,
  currentAsPath: null,
};

export const createAsPathStore = (
  initState: AsPathState = defaultInitState
) => {
  return createStore<AsPathStore>()((set) => ({
    ...initState,
    setAsPathData: (path: string) =>
      set((state) => ({
        previousAsPath: state.currentAsPath,
        currentAsPath: path,
      })),
  }));
};
