import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload
      const [section, key] = field.split('.')
      if (key) {
        state[section][key] = value
      } else {
        state[field] = value
      }
    },
    setCurrencyUserSelected: (state, action) => {
      state.salaryCurrency = action.payload
      state.salaryCurrencyUserSelected = true
    },
    setCurrencyFromSource: (state, action) => {
      // Only update if user hasn't explicitly chosen a currency
      if (!state.salaryCurrencyUserSelected) {
        state.salaryCurrency = action.payload
      }
    },
    resetCurrencySelection: (state, action) => {
      state.salaryCurrency = action.payload
      state.salaryCurrencyUserSelected = false
    },
    resetExpenses: (state) => {
      state.lifestyle = {
        houseRent: '',
        food: '',
        entertainment: '',
        travel: '',
        shopping: '',
        other: '',
      }
      state.surprises = {
        medicalExpenses: '',
        medicalInsurance: '',
        surprisesOther: '',
      }
    },
  }
})

export const { setField, resetExpenses, setCurrencyUserSelected, setCurrencyFromSource, resetCurrencySelection } = formSlice.actions
export default formSlice.reducer