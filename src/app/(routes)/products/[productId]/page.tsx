import { cookies } from "next/headers";
import type { Metadata, ResolvingMetadata } from "next";

import ProductPageContent from "@/components/ProductPageContent";
import Navbar from "@/components/Navbar";
import NavbarProductPageBtns from "@/components/NavbarProductPageBtns";
import { fetchProduct } from "@/services/api";
import { IProductData } from "@/types/types";


interface IProductPageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: IProductPageProps): Promise<Metadata> {
    try {
        const tempParams = await params;
        const productData = await fetchProduct(tempParams.productId);
        return {
            title: `${productData.title}`,
            description: productData.description.slice(0, 160),
            openGraph: {
                title: productData.title,
                description: productData.description.slice(0, 160),
                type: "website",
                images: `${productData.images[0]}`,
            },
        };
    } catch (error) {
        return {
            title: "Product Not Found",
            description: "The requested product could not be found.",
        };
    }
}

export default async function ProductPage({ params }: IProductPageProps) {
    // get parameter id
    const tempParams = await params;
    const id = tempParams?.productId;

    // get cookies
    const cookie = await cookies();
    const cartCount = cookie.get("cartCount")?.value;

    // set cookies
    async function setCookieCartCount() {
        "use server";
        const cookie = await cookies();
        cookie.set("cartCount", cookie.has("cartCount") ? parseInt(cartCount) + 1 : 1);
    }

    // fetch product data
    const productData: IProductData = await fetchProduct(id);
    const dateUpdated = new Date(productData.updatedAt).toDateString();
    const dateCreated = new Date(productData.creationAt).toDateString();

    return (
        <>
            <Navbar
                componentButtons={
                    <NavbarProductPageBtns
                        cartCount={cartCount}
                        setCookieCartCount={setCookieCartCount}
                    />
                }
            />
            <ProductPageContent
                images={productData.images}
                title={productData.title}
                price={productData.price}
                categoryName={productData.category.name}
                description={productData.description}
                dateCreated={dateCreated}
                dateUpdated={dateUpdated}
            />
        </>
    );
}
