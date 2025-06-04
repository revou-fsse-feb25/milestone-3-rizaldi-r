import Link from "next/link";
import { IProductData, ICartProduct } from "@/types/types";
import RegularButton from "../_commons/ButtonRegular";
import CardContainer from "../_commons/CardContainer";
import { useCartContext } from "@/contexts/CartContext";

export default function ProductCard({ productData }: { productData: IProductData }) {
    // Handle cart button
    const { addToCart } = useCartContext();
    const ProductCart: ICartProduct = {
        id: productData.id,
        name: productData.title,
        price: productData.price,
        image: productData.images[0],
    };
    const handleAddToCart = () => {
        addToCart(ProductCart);
    };

    return (
        <CardContainer classNameProp="pb-6">
            <Link href={`/products/${productData.id}`} className="flex flex-col gap-1">
                <img
                    id="image"
                    className="hover:brightness-80 rounded-sm"
                    src={productData.images[0] || "https://placehold.co/600x400?text=No+Image"}
                    alt={`an image of ${productData.title}`}
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=Can't+Load+Image";
                    }}
                />
                <h2 id="title" className="font-semibold">
                    {productData.title}
                </h2>
                <p id="category" className="inline-block w-full text-[10px]">
                    {productData.category.name}
                </p>
                <p id="price" className="font-bold text-base leading-none">
                    ${productData.price}
                </p>
            </Link>
            <div className="flex absolute bottom-0 right-0 p-2 gap-[2px]">
                <RegularButton iconSize={13} iconLink="/favorite.svg" />
                <RegularButton iconSize={14} iconLink="/cart.svg" onClickProp={handleAddToCart} />
            </div>
        </CardContainer>
    );
}
