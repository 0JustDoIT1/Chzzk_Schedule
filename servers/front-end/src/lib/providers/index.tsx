import { PropsWithChildren } from "react";
import ReactQueryProviders from "./react-query";
import { AsPathStoreProvider } from "./asPath-provider";
import { ToastStoreProvider } from "./toast-provider";

const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProviders>
      <AsPathStoreProvider>
        <ToastStoreProvider>{children}</ToastStoreProvider>
      </AsPathStoreProvider>
    </ReactQueryProviders>
  );
};

export default RootProvider;
