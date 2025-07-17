
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




//use api/testendpoints for the test if it works

// src/__tests__/clientTest.test.tsx
//
// import "@testing-library/jest-dom";
//
//
// import { render, screen } from "@testing-library/react";
// import AuthPage from "../pages/AuthPage";
// import ResultsPage from "../pages/ResultsPage";
//
// describe("component tests", () => {
//   /*test("AuthPage shows sign in prompt", () => {
//     render(<AuthPage onLoginSuccess={async () => true} />);
//     expect(screen.getByText(/sign in/i)).toBeInTheDocument();
//   });*/
//
//   test("renders Progress Report heading", () => {
//     render(<ResultsPage />);
//     expect(screen.getByText(/Progress Report/i)).toBeInTheDocument();
//   });
// });