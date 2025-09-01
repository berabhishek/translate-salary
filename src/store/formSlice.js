import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sourceCode: 'US',
  targetCode: 'IN',
  salary: '',
  salaryCurrency: 'USD',
  salaryCurrencyUserSelected: false,
  houseRent: '',
  food: '',
  entertainment: '',
  travel: '',
  shopping: '',
  other: '',
  // Surprises section
  medicalExpenses: '',
  medicalInsurance: '',
  surprisesOther: '',
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload
      state[field] = value
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
    resetLifestyle: (state) => {
      state.houseRent = ''
      state.food = ''
      state.entertainment = ''
      state.travel = ''
      state.shopping = ''
      state.other = ''
      // Also clear surprises
      state.medicalExpenses = ''
      state.medicalInsurance = ''
      state.surprisesOther = ''
    }
  }
})

export const { setField, resetLifestyle, setCurrencyUserSelected, setCurrencyFromSource, resetCurrencySelection } = formSlice.actions
export default formSlice.reducer
