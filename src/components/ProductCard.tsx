import Link from "next/link";
import { ICardProductProps } from "@/types/types";

export default function ProductCard({
    id,
    image,
    title,
    price,
    category,
    description,
    setCookieCartCount,
}: ICardProductProps) {
    return (
        <div className="overflow-hidden text-black bg-white rounded-lg">
            <Link href={`/products/${id}`}>
            <img id="image" className="w-full hover:brightness-80" src={image} alt="" />
            </Link>
            <div id="text" className="p-4">
                <Link href={`/products/${id}`}>
                    <h2 id="title" className="font-bold">
                        {title}
                    </h2>
                    <p id="category" className="inline-block bg-gray-200  w-fit p-1 px-2">
                        {category}
                    </p>
                    <p id="price" className="font-bold text-lg">
                        ${price}
                    </p>
                </Link>
                <div className="flex mt-4">
                    <button className="font-bold bg-gray-200 p-2 px-4 rounded-xl ml-auto cursor-pointer hover:bg-gray-300">
                        <img src="/favorite.svg" alt="" />
                    </button>
                    <button
                        onClick={setCookieCartCount}
                        className="font-bold bg-green-300 p-2 px-4 rounded-xl ml-2 cursor-pointer hover:bg-green-400"
                    >
                        <img src="/cart-shopping.svg" alt="" />
                    </button>
                </div>
            </div>
        </div>
    );
}
