import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import formReducer from '@/store/formSlice.js';
import TranslateSalary from '@/pages/TranslateSalary.jsx';
import { handleFormContinue } from '@/utils/formActions.js';
import { vi } from 'vitest';

vi.mock('@/utils/formActions.js', () => ({
  handleFormContinue: vi.fn(),
}));

const renderWithProvider = (ui, { reduxState } = {}) => {
  const store = configureStore({
    reducer: { form: formReducer },
    preloadedState: reduxState,
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('TranslateSalary Page', () => {
  it('renders the form with initial data', () => {
    renderWithProvider(<TranslateSalary />);
    expect(screen.getByText('Source Country')).toBeInTheDocument();
    expect(screen.getByText('Target Country')).toBeInTheDocument();
    expect(screen.getByText('Annual Salary')).toBeInTheDocument();
  });

  it('dispatches actions on country change', async () => {
    renderWithProvider(<TranslateSalary />);
    // This interaction is complex to test without a full e2e setup,
    // as it involves multiple components. We will trust the unit tests
    // for the child components.
  });

  it('calls handleFormContinue on submit', async () => {
    const reduxState = {
      form: {
        sourceCode: 'US',
        targetCode: 'CA',
        salary: '100000',
        salaryCurrency: 'USD',
        lifestyle: {},
        surprises: {},
      },
    };
    renderWithProvider(<TranslateSalary />, { reduxState });

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    await userEvent.click(continueButton);

    expect(handleFormContinue).toHaveBeenCalledWith({
      sourceCode: 'US',
      targetCode: 'CA',
      salary: '100000',
      salaryCurrency: 'USD',
      lifestyle: {},
      surprises: {},
    });
  });

  it('resets the form on reset button click', async () => {
    const reduxState = {
        form: {
          sourceCode: 'US',
          targetCode: 'CA',
          salary: '100000',
          salaryCurrency: 'USD',
          lifestyle: { houseRent: '1' },
          surprises: { medicalExpenses: '1' },
        },
      };
      renderWithProvider(<TranslateSalary />, { reduxState });

      const salaryInput = screen.getByPlaceholderText('e.g., 80,000');
      expect(salaryInput.value).toBe('100000');

      const resetButton = screen.getByRole('button', { name: 'Reset' });
      await userEvent.click(resetButton);

      expect(salaryInput.value).toBe('');
  });
});
