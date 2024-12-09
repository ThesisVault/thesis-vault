import type { Config } from "tailwindcss";
import TailwindAnimate from "tailwindcss-animate";
import TailwindUI from "./plugins/ui";

const config: Config = {
	darkMode: ["class"],
	content: ["./src/**/*.tsx"],
	plugins: [TailwindAnimate, TailwindUI]
};
export default config;
