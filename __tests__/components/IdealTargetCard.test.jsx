import React from 'react';
import { render, screen } from '@testing-library/react';
import IdealTargetCard from '@/components/IdealTargetCard.jsx';
import { useSelector } from 'react-redux';
import { vi } from 'vitest';

vi.mock('react-redux', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useSelector: vi.fn(),
    };
});

describe('IdealTargetCard', () => {
  it('renders with a placeholder when no target is selected', () => {
    useSelector.mockReturnValue({ targetCode: null });
    render(<IdealTargetCard />);
    expect(screen.getByText('Ideal Target Salary')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('in target currency')).toBeInTheDocument();
  });

  it('renders with the currency of the selected target', () => {
    useSelector.mockReturnValue({ targetCode: 'US' });
    render(<IdealTargetCard />);
    expect(screen.getByText('in USD')).toBeInTheDocument();
  });
});
