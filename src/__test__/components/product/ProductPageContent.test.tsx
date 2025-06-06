import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductPageContent from '@/components/product/ProductPageContent';

jest.mock('@/components/_commons/CardContainer', () => ({
  __esModule: true,
  default: ({ children, classNameProp }: { children: React.ReactNode; classNameProp?: string }) => (
    <div data-testid="mock-card-container" className={classNameProp}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/_commons/TextSubheading', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="mock-text-subheading">{children}</h2>
  ),
}));

jest.mock('@/components/_commons/ButtonRegular', () => ({
  __esModule: true,
  default: ({ children, iconLink, iconSize, customPadding, customFontWeight, onClickProp }: any) => (
    <button
      data-testid="mock-regular-button"
      onClick={onClickProp}
      data-icon-link={iconLink}
      data-icon-size={iconSize}
      data-custom-padding={JSON.stringify(customPadding)}
      data-custom-font-weight={customFontWeight}
    >
      {iconLink && <img src={iconLink} alt="icon" width={iconSize} />}
      {children}
    </button>
  ),
}));

describe('ProductPageContent', () => {
  const mockProductData = {
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    title: 'Awesome Gadget',
    price: 99.99,
    categoryName: 'Electronics',
    description: 'This is a fantastic gadget that does amazing things.',
    dateCreated: '2023-01-15',
    dateUpdated: '2023-10-26',
  };

  test('renders product image with primary image and correct alt text', () => {
    render(<ProductPageContent {...mockProductData} />);
    const imgElement = screen.getByAltText(`an image of ${mockProductData.title}`);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', mockProductData.images[0]);
  });

  test('renders fallback image when primary image is not available', () => {
    const dataWithoutImage = { ...mockProductData, images: [] };
    render(<ProductPageContent {...dataWithoutImage} />);
    const imgElement = screen.getByAltText(`an image of ${mockProductData.title}`);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://placehold.co/600x400?text=No+Image');
  });

  test('handles image loading error by showing fallback', () => {
    render(<ProductPageContent {...mockProductData} />);
    const imgElement = screen.getByAltText(`an image of ${mockProductData.title}`);
    fireEvent.error(imgElement); // Simulate an error loading the image
    expect(imgElement).toHaveAttribute('src', "https://placehold.co/600x400?text=Can't+Load+Image");
  });

  test('renders product title', () => {
    render(<ProductPageContent {...mockProductData} />);
    expect(screen.getByText(mockProductData.title)).toBeInTheDocument();
  });

  test('renders product price', () => {
    render(<ProductPageContent {...mockProductData} />);
    expect(screen.getByText(mockProductData.price.toString())).toBeInTheDocument();
  });

  test('renders category button with correct text and props', () => {
    render(<ProductPageContent {...mockProductData} />);
    const categoryButton = screen.getByText(mockProductData.categoryName).closest('button');
    expect(categoryButton).toBeInTheDocument();
    expect(categoryButton).toHaveAttribute('data-custom-padding', JSON.stringify({ y: 1 }));
    expect(categoryButton).toHaveAttribute('data-custom-font-weight', 'font-semibold');
  });

  test('renders favorite icon button with correct iconLink and iconSize', () => {
    render(<ProductPageContent {...mockProductData} />);
    const favoriteButton = screen.getAllByTestId('mock-regular-button').find(btn => btn.getAttribute('data-icon-link') === '/favorite.svg');
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveAttribute('data-icon-link', '/favorite.svg');
    expect(favoriteButton).toHaveAttribute('data-icon-size', '12');
  });

  test('renders product information (updated, published, category)', () => {
    render(<ProductPageContent {...mockProductData} />);
    expect(screen.getByText(`Updated: ${mockProductData.dateUpdated}`)).toBeInTheDocument();
    expect(screen.getByText(`Published: ${mockProductData.dateCreated}`)).toBeInTheDocument();
    expect(screen.getByText(`Category: ${mockProductData.categoryName}`)).toBeInTheDocument();
  });

  test('renders product description', () => {
    render(<ProductPageContent {...mockProductData} />);
    expect(screen.getByText(mockProductData.description)).toBeInTheDocument();
  });
});
