import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { mainNavbarItems } from "./consts/NavbarItems";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { clearUser } from "../../features/auth/authSlice";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  toggleDrawer,
  toggleNavMobile,
} from "../../features/navBar/navBarSlice";
import TaskMinderLogo from "../../assets/TaskMinderLogo.svg";

const drawerWidth = 240;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPath = useSelector((state) => state.currentPage.currentPath);
  const { drawerOpen, navMobileOpen } = useSelector((state) => state.navBar);

  console.log("drawerOpen:", drawerOpen);
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

  const drawer = (
    <>
      <Box>
        <Toolbar>
          <img src={TaskMinderLogo} alt={"Logo"} loading="lazy" />
        </Toolbar>
        <Divider />
        <List>
          {mainNavbarItems.map((text) => (
            <ListItem key={text.id} disablePadding>
              <ListItemButton
                sx={{
                  backgroundColor: `${currentPath === text.path && "#2563DC"}`,
                  "&:hover": {
                    backgroundColor: `${
                      currentPath === text.path && "#3B82F6"
                    }`, // Lighter blue on hover
                  },
                }}
                onClick={() => {
                  navigate(text.path);
                }}
              >
                <ListItemIcon
                  sx={{
                    color: `${
                      currentPath === text.path ? "#ffffff" : "#14367B"
                    }`,
                  }}
                >
                  {text.icon}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: `${
                      currentPath === text.path ? "#ffffff" : "#14367B"
                    }`,
                  }}
                  primary={text.label}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Toolbar classes={{ root: "px-4" }} disableGutters={true}>
        <Button
          sx={{ backgroundColor: "#FDF0EC", color: "#81290E" }}
          variant="contained"
          fullWidth={true}
          endIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="Navigation"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={navMobileOpen}
        onTransitionEnd={() => dispatch(toggleDrawer())}
        onClose={() => {
          dispatch(toggleDrawer());
          dispatch(toggleNavMobile());
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            justifyContent: "space-between",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            justifyContent: "space-between",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
