"use client";
import { AnswerType, QuestionType } from "@/types/QuestionInterface";
import { SUPABASE_RESPONSE_TABLE } from "@/utils/constants";
import supabase from "@/utils/createSupabaseClient";
import { createContext, Dispatch, Reducer, useEffect, useReducer } from "react";

interface DispatchObj {
	type: "add response" | "prev" | "next" | "submit" | "notify submission";
	payload?: AnswerType;
}

export interface FormStateInterface {
	questions: QuestionType;
	responses: AnswerType;
	previewing: boolean;
	questionOnShow: number;
	submit: boolean;
	submitted: boolean;
}

const initialState: FormStateInterface = {
	questions: {},
	responses: {},
	previewing: true,
	questionOnShow: 0,
	submit: false,
	submitted: false,
};

export const FormContext = createContext<{
	formState: FormStateInterface;
	dispatch: Dispatch<DispatchObj>;
}>({
	formState: initialState,
	dispatch: () => {},
});

const reducer: Reducer<FormStateInterface, DispatchObj> = (state, action) => {
	switch (action.type) {
		case "add response": {
			return {
				...state,
				responses: {
					...state.responses,
					...(action.payload as FormStateInterface["responses"]),
				},
			};
		}
		case "submit": {
			return {
				...state,
				submit: true,
			};
		}
		case "notify submission": {
			return {
				...state,
				submit: false,
				submitted: true,
			};
		}
		case "prev": {
			const currentQuestionOnShow = state.questions[state.questionOnShow];
			return {
				...state,
				questionOnShow:
					currentQuestionOnShow?.prev ||
					(state.questionOnShow - 1 > 0
						? state.questionOnShow - 1
						: 0),
			};
		}

		case "next": {
			//we need to run the nextLogic of the current question to decide where to go next
			const question = state.questions[state.questionOnShow];
			const currQuestionId = state.questionOnShow;
			const currentResponses = {
				...state.responses,
				...(action.payload as AnswerType),
			};

			let nextQuestionId: number =
				state.questionOnShow + 1 < Object.keys(state.questions).length
					? state.questionOnShow + 1
					: state.questionOnShow;

			let nextQuestion = state.questions[nextQuestionId];

			const newState = {
				...state,
				questions: {
					...state.questions,
					[nextQuestionId]: { ...nextQuestion },
				},
				responses: currentResponses,
				questionOnShow: nextQuestionId,
			};
			if (question?.nextLogic === undefined) {
				return newState;
			}
			let {
				leftOperand,
				operator,
				rightOperand,
				destination,
				alwaysGoTo,
			} = question.nextLogic;
			if (alwaysGoTo) {
				return {
					...state,
					questions: {
						...state.questions,
						[alwaysGoTo]: {
							...state.questions[alwaysGoTo],
							prev: currQuestionId,
						},
					},
					responses: currentResponses,
					questionOnShow: alwaysGoTo,
				};
			}
			//we need to delete the response of the next question in case user has filled that in and is
			// coming back and changing the response to this question
			delete currentResponses[destination];

			const currentQuestionResponse =
				currentResponses[currQuestionId] ||
				state.responses[currQuestionId];

			let leftOperandContent =
				leftOperand === currQuestionId
					? currentQuestionResponse
					: state.responses[leftOperand] || "";
			let evalString = "";
			if (operator !== "contains") {
				evalString = `"${leftOperandContent}" ${operator} "${rightOperand}"`;
			} else {
				evalString = `"${leftOperandContent}".includes("${rightOperand}")`;
			}
			if (eval(evalString)) {
				return {
					...state,
					questions: {
						...state.questions,
						[destination]: {
							...state.questions[destination],
							prev: currQuestionId,
						},
					},
					responses: currentResponses,
					questionOnShow: destination,
				};
			} else {
				return newState;
			}
		}
	}
};

export default function FormContextProvider({
	children,
	formId,
	questions,
}: {
	children: React.ReactNode;
	formId: number;
	questions: QuestionType;
}) {
	const [formState, dispatch] = useReducer<typeof reducer>(reducer, {
		...initialState,
		questions,
	});

	useEffect(() => {
		if (formState.submit) {
			supabase
				.from(SUPABASE_RESPONSE_TABLE)
				.insert({
					form: formId,
					response_data: formState.responses,
				})
				.then(() => dispatch({ type: "notify submission" }));
		}
	}, [formState.submit]);

	return (
		<FormContext.Provider value={{ formState, dispatch }}>
			{children}
		</FormContext.Provider>
	);
}
