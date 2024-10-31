import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  navMobileOpen: false,
};

export const navBarSlice = createSlice({
  name: "navBar",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    toggleNavMobile: (state) => {
      state.navMobileOpen = !state.navMobileOpen;
    },
  },
});

export const { toggleDrawer, toggleNavMobile } = navBarSlice.actions;
export default navBarSlice.reducer;
