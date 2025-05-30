import Link from "next/link";
import { useState, useEffect } from "react";
import { IProductCartCardProps } from "@/types/types";
import CardContainer from "./CardContainer";
import ButtonRectText from "./ButtonRectText";

export default function ProductCartCard({
    id,
    image,
    title,
    price,
    quantity,
    productData,
    onAddToCart,
    onRemoveFromCart,
}: IProductCartCardProps) {
    const [isClient, setIsClient] = useState(false);
    const handleAddToCart = () => {
        onAddToCart(productData);
    };
    const handleRemoveFromCart = () => {
        onRemoveFromCart(id);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <CardContainer>
                    <Link href={`/products/${id}`} className="flex gap-2">
                        <img
                            id="image"
                            className="hover:brightness-80 rounded-sm w-20"
                            src={image || "https://placehold.co/600x400?text=No+Image"}
                            alt={`an image of ${title}`}
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                            }}
                        />
                        <h2 id="title" className="font-semibold w-1/2">
                            {title}
                        </h2>
                        <span className="font-bold ml-auto whitespace-nowrap">
                            $ <span className=" align-middle  text-lg">{price}</span>
                        </span>
                    </Link>
                    <div className="flex absolute bottom-0 right-0 p-2 gap-2">
                        <ButtonRectText customPadding="px-1.5" onClickProp={handleRemoveFromCart}>
                            -
                        </ButtonRectText>
                        <p className="font-semibold m-auto">{quantity}</p>
                        <ButtonRectText customPadding="px-1" onClickProp={handleAddToCart}>
                            +
                        </ButtonRectText>
                    </div>
                </CardContainer>
            )}
        </>
    );
}
