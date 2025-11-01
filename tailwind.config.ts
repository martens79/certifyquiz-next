// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cq: {
          bg: "#ffffff",
          text: "#0f172a",
          mute: "#475569",
          border: "#e5e7eb",
          primary: "#2563eb",
          primaryDark: "#1e40af",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
