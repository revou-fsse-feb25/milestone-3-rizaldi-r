"use client";

import Link from "next/link";

import { useCartContext } from "@/contexts/CartContext";
import { ICartItem, IOnClickCartActions } from "@/types/types";

import ProductCartCard from "./ProductCartCard";
import ButtonRegular from "../_commons/ButtonRegular";
import TextSubheading from "../_commons/TextSubheading";
import ProductList from "../_commons/ProductList";

export default function CartPageContent() {
    const { addToCart, removeFromCart, items } = useCartContext();

    return (
        <main className="flex flex-col items-start gap-2">
            <TextSubheading>My Shopping Cart</TextSubheading>
            <ProductList<ICartItem, IOnClickCartActions>
                productDataList={items}
                ChildrenComponent={ProductCartCard}
                onEachElementClickedActions={{
                    onAddToCart: addToCart,
                    onRemoveFromCart: removeFromCart,
                }}
                isGrid={false}
            />
            <Link href={"/checkout"} className="ml-auto">
                <ButtonRegular>Checkout</ButtonRegular>
            </Link>
        </main>
    );
}


