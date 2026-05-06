/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo } from "react";
/* ----------------- icons ----------------- */
import {
  FaProjectDiagram,
  FaFilePdf,
  FaSearch,
  FaPlus,
  FaFileCsv,
} from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import ProjectManagement from "./modals/ProjectManagement";
import TableProjects from "./components/TableProjects";

function Projects() {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Mock data for community projects
  const projects = useMemo(
    () => [
      {
        id: 1,
        name: "Iluminación Sector Centro",
        description: "Instalación de 20 lámparas LED en la calle principal.",
        status: "En ejecución",
        budget: "Bs 500",
        startDate: "2024-03-10",
      },
      {
        id: 2,
        name: "Reparación de Tubería",
        description: "Arreglo de filtración en la entrada del bloque 3.",
        status: "Completado",
        budget: "Bs 150",
        startDate: "2024-02-15",
      },
      {
        id: 3,
        name: "Limpieza de Áreas Verdes",
        description: "Jornada de desmalezamiento y limpieza general.",
        status: "Pendiente",
        budget: "Bs 50",
        startDate: "2024-04-01",
      },
      {
        id: 4,
        name: "Pintura de Fachada",
        description: "Mejoramiento visual de las áreas comunes.",
        status: "En ejecución",
        budget: "Bs 300",
        startDate: "2024-03-05",
      },
    ],
    [],
  );

  const filteredProjects = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.description, p.status].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [projects, query]);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProject(null);
  };

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaProjectDiagram size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Proyectos Comunitarios
            </Typography>
          </Box>

          <Box className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              startIcon={<FaFileCsv />}
              onClick={() => {}}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaFilePdf />}
              onClick={() => {}}
            >
              Exportar PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={() => handleOpenModal()}
            >
              Nuevo Proyecto
            </Button>
          </Box>
        </Box>

        <Paper className="p-4 shadow-sm border border-brand-primary/20">
          <Box className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Buscar proyectos por nombre, descripción o estado..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch className="text-brand-primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Proyectos Registrados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: 4
                </Typography>
              </Box>
              <TableProjects
                filteredProjects={filteredProjects}
                handleOpenModal={handleOpenModal}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>
      <ProjectManagement
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        editingProject={editingProject}
      />
    </Box>
  );
}

export default Projects;
