"use client";

import FormModal from "@/components/FormModal";
import getOrderedEntries from "@/utils/getOrderedKeys";
import { useContext } from "react";
import FormStateViewer from "./components/FormStateViewer";
import Question from "./components/Question";
import QuestionEditor from "./components/QuestionEditor";
import QuestionToggler from "../../components/QuestionToggler";
import { FormContext } from "./FormContext";

function Builder() {
	const { formState, dispatch } = useContext(FormContext);

	return (
		<>
			<FormModal key={formState.previewing ? "previewing" : "editing"} />
			<div className="basis-2/12  h-full flex flex-col justify-between">
				<FormStateViewer />
			</div>
			<div className="flex items-center relative bg-gray-600  h-full basis-8/12  border-[1px] border-black">
				<div className="mx-4 overflow-hidden basis-full aspect-video bg-black rounded-md">
					{getOrderedEntries(formState.questions).map(
						([id, questionData]) => {
							return (
								<Question
									key={id}
									id={id}
									question={questionData}
								/>
							);
						}
					)}
				</div>
				<QuestionToggler context={FormContext} />
			</div>
			<div className="basis-2/12 h-full">
				<QuestionEditor key={formState.questionOnShow} />
			</div>
		</>
	);
}

export default Builder;
