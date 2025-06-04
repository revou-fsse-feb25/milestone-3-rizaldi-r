"use client";

import { Abril_Fatface } from "next/font/google";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { useFetchData } from "@/hooks/useFetchData";
import { fetchProductList } from "@/services/api";
import { IProductData, ICategoryData } from "@/types/types";

import ProductList from "@/components/_commons/ProductList";
import FlashMessage from "@/components/_commons/FlashMessageLogin";
import CategoryList from "./CategoryList";
import ProductCard from "./ProductCard";

const abrilFont = Abril_Fatface({
    subsets: ["latin"],
    weight: "400",
});

export default function HomePageContent({ categories }: { categories: ICategoryData[] }) {
    // Handle auth status for FlashMessage conditional rendering
    const { data: session, status } = useSession();

    // Handle category change
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const onCategoryChange = (newCategoryId: number | null) => {
        setCategoryId(newCategoryId);
    };

    // Handle fetching product list    
    const {
        data: productDataList,
        isLoading: isLoadingProductList,
        error: errorProductList,
    } = useFetchData<IProductData[], [number | null]>(fetchProductList, categoryId);

    return (
        <main>
            <h1
                className={`${abrilFont.className} text-5xl text-center bg-(image:--gradient-title-fill) bg-clip-text text-transparent leading-8 h-17 my-8`}
            >
                aero
                <br />
                cove
            </h1>
            {status === "unauthenticated" && <FlashMessage />}
            <CategoryList CategoryListData={categories} onEachButtonClicked={onCategoryChange} />
            <ProductList<IProductData>
                productDataList={productDataList}
                ChildrenComponent={ProductCard}
                isLoading={isLoadingProductList}
                error={errorProductList}
            />
        </main>
    );
}
