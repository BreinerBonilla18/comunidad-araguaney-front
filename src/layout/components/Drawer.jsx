import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuItemsDrawer from "./MenuItemsDrawer";
import { FaBars } from "react-icons/fa";
import brand from "../../assets/brand.svg";
import { useState } from "react";

function DrawerComponent({ drawerWidth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleStyleDrawer = (xs, sm) => {
    return {
      display: { xs: xs, sm: sm },
      "& .MuiDrawer-paper": {
        boxSizing: "border-box",
        width: drawerWidth,
        backgroundColor: theme.palette.background.paper,
        backgroundImage: "none",
        borderRight: `1px solid ${theme.palette.divider}`,
      },
    };
  };
  return (
    <>
      {/* Navbar para vista movil */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: "block", sm: "none" },
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ marginRight: 1, color: theme.palette.text.primary }}
                aria-label="open drawer"
              >
                <FaBars />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: theme.palette.text.primary }}
              >
                Araguaney
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={brand} alt="Brand" style={{ width: 24, height: 24 }} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Drawer en vista movil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={handleStyleDrawer("block", "none")}
        >
          <MenuItemsDrawer />
        </Drawer>
        {/* Drawer en vista web */}
        <Drawer
          variant="permanent"
          sx={handleStyleDrawer("none", "block")}
          open
        >
          <MenuItemsDrawer />
        </Drawer>
      </Box>
    </>
  );
}

export default DrawerComponent;
