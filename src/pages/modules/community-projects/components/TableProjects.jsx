import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

function TableProjects({ filteredProjects, handleOpenModal }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completado":
        return "success";
      case "En ejecución":
        return "primary";
      case "Pendiente":
        return "warning";
      default:
        return "default";
    }
  };
  return (
    <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Nombre del Proyecto</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Presupuesto</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Fecha Inicio</TableCell>
          <TableCell align="right" sx={{ fontWeight: "bold" }}>
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredProjects.map((project) => (
          <TableRow key={project.id} hover>
            <TableCell sx={{ fontWeight: "medium" }}>{project.name}</TableCell>
            <TableCell sx={{ maxWidth: 300 }}>
              <Typography variant="body2" noWrap title={project.description}>
                {project.description}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip
                label={project.status}
                size="small"
                color={getStatusColor(project.status)}
                variant="outlined"
              />
            </TableCell>
            <TableCell>{project.budget}</TableCell>
            <TableCell>{project.startDate}</TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={() => handleOpenModal(project)}>
                <FaEdit />
              </IconButton>
              <IconButton size="small">
                <FaRegTrashAlt />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        {filteredProjects.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
              No se encontraron proyectos comunitarios registrados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableProjects;
