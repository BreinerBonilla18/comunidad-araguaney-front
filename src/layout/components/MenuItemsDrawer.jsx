import {
  FaDollarSign,
  FaFileAlt,
  FaFolder,
  FaHandsHelping,
  FaProjectDiagram,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from "@mui/material";
import brand from "../../assets/brand.svg";
import { useNavigate } from "react-router-dom";

function MenuItemsDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { text: "Dashboard", icon: <BiSolidDashboard />, path: "/dashboard" },
    {
      text: "Registro de familias",
      icon: <FaUsers />,
      path: "/family-registry",
    },
    {
      text: "Beneficios sociales",
      icon: <FaHandsHelping />,
      path: "/beneficios",
    },
    {
      text: "Proyectos comunitarios",
      icon: <FaProjectDiagram />,
      path: "/proyectos",
    },
    { text: "Constancias", icon: <FaFileAlt />, path: "/constancias" },
    { text: "Documentos", icon: <FaFolder />, path: "/documentos" },
    { text: "Finanzas", icon: <FaDollarSign />, path: "/finanzas" },
  ];

  return (
    <div>
      <Toolbar className="mt-2">
        <div className="hidden sm:flex gap-2 items-center justify-between w-full">
          <span
            style={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            Araguaney
          </span>
          <img src={brand} alt="Brand" className="w-6 h-6" />
        </div>
      </Toolbar>

      <List sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
        <Box sx={{ flex: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              onClick={() => navigate(item.path)}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Box>

        <Divider />

        <ListItem disablePadding onClick={handleLogout}>
          <ListItemButton sx={{ "&:hover": { color: "error.main" } }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <FaSignOutAlt />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              sx={{ color: "error.main", fontWeight: "bold" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}

export default MenuItemsDrawer;
