import { ReactStateWrap } from "@/types/ReactWrap";
import codes from "country-calling-code";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";

export default function CountrySelect({
	countryCode,
	setCountryCode,
}: {
	countryCode: string;
	setCountryCode: ReactStateWrap<string>;
}) {
	const [codeArray, setCodesArray] = useState(codes);
	const [countrySearch, setCountrySearch] = useState("");
	const [selectedCountry, setSelectedCountry] = useState<
		typeof codes[number]
	>(codes.find((v) => v.countryCodes[0] === (countryCode || "91"))!);
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (countrySearch) {
			setCodesArray(
				codeArray.filter((code) =>
					code.country
						.toLowerCase()
						.includes(countrySearch.toLowerCase())
				)
			);
			return;
		}
		setCodesArray(codes);
	}, [countrySearch]);

	return (
		<div className="relative">
			<button
				className="flex items-center gap-2 border-b-[1px] border-white py-2"
				onClick={() => setShow((prev) => !prev)}
			>
				<div className="relative w-10 overflow-clip aspect-[3/2] border-[1px] border-white rounded-md">
					<Image
						src={`https://flagcdn.com/w40/${selectedCountry.isoCode2.toLowerCase()}.png`}
						alt={selectedCountry.country}
						key={selectedCountry.country}
						fill
						style={{
							objectFit: "contain",
						}}
					/>
				</div>
				<AiFillCaretDown size={20} />
			</button>
			{show && (
				<div
					className={`h-72 overflow-hidden absolute border-white rounded-md border-[1px]`}
				>
					<input
						type="text"
						name=""
						id=""
						placeholder="Search countries"
						className="bg-black outline-none text-3xl p-3 pb-4
                placeholder:text-white/30
                "
						value={countrySearch}
						onChange={(e) => setCountrySearch(e.target.value)}
					/>
					<div className="flex flex-col gap-1 px-2 overflow-y-auto h-full bg-black">
						{codeArray.map((code) => {
							return (
								<div
									className="flex items-center text-xl bg-options gap-2 border-white
									border-[1px] rounded-md px-2 py-1
									hover:bg-hoverOptions"
									onClick={() => {
										setSelectedCountry(code);
										setCountryCode(code.countryCodes[0]);
										setShow(false);
										setCountrySearch("");
									}}
									key={code.isoCode2}
								>
									<div className="relative w-10 overflow-clip aspect-[3/2] rounded-md border-[1px] border-white">
										<Image
											src={`https://flagcdn.com/w40/${code.isoCode2.toLowerCase()}.png`}
											alt={code.country}
											fill
											style={{
												objectFit: "contain",
											}}
											loading="lazy"
										/>
									</div>
									<span className="basis-full">
										{code.country}
									</span>
									<span className="whitespace-nowrap">
										+{code.countryCodes}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
