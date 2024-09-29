"use client";

import { useState } from "react";
import { Button } from "../shared/components/ui/button";

export default function Home() {
	const [counter, setCounter] = useState(0);

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div>
				<h1>{counter} Counter</h1>
				<Button onClick={() => setCounter(counter + 1)}>Add</Button>
				<Button onClick={() => setCounter(counter - 1)}>Subtract</Button>
			</div>
		</div>
	);
}
