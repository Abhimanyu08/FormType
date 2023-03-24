"use client";
import {
	createContext,
	SetStateAction,
	useReducer,
	useState,
	Dispatch,
	Reducer,
} from "react";
import { QuestionType, ResponseType } from "./QuestionInterface";

export interface FormStateInterface {
	questions: QuestionType[];
	responses: ResponseType[];
	previewing: boolean;
	questionOnShow: number;
}

interface DispatchObj {
	type:
		| "add question"
		| "add response"
		| "modify question"
		| "show question"
		| "toggle preview";
	payload?: QuestionType | ResponseType | number;
}

export const FormContext = createContext<{
	formState: FormStateInterface;
	dispatch: Dispatch<DispatchObj>;
}>({
	formState: {
		questions: [],
		responses: [],
		previewing: false,
		questionOnShow: 1,
	},
	dispatch: () => {},
});

const reducer: Reducer<FormStateInterface, DispatchObj> = (state, action) => {
	switch (action.type) {
		case "add question": {
			return {
				...state,
				questions: [
					...state.questions,
					{
						...(action.payload as QuestionType),
						id: state.questions.length + 1,
					},
				],
				questionOnShow: state.questions.length + 1,
			};
		}
		case "add response": {
			return {
				...state,
				responses: [...state.responses, action.payload as ResponseType],
			};
		}
		case "modify question": {
			return {
				...state,
				questions: state.questions.map((q) =>
					q.id === (action.payload as QuestionType).id
						? (action.payload as QuestionType)
						: q
				),
			};
		}
		case "show question": {
			const newQuestionToShow = action.payload as number;
			if (
				newQuestionToShow == 0 ||
				newQuestionToShow === state.questions.length + 1
			)
				return state;
			return {
				...state,
				questionOnShow: action.payload as number,
			};
		}
		case "toggle preview": {
			return {
				...state,
				previewing: !state.previewing,
			};
		}
	}
};

export const FormContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [formState, dispatch] = useReducer<typeof reducer>(reducer, {
		questions: [
			// {
			// 	id: 1,
			// 	type: "text",
			// 	content: "Press / to refer to previous question responses",
			// },
			// {
			// 	id: 2,
			// 	type: "email",
			// 	content: "Press / to refer to previous question responses",
			// },
			// {
			// 	id: 3,
			// 	type: "phone",
			// 	content: "Press / to refer to previous question responses",
			// },
			// {
			// 	id: 4,
			// 	type: "text",
			// 	content: "Press / to refer to previous question responses",
			// },
		],
		responses: [],
		previewing: false,
		questionOnShow: 1,
	});

	return (
		<FormContext.Provider value={{ formState, dispatch }}>
			{children}
		</FormContext.Provider>
	);
};
