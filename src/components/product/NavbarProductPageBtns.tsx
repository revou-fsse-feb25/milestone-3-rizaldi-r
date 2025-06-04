"use client";

import ButtonRegular from "../_commons/ButtonRegular";
import NavbarButtonCart from "../navbar/NavbarButtonCart";
import { useCartContext } from "@/contexts/CartContext";
import { ICartProduct, IProductData } from "@/types/types";

export default function NavbarProductPageBtns({ product }: { product: IProductData }) {
    const iconWidth: number = 24;
    const customPadding = { x: 5, y: 3 };

    const { addToCart } = useCartContext();
    const ProductCart: ICartProduct = {
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
    };

    const handleAddToCart = () => {
        addToCart(ProductCart);
    };

    return (
        <div className="flex gap-1.5 items-center">
            <NavbarButtonCart iconWidth={iconWidth} />
            <ButtonRegular customPadding={customPadding}>Save</ButtonRegular>
            <ButtonRegular onClickProp={handleAddToCart} customPadding={customPadding}>
                Add to Cart
            </ButtonRegular>
        </div>
    );
}
