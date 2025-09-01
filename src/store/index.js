import { configureStore } from '@reduxjs/toolkit'
import formReducer from './formSlice.js'

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
})

