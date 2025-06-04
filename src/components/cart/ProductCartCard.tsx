import { useState, useEffect } from "react";
import Link from "next/link";

import { ICartItem, IOnClickCartActions, ICartProduct } from "@/types/types";

import CardContainer from "../_commons/CardContainer";
import ButtonRegular from "../_commons/ButtonRegular";

export default function ProductCartCard({
    productData,
    onElementClickedActions,
}: {
    productData: ICartItem;
    onElementClickedActions?: IOnClickCartActions;
}) {
    const product: ICartProduct = productData.product;

    // Handle cart add and remove product
    const { onAddToCart, onRemoveFromCart } = onElementClickedActions || {};
    const handleAddToCart = () => {
        if (onAddToCart) onAddToCart(product);
    };
    const handleRemoveFromCart = () => {
        if (onRemoveFromCart) onRemoveFromCart(product.id);
    };

    // Make sure to render only on load
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            {isClient && (
                <CardContainer>
                    <Link href={`/products/${product.id}`} className="flex gap-2">
                        <img
                            id="image"
                            className="hover:brightness-80 rounded-sm w-20"
                            src={product.image || "https://placehold.co/600x400?text=No+Image"}
                            alt={`an image of ${product.name}`}
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                            }}
                        />
                        <h2 id="title" className="font-semibold w-1/2">
                            {product.name}
                        </h2>
                        <span className="font-bold ml-auto whitespace-nowrap">
                            $ <span className=" align-middle  text-lg">{product.price}</span>
                        </span>
                    </Link>
                    <div className="flex absolute bottom-0 right-0 p-2 gap-2">
                        <ButtonRegular
                            customPadding={{ x: 1.5, y: 1 }}
                            onClickProp={handleRemoveFromCart}
                        >
                            -
                        </ButtonRegular>
                        <p className="font-semibold m-auto">{productData.quantity}</p>
                        <ButtonRegular
                            customPadding={{ x: 1, y: 1 }}
                            onClickProp={handleAddToCart}
                        >
                            +
                        </ButtonRegular>
                    </div>
                </CardContainer>
            )}
        </>
    );
}
