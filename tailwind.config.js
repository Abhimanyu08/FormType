/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-questrial)"],
			},
			colors: {
				brand: "rgb(0 119 255)",
				error: "rgb(247 230 230)",
				textError: "rgb(175 4 4)",
				options: "rgb(26 26 26)",
				hoverOptions: "rgb(77 77 77)",
			},
		},
	},
	plugins: [],
};
