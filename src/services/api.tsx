/**
 * API Service for Todo Application
 * This file contains all the API functions for CRUD operations.
 */

import axios from "axios";
import { IProductData, ICategoryData } from "@/types/types";

// API base URL
const API_URL = "https://api.escuelajs.co/api/v1";

export const fetchCategoryList = async (): Promise<ICategoryData[]> => {
    const params: string = "/categories?limit=5";
    const response = await axios.get(API_URL + params);
    if (response.statusText !== "OK") throw new Error("Failed to fetch todos");
    return response.data;
};

export const fetchProductList = async (categoryId?: number | null): Promise<IProductData[]> => {
    const filterCategory = categoryId ? `&categoryId=${categoryId}` : "";
    const params: string = `/products?offset=0&limit=10` + filterCategory;
    console.log(" params", params);
    const response = await axios.get(API_URL + params);
    if (response.statusText !== "OK") throw new Error("Failed to fetch todos");
    return response.data;
};

export const fetchProduct = async (id: number): Promise<IProductData> => {
    const params: string = `/products/${id}`;
    const response = await axios.get(API_URL + params);
    if (response.statusText !== "OK") throw new Error("Failed to fetch todos");
    return response.data;
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
