import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-yellow-800",
    "text-purple-800",
    "text-teal-800",
    "text-pink-800",
    "text-green-600",
    "text-green-400",
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
