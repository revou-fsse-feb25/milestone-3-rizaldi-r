"use client";

import CardContainer from "../_commons/CardContainer";
import TextSubheading from "../_commons/TextSubheading";
import RegularButton from "../_commons/ButtonRegular";

interface IProductPageData {
    images: string[];
    title: string;
    price: number;
    categoryName: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
}

export default function ProductPageContent({
    images,
    title,
    price,
    categoryName,
    description,
    dateCreated,
    dateUpdated,
}: IProductPageData) {
    return (
        <main className="flex flex-col gap-2">
            <img
                className="rounded-sm"
                src={images[0] || "https://placehold.co/600x400?text=No+Image"}
                alt={`an image of ${title}`}
                onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=Can't+Load+Image";
                }}
            />
            <CardContainer classNameProp="flex items-start justify-between w-full">
                <div className="flex flex-col gap-1 items-start">
                    <TextSubheading>{title}</TextSubheading>
                    <span className="font-bold mb-1">
                        $ <span className=" align-middle  text-xl">{price}</span>
                    </span>
                    <RegularButton customPadding={{ y: 1 }} customFontWeight={"font-semibold"}>
                        {categoryName}
                    </RegularButton>
                </div>
                <RegularButton iconLink="/favorite.svg" iconSize={12} />
            </CardContainer>
            <CardContainer classNameProp="flex gap-3 pb-4 flex-col">
                <div>
                    <h3 className="font-semibold mb-1">Product Information</h3>
                    <p>Updated: {dateUpdated}</p>
                    <p>Published: {dateCreated}</p>
                    <p>Category: {categoryName}</p>
                </div>
                <div className="">
                    <h3 className="font-semibold mb-1">Product Description</h3>
                    <p>{description}</p>
                </div>
            </CardContainer>
        </main>
    );
}
