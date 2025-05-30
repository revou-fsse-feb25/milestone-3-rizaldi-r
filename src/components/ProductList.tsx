"use client";
import React, { useState, useEffect, ReactNode } from "react";

import { fetchProductList } from "@/services/api";
import { IProductData } from "@/types/types";
import ErrorDisplay from "./ErrorDisplay";
import LoadingDisplay from "./LoadingDisplay";

export default function ProductList({
    renderChildren,
    isGrid = true,
    categoryId,
}: {
    renderChildren: (data: IProductData) => ReactNode;
    isGrid?: boolean;
    categoryId?: number | null;
}) {
    const [productDataList, setProductDataList] = useState<IProductData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: fetch in parent component so it can be reused
    const fetchProduct = async (categoryIdParam?: number | null) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchProductList(categoryIdParam);
            setProductDataList(data);
        } catch (err: unknown) {
            err instanceof Error && setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct(categoryId);
    }, [categoryId]);

    return (
        <>
            {/* Error display */}
            {error && <ErrorDisplay errorMessage={error} />}

            {/* Loading display */}
            {isLoading && <LoadingDisplay />}

            {/* Product display */}
            {!error && !isLoading && (
                <div className={`${isGrid ? 'grid' : 'flex'} grid-cols-2 gap-3 flex-col`}>
                    {productDataList.map((productData) => (
                        <React.Fragment key={productData.id}>
                            {renderChildren(productData)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </>
    );
}
