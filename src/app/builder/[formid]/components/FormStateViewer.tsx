import React, { useContext } from "react";
import { FormContext } from "../FormContext";
import QuestionAdder from "./QuestionSelector";

function FormStateViewer() {
	const { formState, dispatch } = useContext(FormContext);
	return (
		<div className="basis-2/12  h-full flex flex-col justify-between">
			<ul className="flex flex-col  items-start p-2 gap-2 text-sm">
				{formState.questions.map((q) => {
					return (
						<li
							onClick={() => {
								dispatch({
									type: "show question",
									payload: q.id,
								});
							}}
							className="w-full p-2 hover:bg-blue-500"
							key={q.id}
						>
							<span>{q.id}. </span>
							{q.content}
						</li>
					);
				})}
			</ul>
			<div className="m-1 flex gap-1 flex-col">
				<QuestionAdder />

				<button
					className={`  rounded-sm p-2 text-sm text-black text-center w-full ${
						formState.previewing ? "bg-lime-500" : "bg-blue-500"
					}`}
					onClick={() => {
						dispatch({
							type: "toggle preview",
						});
					}}
				>
					{formState.previewing ? "Edit" : "Preview"}
				</button>
			</div>
		</div>
	);
}

export default FormStateViewer;
