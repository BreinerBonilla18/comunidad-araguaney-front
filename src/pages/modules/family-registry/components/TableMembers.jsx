import {
  Box,
  Button,
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
import { FaEdit, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { useAuth } from "../../../../hooks/useAuth";

function TableMembers({ 
  selectedFamily, 
  filteredMembers, 
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  query,
  openCreateMember, 
  openEditMember,
  openDeleteMember 
}) {
  const { isAdmin } = useAuth();
  // Determine if we're in search mode
  const isSearching = query && query.trim() !== '';

  // Use the already paginated members from parent
  const displayMembers = filteredMembers;

  return (
    <Paper className="p-3" variant="outlined">
      <Box className="flex items-center justify-between gap-2 mb-2">
        <Box className="flex flex-col">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {isSearching ? "Miembros encontrados" : "Miembros del grupo familiar"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isSearching 
              ? `Mostrando ${displayMembers.length} miembro(s) encontrado(s)`
              : selectedFamily
              ? `Jefe: ${selectedFamily?.head?.fullName ?? ""}`
              : "Selecciona un jefe de familia"}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            onClick={openCreateMember}
            disabled={!selectedFamily || isSearching}
          >
            Nuevo miembro
          </Button>
        )}
      </Box>

      <Box sx={{ height: 400, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
        <TableHead >
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Cédula</TableCell>
            {isSearching && <TableCell>Jefe de familia</TableCell>}
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayMembers.map((member) => (
            <TableRow key={member.id} hover>
              <TableCell>{member.fullName ?? ""}</TableCell>
              <TableCell>{member.documentId ?? ""}</TableCell>
              {isSearching && <TableCell>{member.familyHeadName ?? ""}</TableCell>}
              <TableCell align="right">
                {isAdmin && (
                  <>
                    <IconButton size="small" onClick={() => openEditMember(member)}>
                      <FaEdit />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDeleteMember(member)}>
                      <FaRegTrashAlt />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {displayMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isSearching ? 4 : 3} align="center">
                {isSearching 
                  ? "No se encontraron miembros con los criterios de búsqueda"
                  : selectedFamily
                  ? "Este grupo familiar no tiene miembros"
                  : "Selecciona un jefe para ver/gestionar miembros"}
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

export default TableMembers;
