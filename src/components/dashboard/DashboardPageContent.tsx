"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

import { fetchProductList } from "@/services/api";
import { IProductData } from "@/types/types";

import ButtonRegular from "../_commons/ButtonRegular";
import DashboardProductCard from "./DashboardProductCard";
import ProductForm from "./ProductForm";

export default function DashboardPageContent({
    productDataList,
}: {
    productDataList: IProductData[];
}) {
    // const [productDataList, setProductDataList] = useState<IProductData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any | undefined>(undefined);

    // const fetchProducts = async (categoryIdParam?: number | null) => {
    //     try {
    //         setIsLoading(true);
    //         setError(null);
    //         const data = await fetchProductList(categoryIdParam);
    //         setProductDataList(data);
    //     } catch (err: unknown) {
    //         err instanceof Error && setError(err.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchProducts();
    // }, []);

    // show form
    const handleCreateProduct = () => {
        setCurrentProduct(undefined);
        setShowForm(true);
    };
    const handleEditProduct = (product: any) => {
        setCurrentProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Delete failed with status: ${response.status}`);
            }

            // fetchProducts();
        } catch (error) {
            console.error(`Error deleting product with id ${id}:`, error);
            setError("Failed to delete product. Please try again.");
        }
    };

    const handleSubmitProduct = async (product: Partial<any>) => {
        try {
            let response;

            if (currentProduct) {
                response = await fetch(
                    `https://api.escuelajs.co/api/v1/products/${currentProduct.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(product),
                    }
                );
            } else {
                response = await fetch("https://api.escuelajs.co/api/v1/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(product),
                });
            }

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            setShowForm(false);
            // fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            setError("Failed to save product. Please try again.");
        }
    };

    return (
        <div>
            <ButtonRegular
                onClickProp={() => {
                    signOut({ callbackUrl: "/" });
                }}
            >
                SignOut
            </ButtonRegular>
            <div>
                <h1>Product Management</h1>
                <ButtonRegular onClickProp={handleCreateProduct}>Add Product</ButtonRegular>
            </div>

            {/* {error && <p>{error}</p>}

            {showForm ? (
                <div>
                    <h2>{currentProduct ? "Edit Product" : "Add New Product"}</h2>
                    <ProductForm
                        productProp={currentProduct}
                        onSubmit={handleSubmitProduct}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : isLoading ? (
                <div>
                    <p>Loading products...</p>
                </div>
            ) : ( */}
                <div className="flex flex-col gap-2">
                    {productDataList.map((productData) => (
                        <DashboardProductCard
                            key={productData.id}
                            product={productData}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            {/* )} */}
        </div>
    );
}
