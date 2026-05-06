import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FaCheckCircle, FaFileDownload } from "react-icons/fa";

function EndBenefitDayModal({
  setOpenEndModal,
  resetJornada,
  openEndModal,
  stats,
}) {
  return (
    <Dialog open={openEndModal} onClose={() => setOpenEndModal(false)}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Jornada Finalizada</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col items-center gap-4 py-4">
          <FaCheckCircle size={48} className="text-green-500" />
          <Typography variant="body1" align="center">
            Se han completado <strong>{stats.delivered}</strong> entregas de un
            total de <strong>{stats.total}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            ¿Desea descargar el reporte de la jornada en formato PDF/Excel antes
            de cerrar?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button variant="outlined" onClick={resetJornada}>
          No, solo cerrar
        </Button>
        <Button
          variant="contained"
          startIcon={<FaFileDownload />}
          onClick={() => {
            alert("Descargando documento...");
            resetJornada();
          }}
        >
          Si, descargar y cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EndBenefitDayModal;
