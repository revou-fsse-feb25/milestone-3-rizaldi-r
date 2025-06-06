import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import DashboardPageContent from "@/components/dashboard/DashboardPageContent";

const mockRouterRefresh = jest.fn();

// Mock Next.js router and next-auth signOut
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        refresh: mockRouterRefresh,
    })),
}));
jest.mock("next-auth/react", () => ({
    signOut: jest.fn(),
}));

// Mock child components for isolation
jest.mock("@/components/_commons/ButtonRegular", () => ({
    __esModule: true,
    default: ({ onClickProp, children }: any) => <button onClick={onClickProp}>{children}</button>,
}));
jest.mock("@/components/dashboard/DashboardProductCard", () => ({
    __esModule: true,
    default: ({ product, onEdit, onDelete }: any) => (
        <div data-testid={`product-card-${product.id}`}>
            <span>{product.title}</span>
            <button onClick={() => onEdit(product)} data-testid={`edit-button-${product.id}`}>
                Edit
            </button>
            <button
                onClick={() => onDelete(product.id)}
                data-testid={`delete-button-${product.id}`}
            >
                Delete
            </button>
        </div>
    ),
}));
jest.mock("@/components/dashboard/ProductForm", () => ({
    __esModule: true,
    default: ({ productProp, onSubmit, onCancel }: any) => (
        <form data-testid="product-form">
            <input
                data-testid="form-name-input"
                defaultValue={productProp?.title || ""}
                // Mock onChange to avoid React warnings about uncontrolled components
                onChange={() => {}}
            />
            <button
                type="submit"
                onClick={() => onSubmit({ id: productProp?.id, name: "Updated Product" })}
                data-testid="form-submit-button"
            >
                Submit
            </button>
            <button type="button" onClick={onCancel} data-testid="form-cancel-button">
                Cancel
            </button>
        </form>
    ),
}));

// Reset all mocks and mock fetch before each test
beforeEach(() => {
    jest.clearAllMocks();
    mockRouterRefresh.mockClear();
    global.fetch = jest.fn();
});

describe("DashboardPageContent", () => {
    const mockProductDataList = [
        {
            id: 1,
            title: "Product A",
            price: 10,
            description: "Desc A",
            category: {
                name: "Electronics",
            },
            images: [],
            creationAt: "2025-06-04T22:50:06.000Z",
            updatedAt: "2025-06-04T22:50:06.000Z",
        },
        {
           id: 2,
            title: "Product B",
            price: 20,
            description: "Desc B",
            category: {
                name: "Books",
            },
            images: [],
            creationAt: "2025-06-04T22:50:06.000Z",
            updatedAt: "2025-06-04T22:50:06.000Z",
        },
    ];

    it("renders loading state when isLoading is true", () => {
        render(<DashboardPageContent productDataList={[]} errorMessage="" isLoading={true} />);
        expect(screen.getByText("Loading products...")).toBeInTheDocument();
    });

    it("renders error message when errorMessage is provided", () => {
        const errorMessage = "Failed to load products.";
        render(
            <DashboardPageContent
                productDataList={[]}
                errorMessage={errorMessage}
                isLoading={false}
            />
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("renders product cards when not loading and no error", () => {
        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getAllByTestId(/product-card-/).length).toBe(2);
    });

    it("calls signOut when SignOut button is clicked", () => {
        const { signOut } = require("next-auth/react");
        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );
        fireEvent.click(screen.getByText("SignOut"));
        expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });

    it("shows the ProductForm when Add Product button is clicked", () => {
        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );
        fireEvent.click(screen.getByText("Add Product"));
        expect(screen.getByText("Add New Product")).toBeInTheDocument();
        expect(screen.getByTestId("product-form")).toBeInTheDocument();
    });

    it("shows the ProductForm with existing data when Edit button is clicked on a product card", () => {
        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );
        fireEvent.click(screen.getByTestId("edit-button-1"));
        expect(screen.getByText("Edit Product")).toBeInTheDocument();
        expect(screen.getByTestId("form-name-input")).toHaveValue("Product A");
    });

    it("hides the ProductForm when Cancel button is clicked", () => {
        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );
        // Show form first
        fireEvent.click(screen.getByText("Add Product")); 
        expect(screen.getByTestId("product-form")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("form-cancel-button"));
        expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
        expect(screen.queryByText("Add New Product")).not.toBeInTheDocument();
    });

    it("handles product deletion successfully", async () => {
        const { useRouter } = require("next/navigation");
        const mockRouter = useRouter();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ success: true }),
        });

        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByTestId("delete-button-1"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.escuelajs.co/api/v1/products/1",
                { method: "DELETE" }
            );
            expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
        });
    });

    it("shows error message if product deletion fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        });

        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByTestId("delete-button-1"));

        await waitFor(() => {
            expect(
                screen.getByText("Failed to delete product. Please try again.")
            ).toBeInTheDocument();
        });
    });

    it("handles new product submission successfully", async () => {
        const { useRouter } = require("next/navigation");
        const mockRouter = useRouter();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: () => Promise.resolve({ id: 3, name: "New Product" }),
        });

        render(<DashboardPageContent productDataList={[]} errorMessage="" isLoading={false} />);

        fireEvent.click(screen.getByText("Add Product"));
        fireEvent.click(screen.getByTestId("form-submit-button"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.escuelajs.co/api/v1/products",
                expect.objectContaining({
                    method: "POST",
                    // Mocked ProductForm data from mock ProductForm
                    body: JSON.stringify({ id: undefined, name: "Updated Product" }), 
                })
            );
            expect(screen.queryByTestId("product-form")).not.toBeInTheDocument(); 
            expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
        });
    });

    it("handles product update submission successfully", async () => {
        const { useRouter } = require("next/navigation");
        const mockRouter = useRouter();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id: 1, name: "Updated Product" }),
        });

        render(
            <DashboardPageContent
                productDataList={mockProductDataList}
                errorMessage=""
                isLoading={false}
            />
        );

        fireEvent.click(screen.getByTestId("edit-button-1")); 
        fireEvent.click(screen.getByTestId("form-submit-button"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.escuelajs.co/api/v1/products/1",
                expect.objectContaining({
                    method: "PUT",
                    // Mocked ProductForm returns this
                    body: JSON.stringify({ id: 1, name: "Updated Product" }), 
                })
            );
            expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
            expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
        });
    });

    it("shows error message if adding product fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: "Bad Request",
        });

        render(<DashboardPageContent productDataList={[]} errorMessage="" isLoading={false} />);

        fireEvent.click(screen.getByText("Add Product"));
        fireEvent.click(screen.getByTestId("form-submit-button"));

        await waitFor(() => {
            expect(
                screen.getByText("Failed to save product. Please try again.")
            ).toBeInTheDocument();
        });
    });
});
