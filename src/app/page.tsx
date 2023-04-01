import ViewForm from "@/components/ViewForm";
import Link from "next/link";
export default function Home() {
	return (
		<main className="h-screen w-screen flex items-center justify-center gap-4">
			<Link
				href={"/builder"}
				className="bg-brand hover:bg-blue-500 text-white w-fit px-5 py-[6px] rounded-sm
					leading-6
					font-bold
"
			>
				Build Form
			</Link>
			<span>Or</span>
			<ViewForm />
		</main>
	);
}
