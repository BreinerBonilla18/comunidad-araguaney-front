/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo, useEffect, useCallback } from "react";
/* ----------------- icons ----------------- */
import {
  FaProjectDiagram,
  FaFilePdf,
  FaPlus,
  FaFileExcel,
} from "react-icons/fa";
/* ----------------- API ----------------- */
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../api/projects";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
import {
  exportToPDFProjects,
  exportToExcelProjects,
} from "../../../utils/exportUtils";
/* --------------- components -------------- */
import ProjectManagement from "./modals/ProjectManagement";
import TableProjects from "./components/TableProjects";
import ModalDelete from "../../../modals/ModalDelete";
import ModalSuccess from "../../../modals/ModalSucces";
import ModalError from "../../../modals/ModalError";

const emptyProjectForm = {
  name: "",
  description: "",
  estimated_cost: "",
  start_date: "",
  status: "pending",
};

function Projects() {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    title: "",
    message: "",
    id: null,
  });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setProjectForm(
      project
        ? {
            name: project?.name ?? "",
            description: project?.description ?? "",
            estimated_cost: project?.estimated_cost ?? "",
            start_date: project?.start_date ?? "",
            status: project?.status ?? "pending",
          }
        : emptyProjectForm,
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProject(null);
    setProjectForm(emptyProjectForm);
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        name: projectForm.name,
        description: projectForm.description,
        status: projectForm.status,
        estimated_cost: projectForm.estimated_cost,
        start_date: projectForm.start_date,
      };

      if (editingProject) {
        await updateProject(projectData, editingProject.id);
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Proyecto actualizado correctamente",
        });
      } else {
        await createProject(projectData);
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Proyecto creado correctamente",
        });
      }
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo guardar el proyecto",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(deleteModal.id);
      setDeleteModal({ ...deleteModal, open: false });
      setSuccessModal({
        open: true,
        title: "Eliminado",
        message: "Proyecto eliminado correctamente",
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setDeleteModal({ ...deleteModal, open: false });
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo eliminar el proyecto",
      });
    }
  };

  const openDeleteProject = (project) => {
    setDeleteModal({
      open: true,
      title: "¿Eliminar Proyecto?",
      message: `¿Estás seguro de eliminar el proyecto "${project.name}"?`,
      id: project.id,
    });
  };

  const filteredProjects = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const filtered = !q
      ? projects
      : projects.filter((p) =>
          [p.name, p.description, p.status].some((val) =>
            normalizeText(val || "")
              .toLowerCase()
              .includes(q),
          ),
        );
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [projects, query, page, rowsPerPage]);

  const totalFilteredProjects = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return projects.length;

    return projects.filter((p) =>
      [p.name, p.description, p.status].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    ).length;
  }, [projects, query]);

  useEffect(() => {
    setPage(0);
  }, [query]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
              startIcon={<FaFileExcel />}
              onClick={() => exportToExcelProjects(projects)}
              disabled={projects.length === 0}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaFilePdf />}
              onClick={() => exportToPDFProjects(projects)}
              disabled={projects.length === 0}
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

        <Paper className="p-4">
          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Buscar proyectos por nombre, descripción o estado..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Proyectos Registrados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {totalFilteredProjects}
                </Typography>
              </Box>
              <TableProjects
                filteredProjects={filteredProjects}
                totalCount={totalFilteredProjects}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                handleOpenModal={handleOpenModal}
                onDeleteProject={openDeleteProject}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>
      <ProjectManagement
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        editingProject={editingProject}
        projectForm={projectForm}
        setProjectForm={setProjectForm}
        onSave={handleSaveProject}
      />

      <ModalDelete
        openModal={deleteModal.open}
        setOpenModal={(val) => setDeleteModal((p) => ({ ...p, open: val }))}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={handleDeleteConfirm}
      />

      <ModalSuccess
        openModal={successModal.open}
        setOpenModal={(val) => setSuccessModal((p) => ({ ...p, open: val }))}
        title={successModal.title}
        message={successModal.message}
      />

      <ModalError
        openModal={errorModal.open}
        setOpenModal={(val) => setErrorModal((p) => ({ ...p, open: val }))}
        title={errorModal.title}
        message={errorModal.message}
      />
    </Box>
  );
}

export default Projects;
