"use client";

import ButtonRectText from "./ButtonRectText";
import NavbarButtonCart from "./NavbarButtonCart";
import { useCartContext } from "@/contexts/CartContext";
import { ICartProduct, IProductData } from "@/types/types";

export default function NavbarProductPageBtns({ product }: { product: IProductData }) {
    const iconWidth: number = 24;
    const customPadding: string = "px-5 py-3";

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
            <ButtonRectText customPadding={customPadding}>Save</ButtonRectText>
            <ButtonRectText onClickProp={handleAddToCart} customPadding={customPadding}>
                Add to Cart
            </ButtonRectText>
        </div>
    );
}
