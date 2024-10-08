import "@testing-library/jest-dom";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "../../common/Navbar";

afterEach(cleanup);

describe("Navbar", () => {
	test("renders correctly", () => {
		render(<Navbar />);

		expect(screen.getByRole("button", { name: /Profile/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /My Library/i })).toBeInTheDocument();

		expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
	});

	test("Sheet trigger open when clicked", () => {
		render(<Navbar />);

		const sheetTrigger = screen.getByTestId("sheet-trigger");
		fireEvent.click(sheetTrigger);

		expect(screen.getByText("NEU Library")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Notifications/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Citation Insights/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Some Options/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Settings/i })).toBeInTheDocument();
	});

	test("Dropdown menu opens when clicked", async () => {
		render(<Navbar />);

		const avatarFallback = screen.getByText(/NY/i);
		expect(avatarFallback).toBeInTheDocument();

		const dropdownTrigger = screen.getByTestId("avatar-trigger");
		fireEvent.click(dropdownTrigger);
	});
});
