import { Box, Toolbar, useTheme } from "@mui/material";
import DrawerComponent from "./components/Drawer";
import { Outlet } from "react-router-dom";

export default function ModulesLayout() {
  const theme = useTheme();
  const drawerWidth = 300;

  return (
    <Box sx={{ display: "flex" }}>
      <DrawerComponent drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Toolbar sx={{ display: { xs: "block", sm: "none" } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
