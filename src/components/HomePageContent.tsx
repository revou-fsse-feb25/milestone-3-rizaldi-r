"use client";
import { useState } from "react";

import CategoryList from "./CategoryList";
import ProductList from "@/components/ProductList";

export default function HomePageContent({
    setCookieCartCount,
}: {
    setCookieCartCount: () => void;
}) {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    
    const changeCategoryId = (newCategoryId: number | null) => {
        setCategoryId(newCategoryId)
    }
    
    return (
        <main className="mb-20">
            <h1 className="text-5xl text-center">aerocove</h1>
            <CategoryList changeCategoryId={changeCategoryId}/>
            <ProductList categoryId={categoryId} setCookieCartCount={setCookieCartCount} />
        </main>
    );
}
