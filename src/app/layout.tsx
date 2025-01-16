import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";

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
  title: "0군의 스케줄",
  description: "Create your Chzzk Schedule",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={gmarket.className}>
        <div>
          <Header />
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
