import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

function FinanceManagementModal({ openModal, setOpenModal }) {
  return (
    <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{ fontWeight: "bold", borderBottom: 1, borderColor: "divider" }}
      >
        Registrar Movimiento Financiero
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4 pt-4">
          <TextField fullWidth label="Descripción" variant="outlined" />
          <Box className="grid grid-cols-2 gap-4">
            <TextField select fullWidth label="Tipo Movimiento">
              <MenuItem value="ingreso">Ingreso</MenuItem>
              <MenuItem value="egreso">Egreso</MenuItem>
            </TextField>
            <TextField fullWidth label="Monto" type="number" />
          </Box>
          <Box className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Categoría"
              placeholder="Ej: Servicios, Aportes..."
            />
            <TextField
              fullWidth
              type="date"
              label="Fecha"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={() => setOpenModal(false)} color="inherit">
          Cancelar
        </Button>
        <Button variant="contained" onClick={() => setOpenModal(false)}>
          Guardar Registro
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FinanceManagementModal;
