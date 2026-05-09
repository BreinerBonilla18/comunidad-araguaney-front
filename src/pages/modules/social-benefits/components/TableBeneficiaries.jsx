import {
  Checkbox,
  Chip,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function TableBeneficiaries({
  filteredBeneficiaries,
  handleToggleStatus,
  isJornadaActive,
}) {
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Nombre Completo</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Cédula</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
          <TableCell align="right" sx={{ fontWeight: "bold" }}>
            Acción
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredBeneficiaries.map((b) => (
          <TableRow key={b.id} hover>
            <TableCell>{b.name}</TableCell>
            <TableCell>{b.documentId}</TableCell>
            <TableCell>
              <Chip
                icon={
                  b.status === "delivered" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )
                }
                label={b.status === "delivered" ? "Entregado" : "Pendiente"}
                color={b.status === "delivered" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </TableCell>
            <TableCell align="right">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={b.status === "delivered"}
                    onChange={() => handleToggleStatus(b.id, b.status)}
                    disabled={!isJornadaActive}
                  />
                }
                label={
                  b.status === "delivered"
                    ? "Marcar Pendiente"
                    : "Marcar Entregado"
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableBeneficiaries;
