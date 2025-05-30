import Link from "next/link";
import { IProductCardProps } from "@/types/types";
import CardContainer from "./CardContainer";
import ButtonRectText from "./ButtonRectText";

export default function DashboardProductCard({ product, onEdit, onDelete }: any) {
    const descLength = 30;
    return (
        <CardContainer>
            <Link href={""} className="flex gap-2">
                <img
                    id="image"
                    className="hover:brightness-80 rounded-sm w-20"
                    src={product.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
                    alt={`an image of ${product.title}`}
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                />
                <h2 id="title" className="font-semibold w-1/2">
                    {product.title}
                </h2>
                <span className="font-bold ml-auto whitespace-nowrap">
                    $ <span className=" align-middle  text-lg">{product.price}</span>
                </span>
                <p id="category" className="inline-block w-full text-[10px]">
                    {product.category.name}
                </p>
                <p id="category" className="inline-block w-full text-[10px]">
                    {product.description && product.description.length > descLength
                        ? product.description?.slice(0, descLength - 1) + "..."
                        : product.description}
                </p>
            </Link>
            <div className="flex absolute bottom-0 right-0 p-2 gap-2">
                <ButtonRectText onClickProp={() => onEdit(product)} customPadding="px-1.5" >Edit</ButtonRectText>
                <ButtonRectText onClickProp={() => onDelete(product.id)} customPadding="px-1">Delete</ButtonRectText>
            </div>
        </CardContainer>
    );
}
