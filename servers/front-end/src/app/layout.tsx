import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { ReactNode } from "react";
import { FloatingButton } from "@/components/floatingButton";
import { ToastStoreProvider } from "@/providers/toast-provider";
import { AsPathStoreProvider } from "@/providers/asPath-provider";

const gmarket = localFont({
  src: [
    {
      path: "../../public/assets/fonts/GmarketSansLight.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "../../public/assets/fonts/GmarketSansMedium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/GmarketSansBold.otf",
      weight: "700",
      style: "bold",
    },
  ],
});

export const metadata: Metadata = {
  title: "0군의 삶",
  description: "Create your Chzzk Schedule",
};

const RootLayout = ({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={gmarket.className}>
        <AsPathStoreProvider>
          <ToastStoreProvider>
            <Header />
            {children}
            {modal}
            <div id="portal" />
            <FloatingButton />
          </ToastStoreProvider>
        </AsPathStoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
