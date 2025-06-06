/**
 * This file contains all the API functions for fetching data
 */

import axios, { AxiosError } from "axios";
import { IProductData, ICategoryData } from "@/types/types";

// API base URL
axios.defaults.baseURL = "https://api.escuelajs.co/api/v1";

// Error handling
const handleAxiosError = (error: unknown): void => {
    console.error("Unexpected Error:", error);
    throw new Error(`An unexpected error occurred: ${(error as Error).message}`);
};

export const fetchCategoryList = async (): Promise<ICategoryData[]> => {
    try {
        const response = await axios.get("/categories?limit=10");
        response.status;
        return response.data;
    } catch (error) {
        throw handleAxiosError(error);
    }
};

export const fetchProductList = async (categoryId?: number | null): Promise<IProductData[]> => {
    try {
        const filterCategory = categoryId ? `&categoryId=${categoryId}` : "";
        const params: string = "/products?offset=0&limit=10" + filterCategory;
        const response = await axios.get(params);
        return response.data;
    } catch (error) {
        throw handleAxiosError(error);
    }
};

export const fetchProduct = async (id: number): Promise<IProductData> => {
    try {
        const response = await axios.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw handleAxiosError(error);
    }
};

export async function fetchFaq(): Promise<{ id: number; title: string; content: string }[]> {
    return [
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
}
