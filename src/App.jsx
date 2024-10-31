import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCurrentPage } from "./features/currentPage/currentPageSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = useSelector((state) => state.currentPage.currentPath);
  const navigate = useNavigate();
  useEffect(() => {
    // Save the current path whenever it changes
    dispatch(setCurrentPage(location.pathname));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    // Redirect to the last visited page on initial load
    if (currentPath && currentPath !== "/" && location.pathname === "/") {
      navigate(currentPath);
    }
  }, [currentPath, location.pathname, navigate]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Projects />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
}

export default App;
