import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ErrorDisplay from "@/components/_commons/ErrorDisplay";

describe("ErrorDisplay", () => {
    it("displays the provided error message", () => {
        const testMessage = "Something went wrong!";
        render(<ErrorDisplay errorMessage={testMessage} />);

        expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it("renders with appropriate styling classes", () => {
        const testMessage = "Network error.";
        render(<ErrorDisplay errorMessage={testMessage} />);

        const errorContainer = screen.getByText(testMessage).closest("div");

        expect(errorContainer).toHaveClass("bg-red-500");
        expect(errorContainer).toHaveClass("bg-opacity-80");
        expect(errorContainer).toHaveClass("text-white");
        expect(errorContainer).toHaveClass("p-4");
        expect(errorContainer).toHaveClass("rounded-lg");
        expect(errorContainer).toHaveClass("mb-6");
        expect(errorContainer).toHaveClass("shadow-lg");
        expect(errorContainer).toHaveClass("flex");
        expect(errorContainer).toHaveClass("items-center");
    });

    it("contains an SVG icon for visual indication", () => {
        render(<ErrorDisplay errorMessage="Icon test" />);

        const svgIcon = screen.getByRole("img", { hidden: true });
        expect(svgIcon).toBeInTheDocument();
        expect(svgIcon).toHaveClass("w-6");
        expect(svgIcon).toHaveClass("h-6");
    });
});
