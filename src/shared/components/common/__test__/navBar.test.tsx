import "@testing-library/jest-dom";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "../Navbar";

afterEach(cleanup);

describe("Navbar", () => {
	test("renders correctly", () => {
		render(<Navbar />);

		expect(screen.getByRole("button", { name: /Profile/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /My Library/i })).toBeInTheDocument();

		expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
	});

	test("Sheet trigger open when click", () => {
		render(<Navbar />);

		const sheetTrigger = screen.getByTestId("sheet-trigger");
		fireEvent.click(sheetTrigger);

		expect(screen.getByText("NEU Library")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Notifications/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Citation Insights/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Some Options/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Settings/i })).toBeInTheDocument();
	});
});
