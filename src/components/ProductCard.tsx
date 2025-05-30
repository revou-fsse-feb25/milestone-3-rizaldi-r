import Link from "next/link";
import { IProductCardProps, ICartProduct } from "@/types/types";
import ButtonRectIcon from "./ButtonRectIcon";
import CardContainer from "./CardContainer";
import { useCartContext } from "@/contexts/CartContext";

export default function ProductCard({ id, image, title, price, category }: IProductCardProps) {
    const { addToCart } = useCartContext();
    const ProductCart: ICartProduct = { id: id, name: title, price: price, image: image };
    const handleAddToCart = () => {
        addToCart(ProductCart);
    };
    return (
        <CardContainer classNameProp="pb-6">
            <Link href={`/products/${id}`} className="flex flex-col gap-1">
                <img
                    id="image"
                    className="hover:brightness-80 rounded-sm"
                    src={image || "https://placehold.co/600x400?text=No+Image"}
                    alt={`an image of ${title}`}
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                />
                <h2 id="title" className="font-semibold">
                    {title}
                </h2>
                <p id="category" className="inline-block w-full text-[10px]">
                    {category}
                </p>
                <p id="price" className="font-bold text-base leading-none">
                    ${price}
                </p>
            </Link>
            <div className="flex absolute bottom-0 right-0 p-2 gap-[2px]">
                <ButtonRectIcon iconSize={12} iconLink="/favorite.svg" />
                <ButtonRectIcon iconSize={14} iconLink="/cart.svg" onClickProp={handleAddToCart} />
            </div>
        </CardContainer>
    );
}
