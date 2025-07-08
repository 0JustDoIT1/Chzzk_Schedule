import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // 배경색 (bg)
    "bg-yellow-600",
    "bg-purple-600",
    "bg-teal-600",
    "bg-pink-600",
    "bg-green-500",
    "bg-green-400",

    // 테두리색 (border)
    "border-yellow-600",
    "border-purple-600",
    "border-teal-600",
    "border-pink-600",
    "border-green-500",
    "border-green-400",

    // hover 배경색 (hover:bg)
    "hover:bg-yellow-100",
    "hover:bg-purple-100",
    "hover:bg-teal-100",
    "hover:bg-pink-100",
    "hover:bg-green-100",

    // 텍스트색 (text)
    "text-white",

    // 동적 클래스 (grid 사용시 필수)
    { pattern: /col-start-\d+/ },
    { pattern: /col-span-\d+/ },
    { pattern: /row-start-\d+/ },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        textHover: "#f9fafb",
        textBlur: "#f3f4f6",
        textSuperLight: "#e5e7eb",
        textLight: "#d1d5dc",
        textIcon: "#99a1af",
        textNormal: "#6a7282",
        textMain: "#1e2939",
        brandSuperLight: "#b9f8cf",
        brandLight: "#7bf1a8",
        brandMain: "#00c951",
        brandMainHover: "#00a63e",
        brandDark: "#008236",
        success: "#22bb33",
        error: "#FF2424",
        info: "#5bc0de",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
