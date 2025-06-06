import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Import the component to be tested
import HomePageContent from "@/components/home/HomePageContent";

// Mock Next.js font
jest.mock("next/font/google", () => ({
    Abril_Fatface: () => ({
        className: "mock-abril-fatface-class",
    }),
}));

jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
}));

jest.mock("@/hooks/useFetchData", () => ({
    useFetchData: jest.fn(),
}));

jest.mock("@/services/api", () => ({
    fetchProductList: jest.fn(),
}));

jest.mock("@/components/_commons/ProductList", () => ({
    // eslint-disable-next-line react/display-name
    __esModule: true,
    default: ({ productDataList, ChildrenComponent, isLoading, error }: any) => (
        <div data-testid="mock-product-list">
            {isLoading && <span>Loading products...</span>}
            {error && <span data-testid="product-list-error">{error}</span>}
            {!isLoading && !error && productDataList && productDataList.length > 0
                ? productDataList.map((product: any) => (
                      <ChildrenComponent key={product.id} product={product} />
                  ))
                : !isLoading && !error && <span>No products available.</span>}
        </div>
    ),
}));

jest.mock("@/components/_commons/FlashMessageLogin", () => ({
    __esModule: true,
    default: () => <div data-testid="mock-flash-message">Flash Message</div>,
}));

jest.mock("@/components/home/CategoryList", () => ({
    __esModule: true,
    default: ({ CategoryListData, onEachButtonClicked }: any) => (
        <div data-testid="mock-category-list">
            {CategoryListData.map((category: any) => (
                <button
                    key={category.id}
                    onClick={() => onEachButtonClicked(category.id)}
                    data-testid={`category-button-${category.id}`}
                >
                    {category.name}
                </button>
            ))}
            <button onClick={() => onEachButtonClicked(null)} data-testid="category-button-all">
                All
            </button>
        </div>
    ),
}));

jest.mock("@/components/home/ProductCard", () => ({
    __esModule: true,
    default: ({ product }: any) => (
        <div data-testid={`mock-product-card-${product.id}`}>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
        </div>
    ),
}));

describe("HomePageContent", () => {
    const mockCategories = [
        { id: "1", name: "Category 1" },
        { id: "2", name: "Category 2" },
    ];

    const mockProducts = [
        {
            id: 101,
            name: "Product A",
            price: 10,
            category: mockCategories[0],
            description: "Desc A",
            images: [],
        },
        {
            id: 102,
            name: "Product B",
            price: 20,
            category: mockCategories[1],
            description: "Desc B",
            images: [],
        },
    ];

    // Import the mocked useSession and useFetchData
    const { useSession } = require("next-auth/react");
    const { useFetchData } = require("@/hooks/useFetchData");
    const { fetchProductList } = require("@/services/api");

    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock implementation for useSession authenticated
        useSession.mockReturnValue({
            data: { user: { name: "Test User" } },
            status: "authenticated",
        });
        // Default mock implementation for useFetchData no error
        useFetchData.mockReturnValue({
            data: mockProducts,
            isLoading: false,
            error: null,
        });
        // Default mock implementation for fetchProductList returns mock products
        fetchProductList.mockResolvedValue(mockProducts);
    });

    it("renders the title and categories", () => {
        render(<HomePageContent categories={mockCategories} />);

        expect(screen.getByRole("heading", { name: /aero/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /cove/i })).toBeInTheDocument();
        expect(screen.getByTestId("mock-category-list")).toBeInTheDocument();
        expect(screen.getByText("Category 1")).toBeInTheDocument();
        expect(screen.getByText("Category 2")).toBeInTheDocument();
        expect(screen.getByText("All")).toBeInTheDocument();
    });

    it('displays FlashMessage when status is "unauthenticated"', () => {
        useSession.mockReturnValue({ data: null, status: "unauthenticated" });
        render(<HomePageContent categories={mockCategories} />);

        expect(screen.getByTestId("mock-flash-message")).toBeInTheDocument();
    });

    it('does not display FlashMessage when status is "authenticated"', () => {
        render(<HomePageContent categories={mockCategories} />);

        expect(screen.queryByTestId("mock-flash-message")).not.toBeInTheDocument();
    });

    it("shows loading state for products", () => {
        useFetchData.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        });
        render(<HomePageContent categories={mockCategories} />);

        expect(screen.getByText("Loading products...")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-product-list")).not.toHaveTextContent(
            "No products available"
        );
    });

    it("shows error state for products", () => {
        useFetchData.mockReturnValue({
            data: [],
            isLoading: false,
            error: "Failed to fetch products.",
        });
        render(<HomePageContent categories={mockCategories} />);

        expect(screen.getByTestId("product-list-error")).toHaveTextContent(
            "Failed to fetch products."
        );
    });

    it("renders product list when data is available", () => {
        render(<HomePageContent categories={mockCategories} />);

        expect(screen.getByTestId("mock-product-list")).toBeInTheDocument();
        expect(screen.getByTestId("mock-product-card-101")).toBeInTheDocument();
        expect(screen.getByTestId("mock-product-card-102")).toBeInTheDocument();
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();
        expect(screen.queryByText("No products available.")).not.toBeInTheDocument();
    });

    it("calls useFetchData with null categoryId initially", () => {
        render(<HomePageContent categories={mockCategories} />);
        expect(useFetchData).toHaveBeenCalledWith(fetchProductList, null);
    });

    it("updates product list when category is changed", () => {
        render(<HomePageContent categories={mockCategories} />);

        fireEvent.click(screen.getByTestId("category-button-1"));
        // The first call is on initial render (null)
        expect(useFetchData).toHaveBeenNthCalledWith(2, fetchProductList, "1");

        // Simulate clicking on "All"
        fireEvent.click(screen.getByTestId("category-button-all"));
        expect(useFetchData).toHaveBeenNthCalledWith(3, fetchProductList, null);
    });

    it('displays "No products available." when productDataList is empty and not loading/error', () => {
        useFetchData.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });
        render(<HomePageContent categories={mockCategories} />);
        expect(screen.getByText("No products available.")).toBeInTheDocument();
    });
});
