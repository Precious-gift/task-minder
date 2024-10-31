import { Outlet } from "react-router-dom";
import { Navbar } from "../components";
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  styled,
  TextField,
  Toolbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleNavMobile } from "../features/navBar/navBarSlice";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  addProjectToDb,
  addTaskToDb,
  auth,
  getProjectsFromDb,
  getTasksFromDb,
} from "../firebase";
import { clearUser } from "../features/auth/authSlice";
import {
  toggleProjectModal,
  toggleTaskModal,
} from "../features/modal/modalSlice";
import { setProjects } from "../features/projects/projectSlice";
import { setTasks } from "../features/tasks/taskSlice";

const drawerWidth = 240;
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid",
  borderColor: alpha("#EFEFEF", 1),
  "&:hover": {
    backgroundColor: alpha("#EFEFEF", 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#999999",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [allProject, setAllProject] = useState(null);

  const [project, setProject] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { drawerOpen } = useSelector((state) => state.navBar);
  const user = useSelector((state) => state.auth.user);
  const { projectModalOpen, taskModalOpen } = useSelector(
    (state) => state.modal
  );
  const projects = useSelector((state) => state.projects.projects);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjectsFromDb(user);
        setAllProject(projects);
        //setProject(projects[0].docid);
        dispatch(setProjects(projects));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
    return () => {};
  }, [dispatch, user]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Successful logout
        console.log("User logged out");
        dispatch(clearUser()); // Clear the user from the Redux store
      })
      .catch((error) => {
        console.error("Error logging out:", error); // Handle any errors
      });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt="User" src={user.photoURL} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "#fff",
          }}
        >
          <Toolbar>
            <IconButton
              color="#3D3D3D"
              aria-label="open drawer"
              edge="start"
              onClick={() => {
                if (!drawerOpen) {
                  dispatch(toggleNavMobile());
                }
              }}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "#999999" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {/* <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="#3D3D3D"
              >
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="#3D3D3D"
              >
                <Avatar alt="User" src={user.photoURL} />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="#3D3D3D"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>

      <Dialog
        open={projectModalOpen}
        onClose={() => dispatch(toggleProjectModal())}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const projectName = formJson.projectName;
            console.log(projectName);
            addProjectToDb(user, projectName);
            const fetchProjects = async () => {
              try {
                const projects = await getProjectsFromDb(user);
                dispatch(setProjects(projects));
              } catch (error) {
                console.error("Error fetching projects:", error);
              }
            };
            fetchProjects();
            dispatch(toggleProjectModal());
          },
        }}
      >
        <DialogTitle>Project</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new project.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="projectName"
            name="projectName"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(toggleProjectModal())}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={taskModalOpen}
        onClose={() => dispatch(toggleTaskModal())}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const taskDesc = formJson.taskDesc;
            console.log("TaskSubmit:", [formJson, project]);
            addTaskToDb(user, taskDesc, project);
            const fetchTasks = async () => {
              try {
                const tasks = await getTasksFromDb(user, project);
                dispatch(setTasks(tasks));
              } catch (error) {
                console.error("Error fetching tasks:", error);
              }
            };
            fetchTasks();
            dispatch(toggleTaskModal());
          },
        }}
      >
        <DialogTitle>Create a new task</DialogTitle>
        <DialogContent>
          <InputLabel id="select-project-label">Select Project</InputLabel>
          <Select
            labelId="select-project-label"
            id="select-project"
            value={project}
            label="Project"
            fullWidth
            onChange={(event) => setProject(event.target.value)}
          >
            {projects &&
              projects.map((project) => (
                <MenuItem key={project.docid} value={project.docid}>
                  {project.projectName}
                </MenuItem>
              ))}
          </Select>
          <TextField
            autoFocus
            required
            margin="dense"
            id="taskDesc"
            name="taskDesc"
            label="Task description"
            multiline
            rows={4}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(toggleTaskModal())}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Home;
