import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";

function ConfirmDeliveryModal({ open, onClose, onConfirm, benefitType, beneficiaryName }) {
  const [quantity, setQuantity] = useState(1);
  const [cylinderNumber, setCylinderNumber] = useState("");

  const handleClose = () => {
    setQuantity(1);
    setCylinderNumber("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(quantity, benefitType === "Gas Comunal" ? cylinderNumber : null);
    setQuantity(1)
  };

  const isGas = benefitType === "Gas Comunal";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Confirmar Entrega para {beneficiaryName}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box className="flex flex-col gap-4">
            <TextField
              label="Cantidad Entregada"
              type="number"
              variant="outlined"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              inputProps={{ min: 1 }}
            />
            {isGas && (
              <TextField
                label="Número de Bombona"
                variant="outlined"
                fullWidth
                value={cylinderNumber}
                onChange={(e) => setCylinderNumber(e.target.value)}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Confirmar Entrega
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ConfirmDeliveryModal;
