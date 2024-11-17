import type { Config } from "tailwindcss";
import daisyui from 'daisyui';
import {light} from "daisyui/src/theming/themes";

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
        primary: "#e81899",
        "primary-hover": "#f8eef3",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...light,
          primary: "#e81899",
          "primary-hover": "#f8eef3",
          "primary-focus": "mediumblue",
        },
      },
    ],
    darkTheme: "light",
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  plugins: [daisyui],
} satisfies Config;
