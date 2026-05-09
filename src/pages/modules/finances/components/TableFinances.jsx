import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatDate } from "../../../../utils/functions";

function TableFinances({
  filteredTransactions,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Monto
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.map((t) => {
            const isIncome = t.transaction_type === "income";
            return (
              <TableRow key={t.id} hover>
                <TableCell>{formatDate(t.transaction_date)}</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>{t.description}</TableCell>
                <TableCell>
                  <Chip
                    icon={isIncome ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    label={isIncome ? "INGRESO" : "EGRESO"}
                    size="small"
                    color={isIncome ? "success" : "error"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={isIncome ? "success.main" : "error.main"}
                    sx={{ fontWeight: "bold" }}
                  >
                    {isIncome ? "+" : "-"} Bs {parseFloat(t.amount || 0).toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredTransactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                No hay movimientos financieros que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </>
  );
}

export default TableFinances;
