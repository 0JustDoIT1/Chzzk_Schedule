"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AsPathContext {
  previousAsPath: string | null;
  currentAsPath: string | null;
}

interface AsPathProvider {
  children: ReactNode;
}

const AsPathContext = createContext<AsPathContext>({
  previousAsPath: null,
  currentAsPath: null,
});

export const AsPathProvider = ({ children }: AsPathProvider) => {
  const pathName = usePathname();
  const [asPathData, setAsPathData] = useState<AsPathContext>({
    previousAsPath: null,
    currentAsPath: null,
  });

  useEffect(() => {
    setAsPathData({
      previousAsPath: asPathData.currentAsPath,
      currentAsPath: pathName,
    });
  }, [pathName]);

  return (
    <AsPathContext.Provider value={asPathData}>
      {children}
    </AsPathContext.Provider>
  );
};

export const useAsPath = () => useContext(AsPathContext);
