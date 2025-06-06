import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import LoadingDisplay from '@/components/_commons/LoadingDisplay';

describe('LoadingDisplay', () => {
  it('displays a loading spinner and "Loading..." text for screen readers', () => {
    render(<LoadingDisplay />);

    expect(screen.getByText('Loading...', { selector: 'span' })).toBeInTheDocument();
    // Verify it's visually hidden but accessible
    expect(screen.getByText('Loading...', { selector: 'span' })).toHaveClass('sr-only');
  });

  it('renders the spinner div with appropriate styling classes', () => {
    render(<LoadingDisplay />);

    const spinnerDiv = screen.getByText('Loading...', { selector: 'span' }).previousElementSibling;

    expect(spinnerDiv).toBeInTheDocument();
    expect(spinnerDiv).toHaveClass('h-16');
    expect(spinnerDiv).toHaveClass('w-16');
    expect(spinnerDiv).toHaveClass('rounded-full');
    expect(spinnerDiv).toHaveClass('border-4');
    expect(spinnerDiv).toHaveClass('border-gray-300');
    expect(spinnerDiv).toHaveClass('border-t-primary-500');
    expect(spinnerDiv).toHaveClass('animate-spin');
  });

  it('renders the main container with centering and height classes', () => {
    render(<LoadingDisplay />);

    // The outermost div
    const mainContainer = screen.getByText('Loading...', { selector: 'span' }).closest('div.flex.justify-center');

    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('justify-center');
    expect(mainContainer).toHaveClass('items-center');
    expect(mainContainer).toHaveClass('h-64');
  });
});
