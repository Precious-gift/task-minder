import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectModalOpen: false,
  taskModalOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleProjectModal: (state) => {
      state.projectModalOpen = !state.projectModalOpen;
    },
    toggleTaskModal: (state) => {
      state.taskModalOpen = !state.taskModalOpen;
    },
  },
});
export const { toggleProjectModal, toggleTaskModal } = modalSlice.actions;
export default modalSlice.reducer;
