import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: null,
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
});
export const { setProjects } = projectSlice.actions;
export default projectSlice.reducer;
