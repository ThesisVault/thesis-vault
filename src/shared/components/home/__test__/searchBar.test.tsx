import "@testing-library/jest-dom";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../SearchBar";

afterEach(cleanup);

describe("SearchBar", () => {
	test("renders correctly", () => {
		render(<SearchBar />);

		expect(screen.getByText("Welcome to Library")).toBeInTheDocument();

		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	test("accepts user input", () => {
		render(<SearchBar />);

		const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
		const button = screen.getByRole("button");

		fireEvent.change(input, { target: { value: "Thesis" } });
		expect(input.value).toBe("Thesis");
	});
});
