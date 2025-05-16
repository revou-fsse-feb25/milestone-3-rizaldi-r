"use client";

import { IProductData, EmptyObj, IProductPageContentProps } from "@/types/types";

export default function ProductPageContent({
    images,
    title,
    price,
    categoryName,
    description,
    dateCreated,
    dateUpdated,
}: IProductPageContentProps) {
    return (
        <main>
            <div>
                <img src={images[0]} alt="" />
                <div>
                    <h2>{title}</h2>
                    <p>$ {price}</p>
                    <p>{categoryName}</p>
                    <button className="font-bold bg-gray-200 p-4 px-4 rounded-xl ml-auto cursor-pointer hover:bg-gray-300">
                        <img width={12} src="/favorite.svg" alt="" />
                    </button>
                </div>
                <hr />
                <div>
                    <h3>Product Information</h3>
                    <p>Updated: {dateUpdated}</p>
                    <p>Published: {dateCreated}</p>
                    <p>Category: {categoryName}</p>
                    <hr />
                    <h3>Product Description</h3>
                    <p>{description}</p>
                </div>
            </div>
        </main>
    );
}
