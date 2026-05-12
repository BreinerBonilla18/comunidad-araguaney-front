import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FaUserMinus } from "react-icons/fa";

function TableSpokepersons({
  spokepersons,
  onRemove,
  loading,
}) {
  return (
    <TableContainer sx={{ borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nombre Completo</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cédula</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spokepersons.map((spokeperson) => (
            <TableRow key={spokeperson.id} hover>
              <TableCell>{spokeperson.first_name + " " + spokeperson.last_name}</TableCell>
              <TableCell>{spokeperson.id_number}</TableCell>
              <TableCell align="center">
                <Tooltip title="Desasignar Vocero">
                  <IconButton
                    color="error"
                    onClick={() => onRemove(spokeperson)}
                    disabled={loading}
                  >
                    <FaUserMinus size={18} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {spokepersons.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  No hay voceros asignados actualmente
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableSpokepersons;
