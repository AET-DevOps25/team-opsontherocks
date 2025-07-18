
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";

const ResultsPage = () => <h1>Progress Report</h1>;

describe("Mock client test", () => {
    test("renders Progress Report heading", () => {
        render(<ResultsPage />);
        expect(screen.getByText(/Progress Report/i)).toBeInTheDocument();
    });
});

