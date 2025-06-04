"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ICartProduct, ICartItem } from "@/types/types";

// Define the shape of our context state
type CartContextType = {
    items: ICartItem[];
    addToCart: (product: ICartProduct) => void;
    removeFromCart: (productId: number) => void;
    totalItems: number;
};

// Create context with default values
const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => {},
    removeFromCart: () => {},
    totalItems: 0,
});

// Custom hook for using the cart context
export const useCartContext = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<ICartItem[]>([]);
    // Load items from localStorage only on the client side after mount
    useEffect(() => {
        try {
            const savedItems = localStorage.getItem("productList");
            if (savedItems) {
                setItems(JSON.parse(savedItems));
            }
        } catch (error) {
            console.error("Failed to parse cart items from localStorage:", error);
        }
    }, []);

    // runs when 'items' change
    useEffect(() => {
        try {
            // Stringify the array of objects before saving to localStorage
            localStorage.setItem("productList", JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save cart items to localStorage:", error);
        }
    }, [items]);

    // Calculate total items in cart
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    // Calculate total price of items in cart
    // const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    // Add product to cart
    const addToCart = (product: ICartProduct) => {
        setItems((currentItems) => {
            // Check if product already exists in cart
            const existingItem = currentItems.find((item) => item.product.id === product.id);

            if (existingItem) {
                // If it exists, increase quantity
                return currentItems.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // If it doesn't exist, add new item
                return [...currentItems, { id: product.id , product, quantity: 1 }];
            }
        });
    };

    // Remove product from cart
    const removeFromCart = (productId: number) => {
        setItems((currentItems) => {
            // Find the item
            const existingItem = currentItems.find((item) => item.product.id === productId);

            if (existingItem && existingItem.quantity > 1) {
                // If quantity > 1, decrease quantity
                return currentItems.map((item) =>
                    item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                // If quantity is 1, remove item completely
                return currentItems.filter((item) => item.product.id !== productId);
            }
        });
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};
