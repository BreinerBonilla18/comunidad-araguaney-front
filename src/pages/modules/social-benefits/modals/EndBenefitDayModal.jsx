import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

function EndBenefitDayModal({ openEndModal, setOpenEndModal, onConfirm }) {
  return (
    <Dialog open={openEndModal} onClose={() => setOpenEndModal(false)}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Finalizar Jornada</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          ¿Estás seguro de que deseas finalizar la jornada actual? Esta acción
          cerrará la sesión de entregas para todos los beneficiarios.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => setOpenEndModal(false)}
        >
          Cancelar
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Sí, Finalizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EndBenefitDayModal;
