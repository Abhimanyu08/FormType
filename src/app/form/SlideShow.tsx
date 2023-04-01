"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "./FormContext";
import getOrderedEntries from "@/utils/getOrderedKeys";
import { QuestionPreview } from "@/components/QuestionPreview";
import QuestionToggler from "@/components/QuestionToggler";
import logo from "../../../public/Dark backround full logo.png";

import Image from "next/image";
import EndScreen from "@/components/EndScreen";
function SlideShow() {
	const { formState, dispatch } = useContext(FormContext);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const responseEl = document.getElementById(
			`response-${formState.questionOnShow}`
		);
		responseEl?.focus({
			preventScroll: true,
		});
	}, [formState.questionOnShow]);

	useEffect(() => {
		setProgress(
			formState.questionOnShow /
				(Object.keys(formState.questions).length - 1)
		);
	}, [formState.responses]);

	return (
		<div
			className="h-screen w-screen overflow-hidden"
			onKeyDown={(e) => {
				if (e.key === "ArrowUp") {
					dispatch({ type: "prev" });
				}
			}}
		>
			<div className="fixed top-0 left-0 w-full h-1 bg-blue-500/30">
				<div
					className="h-full w-full bg-brand absolute -left-full
						transition-transform duration-500
					"
					id="progress-bar"
					style={{
						transform: `translateX(${progress * 100}%)`,
					}}
				></div>
			</div>
			{formState.submitted ? (
				<EndScreen />
			) : (
				getOrderedEntries(formState.questions).map(
					([id, question], _, arr) => {
						return (
							<QuestionPreview
								{...{
									id,
									question,
								}}
								last={id === arr.length - 1}
								context={FormContext}
								questionOnShow={formState.questionOnShow}
								responses={formState.responses}
								key={id}
							/>
						);
					}
				)
			)}

			<Image
				src={logo}
				alt="logo"
				width={100}
				className="absolute top-8 left-10"
			/>
			{!formState.submitted && <QuestionToggler context={FormContext} />}
		</div>
	);
}

export default SlideShow;
