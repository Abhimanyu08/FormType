import { ReactStateWrap } from "@/types/ReactWrap";
import { useContext, useEffect, useState } from "react";
import { FormContext } from "../FormContext";
import getOrderedEntries from "@/utils/getOrderedKeys";
import {
	QuestionType,
	LogicState,
	SelectQuestion,
	ChoiceQuestion,
} from "@/types/QuestionInterface";

function LogicEditor() {
	const { formState, dispatch } = useContext(FormContext);
	const [question, setQuestion] = useState<Partial<QuestionType[number]>>({});
	const [logicState, setLogicState] = useState<Partial<LogicState>>({});
	useEffect(() => {
		const currQuestion = formState.questions[formState.questionOnShow];
		setQuestion(currQuestion);
		setLogicState(currQuestion.nextLogic || {});
	}, [formState.questionOnShow]);

	const onSave = () => {
		dispatch({
			type: "modify question",
			payload: {
				[formState.questionOnShow]: {
					...question,
					nextLogic: logicState as LogicState,
				},
			} as QuestionType,
		});
	};

	return (
		<>
			<p className="leading-loose">
				If response to
				<LeftOperand
					id={formState.questionOnShow}
					{...{ question, logicState, setLogicState }}
				/>
				<Operator {...{ logicState, setLogicState }} />
				<RightOperand {...{ logicState, setLogicState }} />
				then go to
				<Destination
					id={formState.questionOnShow}
					{...{ question, logicState, setLogicState }}
					always={false}
				/>
				<span className=""> Or </span>
				Always go to
				<Destination
					id={formState.questionOnShow}
					{...{ question, logicState, setLogicState }}
					always={true}
				/>
			</p>
			<div className="flex gap-3 w-fit self-end">
				<button
					className="bg-blue-500 text-white w-fit px-2 text-xs py-1 rounded-md "
					onClick={() => setLogicState({})}
				>
					Cancel
				</button>
				<button
					className="bg-blue-500 text-white w-fit px-2 text-xs py-1 rounded-md "
					onClick={onSave}
				>
					Save
				</button>
			</div>
		</>
	);
}

function Destination({
	always,
	id,
	question,
	logicState,
	setLogicState,
}: {
	always: boolean;
	id: number;
	question: Partial<QuestionType[number]>;
	logicState: Partial<LogicState>;
	setLogicState: ReactStateWrap<Partial<LogicState>>;
}) {
	const { formState } = useContext(FormContext);
	return (
		<select
			name=""
			id=""
			onChange={(e) => {
				if (always) {
					setLogicState((prev) => ({
						...prev,
						alwaysGoTo: parseInt(e.target.value),
					}));
					return;
				}
				setLogicState((prev) => ({
					...prev,
					destination: parseInt(e.target.value),
				}));
			}}
			defaultValue={
				always
					? logicState.alwaysGoTo || ""
					: logicState.destination || ""
			}
		>
			<option value="">Select destination</option>
			{getOrderedEntries(formState.questions)
				.slice(id)
				.map(([qid, qdata]) => (
					<option value={qid} key={qid}>
						{qid}. {qdata.content?.slice(0, 10)}...
					</option>
				))}
		</select>
	);
}

function LeftOperand({
	id,
	question,
	logicState,
	setLogicState,
}: {
	id: number;
	question: Partial<QuestionType>;
	logicState: Partial<LogicState>;
	setLogicState: ReactStateWrap<Partial<LogicState>>;
}) {
	const { formState } = useContext(FormContext);

	return (
		<select
			name=""
			id=""
			onChange={(e) =>
				setLogicState((prev) => ({
					...prev,
					leftOperand: parseInt(e.target.value),
				}))
			}
			defaultValue={logicState.leftOperand}
		>
			<option value="">Question No.</option>
			{getOrderedEntries(formState.questions)
				.slice(0, id + 1)
				.map(([qid, qdata]) => (
					<option value={qid} key={qid}>
						{qid}. {qdata.content?.slice(0, 10)}...
					</option>
				))}
		</select>
	);
}

function Operator({
	logicState,
	setLogicState,
}: {
	logicState: Partial<LogicState>;
	setLogicState: ReactStateWrap<Partial<LogicState>>;
}) {
	const [question, setQuestion] = useState<Partial<QuestionType[number]>>();
	const { formState } = useContext(FormContext);
	useEffect(() => {
		if (logicState.leftOperand) {
			setQuestion(formState.questions[logicState.leftOperand]);
		}
	}, [logicState.leftOperand]);

	let options = ["==", "<", "<=", ">", ">=", "contains"];
	switch (question?.type) {
		case "choice": {
			options = ["contains", "=="];
			break;
		}
		case "select": {
			options = ["=="];
			break;
		}
	}

	return (
		<select
			name=""
			id=""
			onChange={(e) =>
				setLogicState((prev) => ({
					...prev,
					operator: e.target.value,
				}))
			}
			defaultValue={logicState.operator || ""}
		>
			<option value="">Operator</option>
			{options.map((o) => (
				<option value={o} key={o}>
					{o}
				</option>
			))}
		</select>
	);
}

function RightOperand({
	logicState,
	setLogicState,
}: {
	logicState: Partial<LogicState>;
	setLogicState: ReactStateWrap<Partial<LogicState>>;
}) {
	const [question, setQuestion] = useState<Partial<QuestionType[number]>>();
	const { formState } = useContext(FormContext);
	useEffect(() => {
		if (logicState.leftOperand) {
			setQuestion(formState.questions[logicState.leftOperand]);
		}
	}, [logicState.leftOperand]);

	switch (question?.type) {
		case "text":
		case "email":
		case "number":
		case "phone": {
			return (
				<input
					type="text"
					name=""
					id=""
					onChange={(e) =>
						setLogicState((prev) => ({
							...prev,
							rightOperand: e.target.value,
						}))
					}
					value={logicState.rightOperand}
				/>
			);
		}
		case "select":
		case "choice":
			return (
				<select
					name=""
					id=""
					onChange={(e) => {
						setLogicState((prev) => ({
							...prev,
							rightOperand: e.target.value,
						}));
					}}
					defaultValue={logicState.rightOperand || ""}
				>
					<option value="">Value</option>
					{(
						question as Partial<
							SelectQuestion[number] | ChoiceQuestion[number]
						>
					).options?.map((v) => (
						<option value={v} key={v}>
							{v}
						</option>
					))}
				</select>
			);
		default:
			return (
				<input
					type="text"
					name=""
					id=""
					className="border-b-[1px] border-white"
				/>
			);
	}
}

export default LogicEditor;
