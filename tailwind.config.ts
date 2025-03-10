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
    },
  },
  plugins: [],
} satisfies Config;
