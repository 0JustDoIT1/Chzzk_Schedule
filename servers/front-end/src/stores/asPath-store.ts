import { createStore } from "zustand";

export interface IAsPathState {
  previousAsPath: string | null;
  currentAsPath: string | null;
}

export interface IAsPathActions {
  setAsPathData: (path: string) => void;
}

export type AsPathStore = IAsPathState & IAsPathActions;

export const defaultInitState: IAsPathState = {
  previousAsPath: null,
  currentAsPath: null,
};

export const createAsPathStore = (
  initState: IAsPathState = defaultInitState
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
