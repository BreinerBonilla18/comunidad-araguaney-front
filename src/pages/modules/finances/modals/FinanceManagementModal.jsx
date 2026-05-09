import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function FinanceManagementModal({
  openModal,
  handleCloseModal,
  financeForm,
  setFinanceForm,
  onSave,
}) {
  const descriptionError = !financeForm.description.trim() ? "La descripción es requerida" : "";
  const typeError = !financeForm.transaction_type ? "El tipo de movimiento es requerido" : "";
  const amountError = !financeForm.amount || financeForm.amount <= 0 ? "El monto debe ser mayor a 0" : "";
  const dateError = !financeForm.transaction_date ? "La fecha es requerida" : "";

  const hasErrors = !!descriptionError || !!typeError || !!amountError || !!dateError;

  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ fontWeight: "bold", borderBottom: 1, borderColor: "divider" }}
      >
        Registrar Movimiento Financiero
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4 pt-4">
          <TextField
            fullWidth
            label="Descripción"
            variant="outlined"
            value={financeForm.description}
            onChange={(e) =>
              setFinanceForm((p) => ({ ...p, description: e.target.value }))
            }
            error={!!descriptionError}
            helperText={descriptionError}
            required
          />
          <Box className="grid grid-cols-2 gap-4">
            <FormControl fullWidth error={!!typeError} required>
              <InputLabel>Tipo Movimiento</InputLabel>
              <Select
                value={financeForm.transaction_type}
                label="Tipo Movimiento"
                onChange={(e) =>
                  setFinanceForm((p) => ({
                    ...p,
                    transaction_type: e.target.value,
                  }))
                }
              >
                <MenuItem value="income">Ingreso</MenuItem>
                <MenuItem value="expense">Egreso</MenuItem>
              </Select>
              {!!typeError && <FormHelperText>{typeError}</FormHelperText>}
            </FormControl>
            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={financeForm.amount}
              onChange={(e) =>
                setFinanceForm((p) => ({ ...p, amount: e.target.value }))
              }
              error={!!amountError}
              helperText={amountError}
              required
            />
          </Box>
          <Box className="grid grid-cols-1 gap-4">
            <DatePicker
              label="Fecha"
              value={
                financeForm.transaction_date
                  ? dayjs(financeForm.transaction_date)
                  : null
              }
              onChange={(newValue) =>
                setFinanceForm((p) => ({
                  ...p,
                  transaction_date: newValue ? newValue.format("YYYY-MM-DD") : "",
                }))
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!dateError,
                  helperText: dateError,
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleCloseModal} color="inherit">
          Cancelar
        </Button>
        <Button variant="contained" onClick={onSave} disabled={hasErrors}>
          Guardar Registro
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FinanceManagementModal;
