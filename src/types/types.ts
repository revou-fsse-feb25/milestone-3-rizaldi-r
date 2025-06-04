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

export type ICartItem = {
    id: number
    product: ICartProduct;
    quantity: number;
};

export interface ICartProduct {
    id: number;
    name: string;
    price: number;
    image: string;
}

export interface IOnClickCartActions {
    onAddToCart: (product: ICartProduct) => void;
    onRemoveFromCart: (productId: number) => void;
}
