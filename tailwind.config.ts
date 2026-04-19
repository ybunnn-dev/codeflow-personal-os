import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This strictly matches your structure: app/view/...
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/flowbite-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      colors: {
        light_coffee: "#F9E7B2",
        mocha: "#DDC57A",
        light_brown: "#CE7E5A",
        color_red: "#D34E4E",
        text_semi: "#566A7F",
        text_heavy: "#1C274C",
        text_light: "#697A8D",
        purple_light: "#BB8ED0",
      },
    },
  },
  plugins: [
    
  ],
};

export default config;