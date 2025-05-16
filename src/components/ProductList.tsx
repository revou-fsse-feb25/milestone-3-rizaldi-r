"use client";
import { useState, useEffect } from "react";

import { fetchProductList } from "@/services/api";
import { IProductData } from "@/types/types";
import ProductCard from "./ProductCard";

export default function ProductList({
    setCookieCartCount,
    categoryId,
}: {
    setCookieCartCount: () => void;
    categoryId: number | null;
}) {
    // const [categoryIdState, setCategoryIdState] = useState(NaN);
    const [productDataList, setProductDataList] = useState<IProductData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log(" categoryId", categoryId)
            const data = await fetchProductList(categoryId);
            setProductDataList(data);
        } catch (err: unknown) {
            err instanceof Error && setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchProduct();
    }, [categoryId]);

    return (
        <>
            {/* Error display */}
            {error && (
                <div className="bg-red-500 bg-opacity-80 text-white p-4 rounded-lg mb-6 shadow-lg flex items-center">
                    <svg
                        className="w-6 h-6 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Loading display */}
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-gray-300 border-t-primary-500 animate-spin"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            {/* Product display */}
            <div className="grid grid-cols-2 gap-3">
                {!isLoading && productDataList &&
                    productDataList.map((data) => (
                        <ProductCard
                            id={data.id}
                            image={data.images[0]}
                            title={data.title}
                            price={data.price}
                            category={data.category.name}
                            description={data.description}
                            setCookieCartCount={setCookieCartCount}
                        />
                    ))}
            </div>
        </>
    );
}
