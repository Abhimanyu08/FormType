"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "./FormContext";
import Question from "./components/Question";
import QuestionSelector from "./components/QuestionSelector";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

function Builder() {
	const { formState, dispatch } = useContext(FormContext);

	return (
		<>
			<div className="relative overflow-hidden w-[1000px] aspect-[16/9] border-[1px] border-white">
				{formState.questions.map((q, i) => {
					return <Question key={q.id} question={q} />;
				})}
				<div className="flex absolute bottom-2 right-10 divide-x-[1px] divide-black">
					<button
						onClick={() =>
							dispatch({
								type: "show question",
								payload: formState.questionOnShow - 1,
							})
						}
						className="bg-blue-500 text-white p-2 rounded-l-md"
					>
						<AiFillCaretUp />
					</button>
					<button
						onClick={() =>
							dispatch({
								type: "show question",
								payload: formState.questionOnShow + 1,
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
