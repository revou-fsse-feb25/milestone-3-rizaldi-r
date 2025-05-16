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

export interface ICardProductProps {
    id: number;
    image: string;
    title: string;
    price: number;
    category: string;
    description: string;
    setCookieCartCount: VoidFunction;
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
