import React from "react";
import { FormContextProvider } from "./FormContext";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen w-screen flex flex-col items-center justify-center">
			<FormContextProvider>{children}</FormContextProvider>
		</div>
	);
}

export default layout;
