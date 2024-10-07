import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "../common/Navbar";
import { Footer } from "../common/Footer";
import { SearchBar } from "../home/SearchBar";

afterEach(cleanup);

describe("Navbar", () => {
  test("renders correctly", () => {
      render(<Navbar />);

  expect(screen.getByRole("button", { name: /Profile/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /My Library/i })).toBeInTheDocument()

      expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
  });

  test("Sheet trigger open when click", () => {
      render(<Navbar />);
      
      const sheetTrigger = screen.getByTestId("sheet-trigger");
      fireEvent.click(sheetTrigger);

      expect(screen.getByText("NEU Library")).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Notifications/i })).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Citation Insights/i })).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Some Options/i})).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Settings/i})).toBeInTheDocument();

  });
});

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

describe("Footer", () => {
test("should render footer and its components", () => {
  render(<Footer />);

		expect(screen.getByRole("button", { name: /EN/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Privacy/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Terms/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Help/i })).toBeInTheDocument();

  });
});

