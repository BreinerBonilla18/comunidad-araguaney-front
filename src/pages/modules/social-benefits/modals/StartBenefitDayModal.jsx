import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FaBoxOpen, FaFire, FaPlus } from "react-icons/fa";
import { useState } from "react";

function StartBenefitDayModal({
  openStartModal,
  setOpenStartModal,
  handleStartJornada,
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");

  const handleCustomClick = () => {
    setShowCustomInput(true);
  };

  const handleCustomSubmit = () => {
    if (customName.trim()) {
      handleStartJornada(customName.trim());
      setCustomName("");
      setShowCustomInput(false);
    }
  };

  const handleBack = () => {
    setShowCustomInput(false);
    setCustomName("");
  };

  return (
    <Dialog open={openStartModal} onClose={() => setOpenStartModal(false)}>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Iniciar Jornada de Beneficio
      </DialogTitle>
      <DialogContent dividers>
        {!showCustomInput ? (
          <>
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
              <Button
                variant="outlined"
                startIcon={<FaPlus />}
                fullWidth
                sx={{ py: 2, justifyContent: "flex-start" }}
                onClick={handleCustomClick}
              >
                Otro (Personalizado)
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body2" gutterBottom>
              Ingrese el nombre de la jornada personalizada:
            </Typography>
            <TextField
              fullWidth
              label="Nombre de la jornada"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              autoFocus
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {showCustomInput ? (
          <>
            <Button onClick={handleBack}>Volver</Button>
            <Button
              onClick={handleCustomSubmit}
              variant="contained"
              disabled={!customName.trim()}
            >
              Iniciar
            </Button>
          </>
        ) : (
          <Button onClick={() => setOpenStartModal(false)}>Cancelar</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default StartBenefitDayModal;
