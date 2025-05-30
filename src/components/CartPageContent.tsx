"use client";

import Link from "next/link";
import TextSubtitle from "./TextSubtitle";
import ProductCartList from "./ProductCartList";
import ButtonRectText from "./ButtonRectText";

export default function CartPageContent() {
    return (
        <main className="flex flex-col items-start gap-2">
            <TextSubtitle>My Shopping Cart</TextSubtitle>
            <ProductCartList isGrid={false} />
            <Link href={"/checkout"}>
                <ButtonRectText classNameProp="ml-auto">Checkout</ButtonRectText>
            </Link>
        </main>
    );
}
