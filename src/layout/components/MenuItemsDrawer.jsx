import {
  FaDollarSign,
  FaFileAlt,
  FaFolder,
  FaHandsHelping,
  FaProjectDiagram,
  FaUsers,
} from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from "@mui/material";
import brand from "../../assets/brand.svg";

function MenuItemsDrawer() {
      const theme = useTheme();
  const menuItems = [
    { text: "Dashboard", icon: <BiSolidDashboard />, path: "/dashboard" },
    { text: "Registro de familias", icon: <FaUsers />, path: "/familias" },
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

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
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
      </List>
    </div>
  );
}

export default MenuItemsDrawer;
