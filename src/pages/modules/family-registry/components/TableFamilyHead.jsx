import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { useAuth } from "../../../../hooks/useAuth";

function TableFamilyHead({
  filteredFamilies,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  selectedFamilyId,
  setSelectedFamilyId,
  openEditHead,
  openDeleteHead,
}) {
  const { isAdmin } = useAuth();
  return (
    <Paper className="p-3" variant="outlined">
      <Box className="flex items-center justify-between gap-2 mb-7">
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Jefes de familia
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {totalCount}
        </Typography>
      </Box>

      <Box sx={{ height: 400, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Jefe</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFamilies.map((family) => {
            const isSelected = family.id === selectedFamilyId;
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
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  {isAdmin && (
                    <>
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
                        onClick={() => openDeleteHead(family)}
                      >
                        <FaRegTrashAlt />
                      </IconButton>
                    </>
                  )}
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
      </Box>
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
    </Paper>
  );
}

export default TableFamilyHead;
