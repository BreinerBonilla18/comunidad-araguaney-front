import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import {
  FaUsers,
  FaProjectDiagram,
  FaHandHoldingHeart,
  FaWallet,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import brand from "../../../assets/brand.svg";

function Dashboard() {
  const stats = [
    {
      title: "Familias Registradas",
      value: "156",
      icon: <FaUsers size={24} />,
      color: "#3b82f6",
      link: "/family-registry",
    },
    {
      title: "Proyectos Activos",
      value: "4",
      icon: <FaProjectDiagram size={24} />,
      color: "#f59e0b",
      link: "/proyectos",
    },
    {
      title: "Documentos Almacenados",
      value: "5",
      icon: <FaFileAlt size={24} />,
      color: "#10b981",
      link: "/documentos",
    },
    {
      title: "Saldo Comunitario",
      value: "Bs 12,450",
      icon: <FaWallet size={24} />,
      color: "#8b5cf6",
      link: "/finanzas",
    },
  ];

  return (
    <Box className="w-full">
      {/* Welcome Section */}
      <Box className="mb-8 p-8 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 relative overflow-hidden">
        <Box className="relative z-10">
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            ¡Bienvenidos a la Comunidad Araguaney!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "600px" }}
          >
            Gestiona de manera eficiente el registro de familias, beneficios
            sociales, finanzas y mucho más desde un solo lugar.
          </Typography>
        </Box>
        <img
          src={brand}
          alt="Brand"
          width={200}
          className="absolute -bottom-10 -right-10 opacity-5 rotate-12"
        />
      </Box>
      <Box className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <Paper
            key={index}
            className="p-5 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-default"
            sx={{ borderRadius: "1rem" }}
          >
            <Box className="flex justify-between items-start">
              <Box
                className="p-2 rounded-lg flex items-center justify-center"
                sx={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              {stat.title}
            </Typography>
            <Button
              component={Link}
              to={stat.link}
              size="small"
              variant="text"
              sx={{
                mt: 1,
                textTransform: "none",
                justifyContent: "flex-start",
                color: stat.color,
                p: 0,
                "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
              }}
              endIcon={<FaArrowRight size={10} />}
            >
              Ver detalles
            </Button>
          </Paper>
        ))}
      </Box>

      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Paper className="p-6" sx={{ borderRadius: "1rem" }}>
          <Box className="flex justify-between items-center mb-4">
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginRight: 6 }}
            >
              Proyectos en Curso
            </Typography>
            <Button
              component={Link}
              to="/proyectos"
              size="small"
              sx={{ textTransform: "none" }}
            >
              Ver todos
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box className="flex flex-col gap-4">
            {[
              {
                name: "Iluminación Sector Centro",
                progress: 75,
                date: "10 Mar",
              },
              {
                name: "Reparación de Tubería Bloque 3",
                progress: 40,
                date: "15 Feb",
              },
              {
                name: "Pintura de Fachada Principal",
                progress: 20,
                date: "05 Mar",
              },
            ].map((proj, i) => (
              <Box
                key={i}
                className="p-4 rounded-xl border border-brand-primary flex justify-between items-center"
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {proj.name}
                  </Typography>
                  <Typography variant="caption" className="text-brand-primary">
                    Iniciado el {proj.date}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
        <Paper
          className="p-6 h-full flex flex-col"
          sx={{ borderRadius: "1rem" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4 }}>
            Atajos Rápidos
          </Typography>
          <Box className="grid grid-cols-2 gap-3 flex-1">
            {[
              {
                label: "Cargar Gasto",
                icon: <FaWallet />,
                link: "/finanzas",
                color: "#8b5cf6",
              },
              {
                label: "Subir Documento",
                icon: <FaFileAlt />,
                link: "/documentos",
                color: "#64748b",
              },
              {
                label: "Emitir Constancia",
                icon: <FaFileAlt />,
                link: "/constancias",
                color: "#3b82f6",
              },
              {
                label: "Nueva Jornada",
                icon: <FaHandHoldingHeart />,
                link: "/beneficios",
                color: "#10b981",
              },
            ].map((action, i) => (
              <Button
                key={i}
                component={Link}
                to={action.link}
                variant="outlined"
                className="flex flex-col gap-2 p-4"
                sx={{
                  height: "100%",
                  borderRadius: "1rem",
                  borderStyle: "dashed",
                  color: "text.primary",
                  textTransform: "none",
                  borderColor: action.color,
                  backgroundColor: `${action.color}05`,
                  "&:hover": {
                    backgroundColor: `${action.color}15`
                  },
                }}
              >
                <Box sx={{ color: action.color, fontSize: 24 }}>{action.icon}</Box>
                <Typography variant="caption">
                  {action.label}
                </Typography>
              </Button>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;
