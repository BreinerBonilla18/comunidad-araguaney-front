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
                  b.status === "entregado" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )
                }
                label={b.status === "entregado" ? "Entregado" : "Pendiente"}
                color={b.status === "entregado" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </TableCell>
            <TableCell align="right">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={b.status === "entregado"}
                    onChange={() => handleToggleStatus(b.id)}
                    disabled={!isJornadaActive}
                  />
                }
                label={
                  b.status === "entregado"
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
