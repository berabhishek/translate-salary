import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpensesSection from '@/components/ExpensesSection.jsx';
import { vi } from 'vitest';

const fields = [
  { key: 'rent', label: 'Rent', placeholder: 'e.g., 1,500', value: '' },
  { key: 'food', label: 'Food', placeholder: 'e.g., 400', value: '' },
];

describe('ExpensesSection', () => {
  it('renders closed by default', () => {
    render(
      <ExpensesSection
        title="Lifestyle"
        fields={fields}
        open={false}
        setOpen={() => {}}
        makeMonetaryChangeHandler={() => () => {}}
      />
    );
    expect(screen.getByText('Lifestyle')).toBeInTheDocument();
    expect(screen.queryByText('Rent')).not.toBeInTheDocument();
  });

  it('renders open when the open prop is true', () => {
    render(
      <ExpensesSection
        title="Lifestyle"
        fields={fields}
        open={true}
        setOpen={() => {}}
        makeMonetaryChangeHandler={() => () => {}}
      />
    );
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  it('calls setOpen when the toggle button is clicked', async () => {
    const setOpen = vi.fn();
    render(
      <ExpensesSection
        title="Lifestyle"
        fields={fields}
        open={false}
        setOpen={setOpen}
        makeMonetaryChangeHandler={() => () => {}}
      />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(setOpen).toHaveBeenCalled();
  });

  it('calls makeMonetaryChangeHandler on input change', async () => {
    const innerChangeHandler = vi.fn();
    const makeMonetaryChangeHandler = vi.fn(() => innerChangeHandler);
    render(
      <ExpensesSection
        title="Lifestyle"
        fields={fields}
        open={true}
        setOpen={() => {}}
        makeMonetaryChangeHandler={makeMonetaryChangeHandler}
      />
    );

    const rentInput = screen.getByPlaceholderText('e.g., 1,500');
    await userEvent.type(rentInput, '123');

    expect(makeMonetaryChangeHandler).toHaveBeenCalledWith('rent', expect.any(Object));
    expect(innerChangeHandler).toHaveBeenCalledTimes(3);
  });
});
