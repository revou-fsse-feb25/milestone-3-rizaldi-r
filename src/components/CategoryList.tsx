"use client";

import { fetchCategoryList } from "@/services/api";
import { ICategoryData } from "@/types/types";
import { useState, useEffect } from "react";
import ButtonRectText from "./ButtonRectText";
import ErrorDisplay from "./ErrorDisplay";
import LoadingDisplay from "./LoadingDisplay";

export default function CategoryList({
    changeCategoryId,
}: {
    changeCategoryId: (newCategoryId: number | null) => void;
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
        <>
            {/* Error display */}
            {error && <ErrorDisplay errorMessage={error} />}

            {/* Loading display */}
            {isLoading && <LoadingDisplay />}

            {/* Category display */}
            {!isLoading && !error && (
                <div
                    className="flex gap-1 my-3 overflow-x-scroll snap-x snap-mandatory no-scrollbar"
                    data-carousel="slide"
                >
                    <ButtonRectText onClickProp={() => changeCategoryId(null)}>All</ButtonRectText>
                    {CategoryData.map((data) => (
                        <ButtonRectText
                            key={data.id}
                            onClickProp={() => changeCategoryId(parseInt(data.id))}
                        >
                            {data.name}
                        </ButtonRectText>
                    ))}
                </div>
            )}
        </>
    );
}

// <Carousel>
//     <ButtonRectText onClickProp={() => changeCategoryId(null)}>
//         All
//     </ButtonRectText>
//     {CategoryData.map((data) => (
//         <ButtonRectText onClickProp={() => changeCategoryId(parseInt(data.id))}>
//             {data.name}
//         </ButtonRectText>
//     ))}
// </Carousel>
