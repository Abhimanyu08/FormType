"use client";
import { Dispatch, Reducer, createContext, useReducer } from "react";
import {
	AnswerType,
	QuestionOptions,
	QuestionType,
} from "../../types/QuestionInterface";
import { FormStateInterface } from "./interfaces/FormStateInterface";

export interface DispatchObj {
	type:
		| "add question"
		| "add response"
		| "prev"
		| "next"
		| "show question"
		| "remove response"
		| "modify question"
		| "delete question"
		| "submit"
		| "toggle preview";
	payload?:
		| QuestionType[number]
		| QuestionType
		| AnswerType
		| number
		| typeof QuestionOptions[number];
}

const initialState: FormStateInterface = {
	questions: {},
	responses: {},
	previewing: false,
	questionOnShow: -1,
	submit: false,
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
		case "add question": {
			const currQuestions = state.questions;
			return {
				...state,
				questions: {
					...currQuestions,
					[Object.keys(currQuestions).length]:
						action.payload as QuestionType[number],
				},
				questionOnShow: Object.keys(currQuestions).length,
			};
		}
		case "submit": {
			return {
				...state,
				submit: true,
			};
		}
		case "delete question": {
			const currQuestions = state.questions;
			const questionToDelete = action.payload as number;

			delete currQuestions[questionToDelete];

			for (
				let k = questionToDelete + 1;
				k < Object.keys(currQuestions).length + 1;
				k++
			) {
				const val = currQuestions[k];
				delete currQuestions[k];
				currQuestions[k - 1] = val;
			}

			return {
				...state,
				questions: currQuestions,
			};
		}
		case "add response": {
			return {
				...state,
				responses: {
					...state.responses,
					...(action.payload as FormStateInterface["responses"]),
				},
			};
		}
		case "modify question": {
			return {
				...state,
				questions: {
					...state.questions,
					...(action.payload as QuestionType),
				},
			};
		}
		case "show question": {
			return {
				...state,
				questionOnShow: action.payload as number,
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
				console.log(newState);
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
					responses: currentResponses,
					questionOnShow: destination,
				};
			} else {
				return newState;
			}
		}

		case "toggle preview": {
			return {
				...state,
				previewing: !state.previewing,
			};
		}
		case "remove response": {
			const previousResponses = state.responses;
			delete previousResponses[action.payload as number];
			return {
				...state,
				responses: previousResponses,
			};
		}
	}
};

export const FormContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [formState, dispatch] = useReducer<typeof reducer>(
		reducer,
		initialState
	);

	return (
		<FormContext.Provider value={{ formState, dispatch }}>
			{children}
		</FormContext.Provider>
	);
};
