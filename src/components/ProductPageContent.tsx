"use client";

import { IProductPageContentProps } from "@/types/types";
import CardContainer from "./CardContainer";
import TextSubtitle from "./TextSubtitle";
import ButtonRectText from "./ButtonRectText";
import ButtonRectIcon from "./ButtonRectIcon";

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
        <main className="flex flex-col gap-2">
            <img className="rounded-sm" src={images[0]} alt="" />
            <CardContainer classNameProp="flex items-start justify-between w-full">
                <div className="flex flex-col gap-1 items-start">
                    <TextSubtitle>{title}</TextSubtitle>
                    <span className="font-bold mb-1">
                        $ <span className=" align-middle  text-xl">{price}</span>
                    </span>
                    <ButtonRectText customFontWeight={"font-semibold"} customPadding="px-2">
                        {categoryName}
                    </ButtonRectText>
                </div>
                <ButtonRectIcon iconLink="/favorite.svg" iconSize={12} />
            </CardContainer>
            <CardContainer classNameProp="flex gap-3 pb-4 flex-col">
                <div className="">
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
