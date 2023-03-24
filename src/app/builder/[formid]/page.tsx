"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "./FormContext";
import Question from "./components/Question";
import QuestionSelector from "./components/QuestionSelector";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

function Builder() {
	const [showId, setShowId] = useState(1);
	const { formState, dispatch } = useContext(FormContext);
	useEffect(() => {
		setShowId(formState.questions.length);
	}, [formState.questions]);
	return (
		<>
			<div className="relative overflow-hidden w-[1000px] aspect-[16/9] border-[1px] border-white">
				{formState.questions.map((q, i) => {
					return <Question key={q.id} question={q} showId={showId} />;
				})}
				<div className="flex absolute bottom-2 right-10 divide-x-[1px] divide-black">
					<button
						onClick={() =>
							setShowId((prev) => {
								if (prev !== 1) return prev - 1;
								return prev;
							})
						}
						className="bg-blue-500 text-white p-2 rounded-l-md"
					>
						<AiFillCaretUp />
					</button>
					<button
						onClick={() =>
							setShowId((prev) => {
								if (prev !== formState.questions.length)
									return prev + 1;
								return prev;
							})
						}
						className="bg-blue-500 text-white p-2 rounded-r-md"
					>
						<AiFillCaretDown />
					</button>
				</div>
			</div>
			<div className="flex gap-4">
				<QuestionSelector />
				<button onClick={() => dispatch({ type: "toggle preview" })}>
					{formState.previewing ? "Edit" : "Preview"}
				</button>
			</div>
		</>
	);
}

export default Builder;
