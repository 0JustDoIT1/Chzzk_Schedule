import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 1s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
