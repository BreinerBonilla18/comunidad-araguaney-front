import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FaBoxOpen, FaFire } from "react-icons/fa";

function StartBenefitDayModal({
  openStartModal,
  setOpenStartModal,
  handleStartJornada,
}) {
  return (
    <Dialog open={openStartModal} onClose={() => setOpenStartModal(false)}>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Iniciar Jornada de Beneficio
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          Seleccione el tipo de beneficio a entregar hoy:
        </Typography>
        <Box className="flex flex-col gap-3 mt-3">
          <Button
            variant="outlined"
            startIcon={<FaFire />}
            fullWidth
            sx={{ py: 2, justifyContent: "flex-start" }}
            onClick={() => handleStartJornada("Gas Comunal")}
          >
            Bombonas de Gas
          </Button>
          <Button
            variant="outlined"
            startIcon={<FaBoxOpen />}
            fullWidth
            sx={{ py: 2, justifyContent: "flex-start" }}
            onClick={() => handleStartJornada("CLAP")}
          >
            Bolsa/Caja CLAP
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenStartModal(false)}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default StartBenefitDayModal;
