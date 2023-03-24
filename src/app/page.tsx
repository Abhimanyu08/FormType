import Link from "next/link";

export default function Home() {
	return (
		<main className="h-screen w-screen flex items-center justify-center">
			<Link
				href={"/builder/123"}
				className="rounded-md border-[1px] border-black p-2"
			>
				Build Form
			</Link>
		</main>
	);
}
