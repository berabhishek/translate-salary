import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sourceCode: 'US',
  targetCode: 'IN',
  salary: '',
  salaryCurrency: 'USD',
  houseRent: '',
  food: '',
  entertainment: '',
  travel: '',
  shopping: '',
  other: '',
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload
      state[field] = value
    },
    resetLifestyle: (state) => {
      state.houseRent = ''
      state.food = ''
      state.entertainment = ''
      state.travel = ''
      state.shopping = ''
      state.other = ''
    }
  }
})

export const { setField, resetLifestyle } = formSlice.actions
export default formSlice.reducer

