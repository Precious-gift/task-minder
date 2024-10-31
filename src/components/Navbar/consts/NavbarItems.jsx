import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
export const mainNavbarItems = [
  {
    id: 0,
    icon: <DashboardOutlinedIcon />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 1,
    icon: <AccountTreeOutlinedIcon />,
    label: "Projects",
    path: "/projects",
  },
  {
    id: 2,
    icon: <AssignmentTurnedInOutlinedIcon />,
    label: "Tasks",
    path: "/tasks",
  },
];
