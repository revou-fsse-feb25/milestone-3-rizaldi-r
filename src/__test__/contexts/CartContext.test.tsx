import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/contexts/CartContext';

const mockProduct1 = {
    id: 1,
    name: 'Test Product 1',
    price: 10.00,
    image: 'https://placehold.co/100x100/FF0000/FFFFFF?text=P1'
};

const mockProduct2 = {
    id: 2,
    name: 'Test Product 2',
    price: 20.00,
    image: 'https://placehold.co/100x100/00FF00/FFFFFF?text=P2'
};

// Mock localStorage for isolated testing.
const localStorageMock = (function() {
    let store: Record<string, string> = {}; 

    return {
        getItem: jest.fn((key) => store[key] || null), 
        setItem: jest.fn((key, value) => { store[key] = value; }), 
        removeItem: jest.fn((key) => { delete store[key]; }), 
        clear: jest.fn(() => { store = {}; }) 
    };
})();

beforeEach(() => {
    localStorageMock.clear(); 
    Object.defineProperty(window, 'localStorage', { value: localStorageMock }); // Re-define window.localStorage with our mock
});

describe('CartProvider', () => {
    test('should initialize with an empty cart', () => {
        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider // Wrap the hook with our CartProvider
        });

        expect(result.current.items).toEqual([]);
        expect(result.current.totalItems).toBe(0);
    });

    test('should add a new product to the cart', () => {
        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        act(() => {
            result.current.addToCart(mockProduct1);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].product).toEqual(mockProduct1);
        expect(result.current.items[0].quantity).toBe(1);
        expect(result.current.totalItems).toBe(1);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'productList',
            JSON.stringify([{ id: mockProduct1.id, product: mockProduct1, quantity: 1 }])
        );
    });

    test('should increment quantity if product already exists', () => {
        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        // Add the product twice
        act(() => {
            result.current.addToCart(mockProduct1);
            result.current.addToCart(mockProduct1);
        });

        // Expect one item but with quantity 2
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].product).toEqual(mockProduct1);
        expect(result.current.items[0].quantity).toBe(2);
        expect(result.current.totalItems).toBe(2);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'productList',
            JSON.stringify([{ id: mockProduct1.id, product: mockProduct1, quantity: 2 }])
        );
    });

    test('should add multiple different products to the cart', () => {
        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        act(() => {
            result.current.addToCart(mockProduct1);
            result.current.addToCart(mockProduct2);
        });

        expect(result.current.items).toHaveLength(2);
        expect(result.current.totalItems).toBe(2);
        expect(result.current.items[0].product).toEqual(mockProduct1);
        expect(result.current.items[0].quantity).toBe(1);
        expect(result.current.items[1].product).toEqual(mockProduct2);
        expect(result.current.items[1].quantity).toBe(1);
    });

    test('should decrement quantity when removing an existing product with quantity > 1', () => {
        localStorageMock.setItem('productList', JSON.stringify([{ id: mockProduct1.id, product: mockProduct1, quantity: 2 }]));

        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        // Remove the product once
        act(() => {
            result.current.removeFromCart(mockProduct1.id);
        });

        // Expect one item with quantity 1
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].product).toEqual(mockProduct1);
        expect(result.current.items[0].quantity).toBe(1);
        expect(result.current.totalItems).toBe(1);

        // Verify localStorage interaction
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'productList',
            JSON.stringify([{ id: mockProduct1.id, product: mockProduct1, quantity: 1 }])
        );
    });

    test('should remove product completely if quantity is 1', () => {
        // Initialize cart with product1 having quantity 1
        localStorageMock.setItem('productList', JSON.stringify([{ id: mockProduct1.id, product: mockProduct1, quantity: 1 }]));

        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        // Remove the product
        act(() => {
            result.current.removeFromCart(mockProduct1.id);
        });

        // Expect an empty cart
        expect(result.current.items).toHaveLength(0);
        expect(result.current.totalItems).toBe(0);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'productList',
            '[]' // Expect an empty array string
        );
    });

    test('should not change cart when removing a non-existent product', () => {
        act(() => {
            localStorageMock.setItem('productList', JSON.stringify([{ id: mockProduct1.id, product: mockProduct1, quantity: 1 }]));
        });

        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        act(() => {
            result.current.removeFromCart(999); // Non-existent product ID
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].product).toEqual(mockProduct1);
        expect(result.current.items[0].quantity).toBe(1);
        expect(result.current.totalItems).toBe(1);
    });

    test('should load items from localStorage on initial render', () => {
        const savedItems = [{ id: mockProduct1.id, product: mockProduct1, quantity: 3 }];
        localStorageMock.setItem('productList', JSON.stringify(savedItems));

        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        expect(result.current.items).toEqual(savedItems);
        expect(result.current.totalItems).toBe(3);
    });

    test('totalItems should accurately reflect the sum of quantities', () => {
        const { result } = renderHook(() => useCartContext(), {
            wrapper: CartProvider
        });

        act(() => {
            result.current.addToCart(mockProduct1); // Qty: 1
            result.current.addToCart(mockProduct1); // Qty: 2
            result.current.addToCart(mockProduct2); // Qty: 1
        });

        expect(result.current.totalItems).toBe(3); // 2 + 1 = 3

        act(() => {
            result.current.removeFromCart(mockProduct1.id); // Qty: 1
        });

        expect(result.current.totalItems).toBe(2); // 1 + 1 = 2
    });
});
