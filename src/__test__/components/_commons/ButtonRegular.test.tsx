import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonRegular from "@/components/_commons/ButtonRegular";

describe("ButtonRegular", () => {
    test("renders a basic button without children or icon", () => {
        render(<ButtonRegular />);
        const buttonElement = screen.getByRole("button");
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toBeEnabled();
    });

    test("renders button with children text", () => {
        render(<ButtonRegular>Click Me</ButtonRegular>);
        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    test("renders button with an icon", () => {
        const iconLink = "https://placehold.co/24x24/000000/FFFFFF?text=ICON";
        render(<ButtonRegular iconLink={iconLink} iconSize={24} />);
        const imgElement = screen.getByRole("img");
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute("src", iconLink);
        expect(imgElement).toHaveAttribute("width", "24");
    });

    test("renders button with both children and an icon", () => {
        const iconLink = "https://placehold.co/24x24/000000/FFFFFF?text=ICON";
        render(
            <ButtonRegular iconLink={iconLink} iconSize={24}>
                Save
            </ButtonRegular>
        );
        expect(screen.getByText("Save")).toBeInTheDocument();
        expect(screen.getByRole("img")).toBeInTheDocument();
    });

    test("calls onClickProp when button is clicked", () => {
        const handleClick = jest.fn(); // Mock function
        render(<ButtonRegular onClickProp={handleClick}>Test</ButtonRegular>);
        fireEvent.click(screen.getByText("Test"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("renders as disabled when isDisabled is true", () => {
        const handleClick = jest.fn();
        render(
            <ButtonRegular isDisabled={true} onClickProp={handleClick}>
                Disabled Button
            </ButtonRegular>
        );
        const buttonElement = screen.getByText("Disabled Button").closest("button");
        expect(buttonElement).toBeDisabled();
        if (buttonElement) fireEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalled(); // onClickProp should not be called
    });

    test("applies custom font weight", () => {
        render(<ButtonRegular customFontWeight="font-extrabold">Bold Text</ButtonRegular>);
        const spanElement = screen.getByText("Bold Text").closest("span");
        expect(spanElement).toHaveClass("font-extrabold");
    });

    test("applies custom padding", () => {
        render(<ButtonRegular customPadding={{ x: 5, y: 4 }}>Padded Button</ButtonRegular>);
        const buttonElement = screen.getByRole("button", { name: /padded button/i });
        const outerSpanElement = buttonElement.querySelector("span");
        expect(outerSpanElement).toBeInTheDocument(); // Ensure the span exists
        expect(outerSpanElement).toHaveClass("px-5", "py-4");
    });

    // test("applies default padding for children when no custom padding is provided", () => {
    //     render(<ButtonRegular>Default Padded</ButtonRegular>);
    //     const spanElement = screen.getByText("Default Padded").closest("span");
    //     expect(spanElement).toHaveClass("px-3", "py-2");
    // });

    // test("renders as a round button when isRound is true", () => {
    //     render(<ButtonRegular isRound={true}>Round</ButtonRegular>);
    //     const buttonElement = screen.getByText("Round").closest("button");
    //     const spanElement = screen.getByText("Round").closest("span");
    //     expect(buttonElement).toHaveClass("rounded-full");
    //     expect(spanElement).toHaveClass("rounded-full");
    // });

    // test("applies custom class name", () => {
    //     render(<ButtonRegular customClassName="my-custom-class">Custom Class</ButtonRegular>);
    //     const spanElement = screen.getByText("Custom Class").closest("span");
    //     expect(spanElement).toHaveClass("my-custom-class");
    // });

    test("renders with correct button type", () => {
        render(<ButtonRegular type="submit">Submit</ButtonRegular>);
        const buttonElement = screen.getByText("Submit").closest("button");
        expect(buttonElement).toHaveAttribute("type", "submit");
    });
});
