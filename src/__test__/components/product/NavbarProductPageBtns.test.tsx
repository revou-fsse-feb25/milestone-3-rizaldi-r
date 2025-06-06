import { render, screen, fireEvent } from '@testing-library/react';

import NavbarProductPageBtns from '@/components/product/NavbarProductPageBtns';
import { useCartContext } from '@/contexts/CartContext'; 

jest.mock('@/components/_commons/ButtonRegular', () => ({
  __esModule: true,
  default: ({ children, onClickProp, customPadding }: any) => (
    <button
      data-testid="mock-button-regular"
      onClick={onClickProp}
      data-custom-padding={JSON.stringify(customPadding)}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/navbar/NavbarButtonCart', () => ({
  __esModule: true,
  default: ({ iconWidth }: { iconWidth: number }) => (
    <div data-testid="mock-navbar-button-cart" data-icon-width={iconWidth}>
      Cart Icon
    </div>
  ),
}));

// Mock the useCartContext hook
jest.mock('@/contexts/CartContext', () => ({
  useCartContext: jest.fn(),
}));

describe('NavbarProductPageBtns', () => {
  const mockProduct = {
    id: 123, // Changed from string to number
    title: 'Example Product',
    price: 29.99,
    images: ['https://example.com/product-image.jpg'],
    category: { name: 'Electronics' }, // Changed from categoryName to category object
    description: 'A great product.',
    creationAt: '2023-01-01', // Changed from dateCreated to creationAt
    updatedAt: '2023-01-01', // Changed from dateUpdated to updatedAt
  };

  const mockAddToCart = jest.fn();

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (useCartContext as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  // Test case 1: Renders NavbarButtonCart with correct iconWidth
  test('renders NavbarButtonCart with the correct iconWidth', () => {
    render(<NavbarProductPageBtns product={mockProduct} />);
    const navbarCartButton = screen.getByTestId('mock-navbar-button-cart');
    expect(navbarCartButton).toBeInTheDocument();
    expect(navbarCartButton).toHaveAttribute('data-icon-width', '24');
  });

  // Test case 2: Renders the "Save" button with correct padding
  test('renders the "Save" button with correct custom padding', () => {
    render(<NavbarProductPageBtns product={mockProduct} />);
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('data-custom-padding', JSON.stringify({ x: 5, y: 3 }));
  });

  // Test case 3: Renders the "Add to Cart" button with correct padding
  test('renders the "Add to Cart" button with correct custom padding', () => {
    render(<NavbarProductPageBtns product={mockProduct} />);
    const addToCartButton = screen.getByText('Add to Cart');
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toHaveAttribute('data-custom-padding', JSON.stringify({ x: 5, y: 3 }));
  });

  // Test case 4: Calls addToCart with correct product data when "Add to Cart" is clicked
  test('calls addToCart with the correct product data when "Add to Cart" button is clicked', () => {
    render(<NavbarProductPageBtns product={mockProduct} />);
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith({
      id: mockProduct.id,
      name: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.images[0],
    });
  });
});
