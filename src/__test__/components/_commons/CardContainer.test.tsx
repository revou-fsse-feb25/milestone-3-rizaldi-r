import { render, screen } from "@testing-library/react";
import CardContainer from "@/components/_commons/CardContainer";

describe("CardContainer", () => {
    it("renders children correctly", () => {
        const testContent = "child element";
        render(<CardContainer>{testContent}</CardContainer>);

        expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it("applies classNameProp correctly", () => {
        const customClass = "my-custom-class";
        render(<CardContainer classNameProp={customClass}>Child Content</CardContainer>);

        const containerDiv = screen.getByText("Child Content").closest("div");
        expect(containerDiv).toHaveClass("bg-(image:--gradient-card-fill)");
        expect(containerDiv).toHaveClass("rounded-sm");
        expect(containerDiv).toHaveClass("p-2");
        expect(containerDiv).toHaveClass("relative");
        expect(containerDiv).toHaveClass("border");
        expect(containerDiv).toHaveClass("border-[var(--color-border)]");
        expect(containerDiv).toHaveClass(customClass);
    });

    it('does not add an empty string or "undefined" class when classNameProp is not provided', () => {
        render(<CardContainer>Another Child</CardContainer>);
        const containerDiv = screen.getByText("Another Child").closest("div");

        expect(containerDiv).toHaveClass("bg-(image:--gradient-card-fill)");
        expect(containerDiv).toHaveClass("rounded-sm");
        expect(containerDiv).toHaveClass("p-2");
        expect(containerDiv).toHaveClass("relative");
        expect(containerDiv).toHaveClass("border");
        expect(containerDiv).toHaveClass("border-[var(--color-border)]");

        expect(containerDiv?.className).not.toContain("undefined");
        // check for an empty string
        expect(containerDiv?.className).not.toContain(`  `);
    });

    it("handles empty string classNameProp correctly", () => {
        render(<CardContainer classNameProp="">Empty Class Content</CardContainer>);
        const containerDiv = screen.getByText("Empty Class Content").closest("div");
        expect(containerDiv).toHaveClass("bg-(image:--gradient-card-fill)");
        expect(containerDiv?.className).not.toContain("undefined");
        expect(containerDiv?.className).not.toContain("  ");
    });
});
