import formReducer, {
  setField,
  setCurrencyUserSelected,
  setCurrencyFromSource,
  resetCurrencySelection,
  resetExpenses,
} from '@/store/formSlice.js';

describe('form slice', () => {
  const initialState = {
    sourceCode: 'IN',
    targetCode: 'US',
    salary: '',
    salaryCurrency: 'INR',
    salaryCurrencyUserSelected: false,
    lifestyle: { houseRent: '', food: '' },
    surprises: { medicalExpenses: '' },
  };

  it('should handle initial state', () => {
    expect(formReducer(undefined, { type: 'unknown' })).toEqual({
      sourceCode: 'IN',
      targetCode: 'US',
      salary: '',
      salaryCurrency: 'INR',
      salaryCurrencyUserSelected: false,
      lifestyle: {
        houseRent: '',
        food: '',
        entertainment: '',
        travel: '',
        shopping: '',
        other: '',
      },
      surprises: {
        medicalExpenses: '',
        medicalInsurance: '',
        surprisesOther: '',
      },
    });
  });

  it('should handle setField for top-level fields', () => {
    const actual = formReducer(initialState, setField({ field: 'salary', value: '50000' }));
    expect(actual.salary).toEqual('50000');
  });

  it('should handle setField for nested fields', () => {
    const actual = formReducer(initialState, setField({ field: 'lifestyle.food', value: '500' }));
    expect(actual.lifestyle.food).toEqual('500');
  });

  it('should handle setCurrencyUserSelected', () => {
    const actual = formReducer(initialState, setCurrencyUserSelected('USD'));
    expect(actual.salaryCurrency).toEqual('USD');
    expect(actual.salaryCurrencyUserSelected).toBe(true);
  });

  it('should handle setCurrencyFromSource when user has not selected', () => {
    const actual = formReducer(initialState, setCurrencyFromSource('EUR'));
    expect(actual.salaryCurrency).toEqual('EUR');
  });

  it('should not handle setCurrencyFromSource when user has selected', () => {
    const state = { ...initialState, salaryCurrencyUserSelected: true, salaryCurrency: 'GBP' };
    const actual = formReducer(state, setCurrencyFromSource('EUR'));
    expect(actual.salaryCurrency).toEqual('GBP');
  });

  it('should handle resetCurrencySelection', () => {
    const state = { ...initialState, salaryCurrencyUserSelected: true, salaryCurrency: 'GBP' };
    const actual = formReducer(state, resetCurrencySelection('CAD'));
    expect(actual.salaryCurrency).toEqual('CAD');
    expect(actual.salaryCurrencyUserSelected).toBe(false);
  });

  it('should handle resetExpenses', () => {
    const state = {
      ...initialState,
      lifestyle: { houseRent: '100', food: '50' },
      surprises: { medicalExpenses: '20' },
    };
    const actual = formReducer(state, resetExpenses());
    expect(actual.lifestyle.houseRent).toEqual('');
    expect(actual.surprises.medicalExpenses).toEqual('');
  });
});
