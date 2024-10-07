import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

afterEach(cleanup);

describe("Footer", () => {
	test("should render footer and its components", () => {
		render(<Footer />);

		expect(screen.getByRole("button", { name: /EN/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Privacy/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Terms/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Help/i })).toBeInTheDocument();
	});
});
