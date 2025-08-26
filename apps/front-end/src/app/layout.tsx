import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/lib/components/layout/header";
import { ReactNode } from "react";
import { FloatingButton } from "@/lib/components/common/floatingButton";
import RootProvider from "@/lib/providers";
import { DEFAULT_META_TAG } from "@/lib/constants/metaTag";

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

export const metadata: Metadata = DEFAULT_META_TAG;

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
        <RootProvider>
          <Header />
          {children}
          {modal}
          <div id="portal" />
          <FloatingButton />
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
