"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "./FormContext";
import Question from "./components/Question";
import QuestionAdder from "./components/QuestionSelector";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import FormStateViewer from "./components/FormStateViewer";
import QuestionEditor from "./components/QuestionEditor";

function Builder() {
	const { formState, dispatch } = useContext(FormContext);

	return (
		<>
			<FormStateViewer />
			<div className="flex items-center relative bg-gray-600  h-full basis-8/12  border-[1px] border-black">
				<div className="mx-4 overflow-hidden basis-full aspect-video bg-black rounded-md">
					{formState.questions.map((q) => {
						return <Question key={q.id} question={q} />;
					})}
				</div>
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
			<div className="basis-2/12 h-full">
				<QuestionEditor />
			</div>
		</>
	);
}

export default Builder;
