import "./globals.css";
import { Questrial } from "next/font/google";

const questrial = Questrial({
	variable: "--font-questrial",
	display: "swap",
	weight: "400",
	subsets: ["latin"],
});

export const metadata = {
	title: "FormType",
	description: "A mini typeform clone",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`bg-black text-white
			
				${questrial.variable}
				font-sans
			`}
			>
				{children}
			</body>
		</html>
	);
}
