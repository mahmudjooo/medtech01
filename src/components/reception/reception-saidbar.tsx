import * as React from "react";
import {
  styled,
  useTheme,
  type Theme,
  type CSSObject,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Profile from "../navigation/profile";
import { Link, Outlet } from "react-router-dom";
import { HomeIcon, User2 } from "lucide-react";
import {
  FaCreativeCommonsBy,
  FaSearch,
  FaUber,
  FaUserEdit,
  FaUserPlus,
} from "react-icons/fa";

const drawerWidthOpen = 280; // Kengaytirilgan drawer width
const drawerWidthClosed = 72; // Kengaytirilgan yopiq width

const menuItems = [
  {
    text: "Dashboard",
    icon: <HomeIcon style={{ fontSize: 28 }} />,
    path: "/reception/recDash",
  },
  {
    text: "Patients",
    icon: <User2 style={{ fontSize: 28 }} />,
    path: "/reception/patient",
  },
  {
    text: "Patients",
    icon: <FaUber style={{ fontSize: 28 }} />,
    path: "/reception/patient/:id",
  },
  {
    text: "Patiend Add",
    icon: <FaUserPlus style={{ fontSize: 28 }} />,
    path: "/reception/add-reception",
  },
  {
    text: "Search",
    icon: <FaSearch style={{ fontSize: 20 }} />,
    path: "/reception/Search",
  },
  {
    text: "Patiend Edit",
    icon: <FaUserEdit style={{ fontSize: 28 }} />,
    path: "/reception/editPat",
  },
  {
    text: "Create Appartpation",
    icon: <FaCreativeCommonsBy style={{ fontSize: 28 }} />,
    path: "/reception/createappointment",
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidthOpen,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: drawerWidthClosed,
  [theme.breakpoints.up("sm")]: {
    width: drawerWidthClosed + 8,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidthOpen,
    width: `calc(100% - ${drawerWidthOpen}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidthOpen,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
}));

export default function ReceptionSaidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 3 }}
          >
            {open ? (
              <ChevronLeftIcon sx={{ fontSize: 30 }} />
            ) : (
              <MenuIcon sx={{ fontSize: 30 }} />
            )}
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1, userSelect: "none" }}
          >
            Reception Panel
          </Typography>
          <Profile />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={path}
                sx={{
                  minHeight: 60,
                  justifyContent: open ? "initial" : "center",
                  px: 3,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 4 : "auto",
                    justifyContent: "center",
                    color: "primary.main",
                    fontSize: 28,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
