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
  Typography,
} from "@mui/material";
import { FaEdit, FaPlus, FaRegTrashAlt } from "react-icons/fa";

function TableMembers({ selectedFamily, openCreateMember, openEditMember }) {
  return (
    <Paper className="p-3" variant="outlined">
      <Box className="flex items-center justify-between gap-2 mb-2">
        <Box className="flex flex-col">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Miembros del grupo familiar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedFamily
              ? `Jefe: ${selectedFamily?.head?.fullName ?? ""}`
              : "Selecciona un jefe de familia"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={openCreateMember}
          disabled={!selectedFamily}
        >
          Nuevo miembro
        </Button>
      </Box>

      <Table size="small" stickyHeader>
        <TableHead >
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(selectedFamily?.members ?? []).map((member) => (
            <TableRow key={member.id} hover>
              <TableCell>{member.fullName ?? ""}</TableCell>
              <TableCell>{member.documentId ?? ""}</TableCell>
              <TableCell>{member.role ?? ""}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => openEditMember(member)}>
                  <FaEdit />
                </IconButton>
                <IconButton size="small" onClick={() => {}}>
                  <FaRegTrashAlt />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {selectedFamily && (selectedFamily.members ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Este grupo familiar no tiene miembros
              </TableCell>
            </TableRow>
          ) : null}
          {!selectedFamily ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Selecciona un jefe para ver/gestionar miembros
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default TableMembers;
