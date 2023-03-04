import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
}

export const LoginSlice = createSlice({
  name: 'userDetail',
  initialState,
  reducers: {
    userData: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { userData } = LoginSlice.actions

export default LoginSlice.reducer