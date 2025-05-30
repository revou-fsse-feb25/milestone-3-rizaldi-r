"use client";

import ProductCartCard from "./ProductCartCard";
import { useCartContext } from "@/contexts/CartContext";

export default function ProductCartList({
    isGrid = true,
    categoryId,
}: {
    isGrid?: boolean;
    categoryId?: number | null;
}) {
    const { addToCart, removeFromCart, items } = useCartContext();

    return (
        <div className={`flex flex-col gap-2 w-full`}>
            {items.map((item) => {
                const product = item.product;
                return (
                    <ProductCartCard
                        key={product.id}
                        productData={product}
                        id={product.id}
                        image={product.image}
                        title={product.name}
                        price={product.price}
                        quantity={item.quantity}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                    />
                );
            })}
        </div>
    );
}
