import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import navBarReducer from "../features/navBar/navBarSlice";
import modalReducer from "../features/modal/modalSlice";
import projectReducer from "../features/projects/projectSlice";
import taskReducer from "../features/tasks/taskSlice";
import currentPageReducer from "../features/currentPage/currentPageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navBar: navBarReducer,
    modal: modalReducer,
    projects: projectReducer,
    tasks: taskReducer,
    currentPage: currentPageReducer,
  },
});
