import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

jest.mock('@/components/home/HomePageContent', () => {
  return function MockHomePageContent() {
    return <div data-testid="mock-homepage-content">Mock HomePage Content</div>;
  };
});

jest.mock('@/components/Navbar', () => {
  return function MockNavbar({ children }: { children: React.ReactNode }) {
    return <nav data-testid="mock-navbar">{children}</nav>;
  };
});

jest.mock('@/components/NavbarRedirectBtns', () => {
  return function MockNavbarRedirectBtns() {
    return <div data-testid="mock-navbar-redirect-btns">Mock Navbar Redirect Buttons</div>;
  };
});

describe('HomePage', () => {
  it('renders the Help link with correct attributes', async () => {
    // Render the HomePage component
    render(await HomePage());

    // Find the Link component by its text content
    const faqLink = screen.getByRole('link', { name: /Help/i });

    // Assert that the link is in the document
    expect(faqLink).toBeInTheDocument();
    expect(faqLink).toHaveAttribute('href', '/faq');
    expect(faqLink).toHaveClass('absolute right-2 text-black opacity-50');

    // Find the image inside the link
    const faqImage = screen.getByAltText('');
    expect(faqImage).toBeInTheDocument();
    expect(faqImage).toHaveAttribute('src', '/question.svg');
    expect(faqImage).toHaveAttribute('width', '16');
    expect(faqImage).toHaveClass('inline align-sub mr-[2px]');
  });

  it('renders the Navbar component', async () => {
    render(await HomePage());
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
  });

  it('renders NavbarRedirectBtns inside Navbar', async () => {
    render(await HomePage());
    expect(screen.getByTestId('mock-navbar-redirect-btns')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toContainElement(screen.getByTestId('mock-navbar-redirect-btns'));
  });

  it('renders the HomePageContent component', async () => {
    render(await HomePage());
    expect(screen.getByTestId('mock-homepage-content')).toBeInTheDocument();
  });
});
