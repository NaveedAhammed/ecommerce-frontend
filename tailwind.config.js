/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "hsl(0 0% 100%)",
				foreground: "hsl(222.2 84% 4.9%)",
				primary: "hsl(222.2 47.4% 11.2%)",
				primaryForeground: "hsl(210 40% 98%)",
				secondary: "hsl(210 40% 96.1%)",
				secondaryForeground: "hsl(222.2 47.4% 11.2%)",
				muted: "hsl(210 40% 96.1%)",
				mutedForeground: "hsl(215.4 16.3% 46.9%)",
				destructive: "hsl(0 84.2% 60.2%)",
				destructiveForeground: "hsl(210 40% 98%)",
				accent: "hsl(210 40% 96.1%)",
				accentForeground: "hsl(222.2 47.4% 11.2%)",
				ring: "hsl(215 20.2% 65.1%)",
				success: "hsl(120, 100%, 50%)",
				successForground: "#009A00",
			},
		},
		fontFamily: {
			sans: ['"Inter var", sans-serif'],
		},
	},
	plugins: [],
};
