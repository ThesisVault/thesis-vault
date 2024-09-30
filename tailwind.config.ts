import type { Config } from "tailwindcss";
import TailwindAnimate from "tailwindcss-animate";
import TailwindUI from "./plugins/ui";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/shared/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [TailwindAnimate, TailwindUI],
};
export default config;
