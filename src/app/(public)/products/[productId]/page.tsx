import type { Metadata } from "next";

import { fetchProduct } from "@/services/api";
import { IProductData } from "@/types/types";
import { handleFetchFromServer } from "@/utils/handleFetchFromServer";

import ProductPageContent from "@/components/product/ProductPageContent";
import Navbar from "@/components/navbar/Navbar";
import NavbarProductPageBtns from "@/components/product/NavbarProductPageBtns";

interface IProductPageProps {
    params: Promise<{ productId: number }>;
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
    // Get the id from parameter
    const tempParams = await params;
    const id = tempParams?.productId;

    // Handle fetch product
    const { productData, errorMessage } = await handleFetchFromServer<IProductData, [number]>(
        fetchProduct,
        id
    );

    return (
        <>
            {errorMessage && <p>{errorMessage}</p>}
            {productData && (
                <>
                    <Navbar>
                        <NavbarProductPageBtns product={productData} />
                    </Navbar>
                    <ProductPageContent
                        images={productData.images}
                        title={productData.title}
                        price={productData.price}
                        categoryName={productData.category.name}
                        description={productData.description}
                        dateCreated={new Date(productData.updatedAt).toDateString()}
                        dateUpdated={new Date(productData.creationAt).toDateString()}
                    />
                </>
            )}
        </>
    );
}
