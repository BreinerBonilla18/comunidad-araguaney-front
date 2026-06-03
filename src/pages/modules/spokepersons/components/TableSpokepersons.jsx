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
  Chip,
} from "@mui/material";
import { useMemo } from "react";
import { FaUserMinus } from "react-icons/fa";

function TableSpokepersons({ spokepersons, onRemove, loading }) {
  const sortedSpokepersons = useMemo(() => {
    return [...spokepersons].sort((a, b) => {
      if (a.rank === "main" && b.rank !== "main") return -1;
      if (a.rank !== "main" && b.rank === "main") return 1;
      return 0; // Mantienen su orden relativo si son del mismo rango
    });
  }, [spokepersons]);
  return (
    <TableContainer sx={{ borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nombre Completo</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cédula</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cargo</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Posición</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSpokepersons.map((spokeperson) => {
          const isMainSpokesperson = spokeperson.rank == "main"
          return (
            <TableRow key={spokeperson.id} hover>
              <TableCell>
                {spokeperson.first_name + " " + spokeperson.last_name}
              </TableCell>
              <TableCell>{spokeperson.id_number}</TableCell>
              <TableCell>{spokeperson.position}</TableCell>
              <TableCell>
                  <Chip
                    label={isMainSpokesperson ? "Principal" : "Secundario"}
                    size="small"
                    color={isMainSpokesperson ? "primary" : "light"}
                    variant="outlined"
                  />
              </TableCell>
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
          )})}
          {spokepersons.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
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
