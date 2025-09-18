import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchableSelect from '@/components/SearchableSelect.jsx';
import { vi } from 'vitest';

const options = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
];

describe('SearchableSelect', () => {
  it('renders with a placeholder when no value is selected', () => {
    render(<SearchableSelect options={options} placeholder="Select a country" />);
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('renders with the selected value', () => {
    render(<SearchableSelect options={options} value="CA" />);
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('opens the dropdown on click', async () => {
    render(<SearchableSelect options={options} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('filters options based on search query', async () => {
    render(<SearchableSelect options={options} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'can');
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('calls onChange with the selected option', async () => {
    const handleChange = vi.fn();
    render(<SearchableSelect options={options} onChange={handleChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Mexico'));
    expect(handleChange).toHaveBeenCalledWith(options[2]);
  });

  it('closes the dropdown when clicking outside', async () => {
    render(
      <div>
        <SearchableSelect options={options} />
        <div>Outside element</div>
      </div>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Outside element'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders custom option', () => {
    render(
      <SearchableSelect
        options={options}
        value="US"
        renderOption={(option) => `-> ${option.name}`}
      />
    );
    expect(screen.getByText('-> United States')).toBeInTheDocument();
  });

  it('shows empty text when no options match', async () => {
    render(<SearchableSelect options={options} emptyText="No countries found" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'xyz');
    expect(screen.getByText('No countries found')).toBeInTheDocument();
  });
});
