/**
 * Type Definitions for Application
 */

export type EmptyObj = Record<PropertyKey, never>;

export interface ICategoryData {
    id: string;
    name: string;
}

export interface IProductData {
    id: number;
    images: string[];
    title: string;
    price: number;
    category: { name: string };
    description: string;
    creationAt: string;
    updatedAt: string;
}

export interface IProductCardProps {
    id: number;
    image: string;
    title: string;
    price: number;
    category?: string;
    description?: string;
}

export interface IProductCartCardProps {
    id: number;
    image: string;
    title: string;
    price: number;
    quantity: number;
    productData: ICartProduct;
    onAddToCart: (product: ICartProduct) => void;
    onRemoveFromCart: (productId: number) => void;
}

export interface IProductPageContentProps {
    images: string[];
    title: string;
    price: number;
    categoryName: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
}

export type ICartItem = {
  product: ICartProduct;
  quantity: number;
};

export interface ICartProduct {
    id: number;
    name: string;
    price: number;
    image: string;
}
