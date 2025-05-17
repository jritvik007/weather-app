import { createSlice } from '@reduxjs/toolkit';

export const historySlice = createSlice({
  name: 'history',
  initialState: [],
  reducers: {
    addSearch: (state, action) => {
      if (!state.includes(action.payload)) {
        state.unshift(action.payload);
      }
    },
  },
});

export const { addSearch } = historySlice.actions;
export default historySlice.reducer;
