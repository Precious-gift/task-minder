import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPath: "/",
};
export const currentPageSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPath = action.payload;
    },
  },
});

export const { setCurrentPage } = currentPageSlice.actions;
export default currentPageSlice.reducer;
