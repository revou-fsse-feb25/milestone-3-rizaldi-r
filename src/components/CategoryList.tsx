"use client";

import { fetchCategoryList } from "@/services/api";
import { ICategoryData } from "@/types/types";
import { useState, useEffect } from "react";

export default function CategoryList({
    changeCategoryId,
}: {
    changeCategoryId: (newCategoryId: number | null) => {};
}) {
    const [CategoryData, setCategoryData] = useState<ICategoryData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategory = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchCategoryList();
            setCategoryData(data);
        } catch (err: unknown) {
            err instanceof Error && setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <div>
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

            {/* Category display */}
            {!isLoading && (
                <div>
                    <button
                        onClick={() => {
                            changeCategoryId(null);
                        }}
                        className="font-bold bg-gray-300 border border-gray-400 p-2 px-4 rounded-xl ml-auto cursor-pointer hover:bg-gray-300"
                    >
                        All
                    </button>
                    {CategoryData.map((data) => (
                        <button
                            onClick={() => {
                                changeCategoryId(parseInt(data.id));
                            }}
                            className="font-bold bg-gray-300 border border-gray-400 p-2 px-4 rounded-xl ml-auto cursor-pointer hover:bg-gray-300"
                        >
                            {data.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
