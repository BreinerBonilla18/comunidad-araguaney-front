import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

function TableFamilyHead({
  filteredFamilies,
  selectedFamilyId,
  setSelectedFamilyId,
  openEditHead,
}) {
  return (
    <Paper className="p-3" variant="outlined">
      <Box className="flex items-center justify-between gap-2 mb-2">
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Jefes de familia
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {filteredFamilies.length}
        </Typography>
      </Box>

      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Jefe</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Miembros</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFamilies.map((family) => {
            const isSelected = family.id === selectedFamilyId;
            const membersCount = Array.isArray(family.members)
              ? family.members.length
              : 0;
            return (
              <TableRow
                key={family.id}
                hover
                selected={isSelected}
                onClick={() => setSelectedFamilyId(family.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{family?.head?.fullName ?? ""}</TableCell>
                <TableCell>{family?.head?.documentId ?? ""}</TableCell>
                <TableCell>{membersCount}</TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    aria-label="Editar"
                    onClick={() => openEditHead(family)}
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="Eliminar"
                    onClick={() => {}}
                  >
                    <FaRegTrashAlt />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredFamilies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No hay registros
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default TableFamilyHead;
