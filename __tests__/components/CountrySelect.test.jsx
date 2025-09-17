import React from 'react';
import { render, screen } from '@testing-library/react';
import CountrySelect from '@/components/CountrySelect.jsx';
import SearchableSelect from '@/components/SearchableSelect.jsx';
import { vi } from 'vitest';

vi.mock('@/components/SearchableSelect.jsx', () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

describe('CountrySelect', () => {
  it('renders a SearchableSelect with country-specific props', () => {
    const handleChange = vi.fn();
    render(<CountrySelect value="US" onChange={handleChange} placeholder="Select Country" />);

    expect(SearchableSelect).toHaveBeenCalled();
    const props = SearchableSelect.mock.calls[0][0];

    expect(props.value).toBe('US');
    expect(props.onChange).toBe(handleChange);
    expect(props.placeholder).toBe('Select Country');
    expect(props.options).toBeDefined();
    expect(props.getOptionValue({ code: 'CA' })).toBe('CA');
    expect(props.getOptionLabel({ name: 'Canada' })).toBe('Canada');

    const renderOptionResult = props.renderOption({ code: 'US', name: 'United States' });
    render(renderOptionResult);
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
  });
});
