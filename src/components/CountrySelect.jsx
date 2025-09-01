import React from 'react';
import { countries } from '../countries';
import { flagEmojiFromCountryCode } from '../utils/stringUtils';
import SearchableSelect from './SearchableSelect';

const CountrySelect = ({ value, onChange, placeholder }) => {
  return (
    <SearchableSelect
      options={countries}
      value={value}
      onChange={onChange}
      getOptionValue={(o) => o.code}
      getOptionLabel={(o) => o.name}
      placeholder={placeholder}
      renderOption={(o) => (
        <div className="opt-row">
          <span className="flag">{flagEmojiFromCountryCode(o.code)}</span>
          <span>{o.name}</span>
        </div>
      )}
    />
  );
};

export default CountrySelect;
