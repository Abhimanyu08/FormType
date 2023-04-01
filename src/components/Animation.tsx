import React from "react";
import Image from "next/image";
import logo from "../../public/Dark backround full logo.png";

export default function Animation() {
	return (
		<div className="w-full h-screen flex flex-col justify-center items-center">
			<Image src={logo} alt="logo" width={140} />
			<div className="w-40 h-1 bg-white/20 mt-4 rounded-md overflow-hidden">
				<div className="bg-white w-1/2 h-full rounded-md loading relative"></div>
			</div>
		</div>
	);
}
