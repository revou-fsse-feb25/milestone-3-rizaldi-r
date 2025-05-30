"use client";
import { Abril_Fatface } from "next/font/google";
import { useState } from "react";
import { useSession } from "next-auth/react";

import CategoryList from "./CategoryList";
import ProductList from "@/components/ProductList";
import FlashMessage from "@/components/FlashMessageLogin";
import ProductCard from "./ProductCard";

const abrilFont = Abril_Fatface({
    subsets: ["latin"],
    weight: "400",
});

export default function HomePageContent() {
    const { data: session, status } = useSession();
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const changeCategoryId = (newCategoryId: number | null) => {
        setCategoryId(newCategoryId);
    };

    return (
        <main>
            <h1
                className={`${abrilFont.className} text-5xl text-center bg-(image:--gradient-title-fill) bg-clip-text text-transparent leading-8 h-17 my-8`}
            >
                aero
                <br />
                cove
            </h1>
            {status === 'unauthenticated' && <FlashMessage />}
            <CategoryList changeCategoryId={changeCategoryId} />
            <ProductList
                categoryId={categoryId}
                renderChildren={(data) => (
                    <ProductCard
                        id={data.id}
                        image={data.images[0]}
                        title={data.title}
                        price={data.price}
                        category={data.category.name}
                        description={data.description}
                    />
                )}
            />
        </main>
    );
}
