import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#102a43", civic: "#0f766e" },
      boxShadow: { panel: "0 18px 50px rgba(15,42,67,.10)" },
    },
  },
  plugins: [],
} satisfies Config;
