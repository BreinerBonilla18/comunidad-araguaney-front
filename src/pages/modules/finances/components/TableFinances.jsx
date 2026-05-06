import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

function TableFinances({ filteredTransactions }) {
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
          <TableCell align="right" sx={{ fontWeight: "bold" }}>
            Monto
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredTransactions.map((t) => (
          <TableRow key={t.id} hover>
            <TableCell>{t.date}</TableCell>
            <TableCell sx={{ fontWeight: "medium" }}>{t.description}</TableCell>
            <TableCell>{t.category}</TableCell>
            <TableCell>
              <Chip
                icon={
                  t.type === "ingreso" ? (
                    <FaArrowUp size={10} />
                  ) : (
                    <FaArrowDown size={10} />
                  )
                }
                label={t.type.toUpperCase()}
                size="small"
                color={t.type === "ingreso" ? "success" : "error"}
                variant="outlined"
              />
            </TableCell>
            <TableCell align="right">
              <Typography
                color={t.type === "ingreso" ? "success.main" : "error.main"}
                sx={{ fontWeight: "bold" }}
              >
                {t.type === "ingreso" ? "+" : "-"} Bs {t.amount.toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
        {filteredTransactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
              No hay movimientos financieros que coincidan con la búsqueda.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableFinances;
