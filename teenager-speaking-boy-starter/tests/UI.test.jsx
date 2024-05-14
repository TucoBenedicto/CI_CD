import { render, screen } from "@testing-library/react";
import App from "../src/App";
//import { it, expect, describe } from "vitest";
//import '@testing-library/jest-dom/jest-globals'


describe("UI test", () => {
  it("should display the page title", () => {
    // 1. Render App
    render(<App />);

    // 2. Expect that the title is there
    expect(screen.getByRole("heading")).toBeInTheDocument();

    // 3. Expect that the title is : "Teenage Boy Speaking"
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Teenage Boy Speaking"
    );
  });
});
