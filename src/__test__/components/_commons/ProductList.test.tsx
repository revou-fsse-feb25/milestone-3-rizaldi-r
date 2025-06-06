import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProductList from "@/components/_commons/ProductList";

jest.mock("@/components/_commons/ErrorDisplay", () => {
    return function MockErrorDisplay({ errorMessage }: any) {
        return <div data-testid="mock-error-display">{errorMessage}</div>;
    };
});

jest.mock("@/components/_commons/LoadingDisplay", () => {
    return function MockLoadingDisplay() {
        return <div data-testid="mock-loading-display">Loading...</div>;
    };
});

describe("ProductList", () => {
    // A simple mock ChildrenComponent for testing purposes
    const MockChildrenComponent = ({ productData, onElementClickedActions }: any) => (
        <div data-testid={`product-item-${productData.id}`}>
            Product: {productData.name} (ID: {productData.id})
            {onElementClickedActions && <button onClick={onElementClickedActions}>Action</button>}
        </div>
    );

    const mockProductList = [
        { id: 1, name: "Product A" },
        { id: 2, name: "Product B" },
    ];

    it("renders ChildrenComponent for each product when not loading and no error", () => {
        render(
            <ProductList
                productDataList={mockProductList}
                ChildrenComponent={MockChildrenComponent}
                isLoading={false}
                error={null}
            />
        );

        expect(screen.getByTestId("product-item-1")).toBeInTheDocument();
        expect(screen.getByTestId("product-item-2")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-loading-display")).not.toBeInTheDocument();
        expect(screen.queryByTestId("mock-error-display")).not.toBeInTheDocument();
    });

    it("displays LoadingDisplay when isLoading is true", () => {
        render(
            <ProductList
                productDataList={mockProductList}
                ChildrenComponent={MockChildrenComponent}
                isLoading={true}
                error={null}
            />
        );

        expect(screen.getByTestId("mock-loading-display")).toBeInTheDocument();
        expect(screen.queryByTestId("product-item-1")).not.toBeInTheDocument(); // Products should not be rendered
        expect(screen.queryByTestId("mock-error-display")).not.toBeInTheDocument();
    });

    it("displays ErrorDisplay when an error message is present", () => {
        const errorMessage = "Failed to fetch products.";
        render(
            <ProductList
                productDataList={[]}
                ChildrenComponent={MockChildrenComponent}
                isLoading={false}
                error={errorMessage}
            />
        );

        expect(screen.getByTestId("mock-error-display")).toBeInTheDocument();
        expect(screen.getByTestId("mock-error-display")).toHaveTextContent(errorMessage);
        expect(screen.queryByTestId("mock-loading-display")).not.toBeInTheDocument();
        expect(screen.queryByText("No products available.")).not.toBeInTheDocument();
    });

    it('displays "No products available" when productDataList is empty and no error/loading', () => {
        render(
            <ProductList
                productDataList={[]}
                ChildrenComponent={MockChildrenComponent}
                isLoading={false}
                error={null}
            />
        );

        expect(screen.getByText("No products available.")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-loading-display")).not.toBeInTheDocument();
        expect(screen.queryByTestId("mock-error-display")).not.toBeInTheDocument();
    });

    it('applies "grid" class to the container by default (when isGrid is true or not provided)', () => {
        render(
            <ProductList
                productDataList={mockProductList}
                ChildrenComponent={MockChildrenComponent}
                isLoading={false}
                error={null}
            />
        );

        const containerDiv = screen.getByTestId("product-list-container");
        expect(containerDiv).toHaveClass("grid");
        expect(containerDiv).not.toHaveClass("flex");
    });

    it('applies "flex" class to the container when isGrid is false', () => {
        render(
            <ProductList
                productDataList={mockProductList}
                ChildrenComponent={MockChildrenComponent}
                isLoading={false}
                error={null}
                isGrid={false}
            />
        );

        const containerDiv = screen.getByTestId("product-list-container");
        expect(containerDiv).toHaveClass("flex");
        expect(containerDiv).not.toHaveClass("grid");
    });

    it("passes onEachElementClickedActions to ChildrenComponent", () => {
        const mockAction = jest.fn();
        render(
            <ProductList
                productDataList={[{ id: 1, name: "Clickable Product" }]}
                ChildrenComponent={MockChildrenComponent}
                onEachElementClickedActions={mockAction}
                isLoading={false}
                error={null}
            />
        );

        const productItem = screen.getByTestId("product-item-1");
        const actionButton = screen.getByRole("button", { name: "Action" });

        expect(actionButton).toBeInTheDocument();
    });
});
