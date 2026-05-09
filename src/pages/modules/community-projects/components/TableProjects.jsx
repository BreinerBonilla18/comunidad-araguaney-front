import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { formatDate } from "../../../../utils/functions";

function TableProjects({ 
  filteredProjects, 
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  handleOpenModal,
  onDeleteProject 
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "pending":
        return "secondary";
      default:
        return "default";
    }
  };
  const getStatusName = (status) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "in_progress":
        return "En Proceso";
      case "pending":
        return "Pendiente";
      default:
        return "default";
    }
  };
  return (
    <>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>
              Nombre del Proyecto
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Costo Estimado</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha Inicio</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id} hover>
              <TableCell sx={{ fontWeight: "medium" }}>
                {project.name}
              </TableCell>
              <TableCell sx={{ maxWidth: 300 }}>
                <Typography variant="body2" noWrap title={project.description}>
                  {project.description}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusName(project.status)}
                  size="small"
                  color={getStatusColor(project.status)}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{project.estimated_cost}</TableCell>
              <TableCell>{formatDate(project.start_date)}</TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton
                  size="small"
                  aria-label="Editar"
                  onClick={() => handleOpenModal(project)}
                >
                  <FaEdit />
                </IconButton>
                <IconButton 
                  size="small" 
                  aria-label="Eliminar"
                  onClick={() => onDeleteProject(project)}
                >
                  <FaRegTrashAlt />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {filteredProjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No se encontraron proyectos comunitarios registrados.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </>
  );
}

export default TableProjects;
