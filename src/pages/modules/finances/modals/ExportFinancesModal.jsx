import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

function ExportFinancesModal({
  openModal,
  handleCloseModal,
  onExportPDF,
  onExportExcel,
  loading,
}) {
  const [timePeriod, setTimePeriod] = useState("all");
  const [transactionType, setTransactionType] = useState("all");

  const handleExportPDF = () => {
    onExportPDF(timePeriod, transactionType);
  };

  const handleExportExcel = () => {
    onExportExcel(timePeriod, transactionType);
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Exportar Finanzas
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Seleccione los filtros para exportar los datos:
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel id="time-period-label">Período de Tiempo</InputLabel>
            <Select
              labelId="time-period-label"
              value={timePeriod}
              label="Período de Tiempo"
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <MenuItem value="all">Todo el historial</MenuItem>
              <MenuItem value="3months">Últimos 3 meses</MenuItem>
              <MenuItem value="6months">Últimos 6 meses</MenuItem>
              <MenuItem value="1year">Último año</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="transaction-type-label">Tipo de Transacción</InputLabel>
            <Select
              labelId="transaction-type-label"
              value={transactionType}
              label="Tipo de Transacción"
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="income">Solo Ingresos</MenuItem>
              <MenuItem value="expense">Solo Egresos</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button
          variant="outlined"
          onClick={handleExportExcel}
          disabled={loading}
        >
          Exportar Excel
        </Button>
        <Button
          variant="contained"
          onClick={handleExportPDF}
          disabled={loading}
        >
          Exportar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExportFinancesModal;
