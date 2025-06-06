import axios, { AxiosError } from "axios";
import { IProductData, ICategoryData } from "@/types/types";
import { fetchCategoryList, fetchProductList, fetchProduct, fetchFaq } from "../../services/api";

// Mock Axios to prevent actual HTTP requests during tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Functions", () => {
    // Clear all mocks before each test to ensure isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for fetchCategoryList
    describe("fetchCategoryList", () => {
        const mockCategories: ICategoryData[] = [
            { id: "1", name: "Electronics" },
            { id: "2", name: "Clothes" },
        ];

        it("should fetch a list of categories successfully", async () => {
            // Arrange
            // Mock the Axios GET request to return successful data
            mockedAxios.get.mockResolvedValue({ data: mockCategories, status: 200 });

            // Act
            // Axios should get the mock data fromm above mockResolvedValue
            const result = await fetchCategoryList();

            // Assert
            // Expect Axios GET to have been called with the correct URL
            expect(mockedAxios.get).toHaveBeenCalledWith("/categories?limit=10");
            expect(result).toEqual(mockCategories);
        });

        it("should throw an error when fetching categories fails", async () => {
            // Arrange
            // Mock the error message
            const errorMessage = "Network Error";
            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            // Act & Assert
            // Assert that axios.get was still called with the correct endpoint.
            await expect(fetchCategoryList()).rejects.toThrow(
                `An unexpected error occurred: ${errorMessage}`
            );
            expect(mockedAxios.get).toHaveBeenCalledWith("/categories?limit=10");
        });
    });

    describe("fetchProductList", () => {
        const mockProductList: IProductData[] = [
            {
                id: 4,
                title: "Classic Grey Hooded Sweatshirt",
                price: 90,
                description: "Elevate your casual wear with our Classic Grey Hooded Sweatshirt.",
                category: {
                    name: "Clothes",
                },
                images: [
                    "https://i.imgur.com/R2PN9Wq.jpeg",
                    "https://i.imgur.com/IvxMPFr.jpeg",
                    "https://i.imgur.com/7eW9nXP.jpeg",
                ],
                creationAt: "2025-06-04T22:50:06.000Z",
                updatedAt: "2025-06-04T22:50:06.000Z",
            },
            {
                id: 5,
                title: "Classic Black Hooded Sweatshirt",
                price: 79,
                description:
                    "Elevate your casual wardrobe with our Classic Black Hooded Sweatshirt.",
                category: {
                    name: "Clothes",
                },
                images: [
                    "https://i.imgur.com/cSytoSD.jpeg",
                    "https://i.imgur.com/WwKucXb.jpeg",
                    "https://i.imgur.com/cE2Dxh9.jpeg",
                ],
                creationAt: "2025-06-04T22:50:06.000Z",
                updatedAt: "2025-06-04T22:50:06.000Z",
            },
        ];

        it("should fetch a list of product successfully without a category filter", async () => {
            // Arrange
            mockedAxios.get.mockResolvedValue({ data: mockProductList, status: 200 });

            // Act
            const productList = await fetchProductList();

            // Assert
            expect(mockedAxios.get).toHaveBeenCalledWith("/products?offset=0&limit=10");
            expect(productList).toEqual(mockProductList);
        });

        it("should fetch a list of products with a category filter", async () => {
            const categoryId = 1;
            mockedAxios.get.mockResolvedValue({ data: mockProductList });

            // Call the function with a category ID.
            const products = await fetchProductList(categoryId);

            // Assert the returned data and the axios call with the category filter.
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `/products?offset=0&limit=10&categoryId=${categoryId}`
            );
            expect(products).toEqual(mockProductList);
        });

        it("should throw an error if fetching products fails", async () => {
            const errorMessage = "Request failed with status code 404";
            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            await expect(fetchProductList()).rejects.toThrow(
                `An unexpected error occurred: ${errorMessage}`
            );
            expect(mockedAxios.get).toHaveBeenCalledWith("/products?offset=0&limit=10");
        });
    });

    describe("fetchProduct", () => {
        const mockProduct: IProductData = {
            id: 4,
            title: "Classic Grey Hooded Sweatshirt",
            price: 90,
            description: "Elevate your casual wear with our Classic Grey Hooded Sweatshirt.",
            category: {
                name: "Clothes",
            },
            images: [
                "https://i.imgur.com/R2PN9Wq.jpeg",
                "https://i.imgur.com/IvxMPFr.jpeg",
                "https://i.imgur.com/7eW9nXP.jpeg",
            ],
            creationAt: "2025-06-04T22:50:06.000Z",
            updatedAt: "2025-06-04T22:50:06.000Z",
        };

        it("should fetch a single product by ID successfully", async () => {
            // Define mock data for a single product.
            // Configure axios.get to return the mock product.
            mockedAxios.get.mockResolvedValue({ data: mockProduct });

            // Call the function with a product ID.
            const productId = 1;
            const product = await fetchProduct(productId);

            // Assert the returned data and the axios call with the specific product ID.
            expect(product).toEqual(mockProduct);
            expect(mockedAxios.get).toHaveBeenCalledWith(`/products/${productId}`);
        });

        it("should throw an error if fetching a single product fails", async () => {
            const errorMessage = "Product not found";
            mockedAxios.get.mockRejectedValue(new Error(errorMessage));

            // An ID that would typically fail.
            const productId = 999;

            // Assert
            await expect(fetchProduct(productId)).rejects.toThrow(
                `An unexpected error occurred: ${errorMessage}`
            );
            expect(mockedAxios.get).toHaveBeenCalledWith(`/products/${productId}`);
        });
    });

    describe("fetchFaq", () => {
        const expectedFaq: { id: number; title: string; content: string }[] = [
            {
                id: 1,
                title: "How do I create an account?",
                content: `Creating an account is easy! Simply click on the "Sign Up" button located at the top right of our homepage. You'll be asked to provide your name, email address, and create a password. You can also sign up using your Google or Facebook account for added convenience.`,
            },
            {
                id: 2,
                title: "How do I contact a seller?",
                content: `Once you're on a product page, you'll find the seller's information, including their username and a "Contact Seller" button. Click this button to send a direct message to the seller with your questions.`,
            },
            {
                id: 3,
                title: "How do I make a purchase?",
                content: `To make a purchase, click the "Add to Cart" button on the product page. Once you've added all the items you want, proceed to the checkout page. You'll be asked to provide your shipping address and payment information. We accept credit cards, PayPal, bank transfers].`,
            },
            {
                id: 4,
                title: "What are the shipping options and costs?",
                content: `Shipping options and costs vary depending on the seller and the item. This information will be clearly displayed during the checkout process. You can usually find the seller's shipping policies on their profile or the product page.`,
            },
        ];

        it("should return a predefined list of FAQs", async () => {
            const faq = await fetchFaq();

            expect(faq).toEqual(expectedFaq);
        });
    });
});
