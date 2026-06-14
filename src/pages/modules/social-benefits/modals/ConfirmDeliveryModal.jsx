import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";

function ConfirmDeliveryModal({ open, onClose, onConfirm, benefitType, beneficiaryName }) {
  const [quantity, setQuantity] = useState(1);
  const [cylinders, setCylinders] = useState([{ cylinder_code: "", weight_kg: "" }]);
  const [quantityError, setQuantityError] = useState("");
  const [duplicateError, setDuplicateError] = useState("");

  const handleClose = () => {
    setQuantity(1);
    setCylinders([{ cylinder_code: "", weight_kg: "" }]);
    setQuantityError("");
    setDuplicateError("");
    onClose();
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    
    if (value < 0) {
      setQuantityError("La cantidad no puede ser menor a 0");
      return;
    }
    
    if (value > 10) {
      setQuantityError("La cantidad no puede ser mayor a 10");
      return;
    }
    
    setQuantityError("");
    const newQuantity = value || 1;
    setQuantity(newQuantity);
    
    // Adjust cylinders array based on quantity
    if (newQuantity > cylinders.length) {
      // Add new cylinders
      const newCylinders = [...cylinders];
      for (let i = cylinders.length; i < newQuantity; i++) {
        newCylinders.push({ cylinder_code: "", weight_kg: "" });
      }
      setCylinders(newCylinders);
    } else if (newQuantity < cylinders.length) {
      // Remove excess cylinders
      setCylinders(cylinders.slice(0, newQuantity));
    }
  };

  const handleCylinderChange = (index, field, value) => {
    const newCylinders = [...cylinders];
    newCylinders[index][field] = value;
    setCylinders(newCylinders);
    
    // Check for duplicates when changing cylinder_code
    if (field === "cylinder_code") {
      const codes = newCylinders.map(c => c.cylinder_code).filter(c => c !== "");
      const uniqueCodes = new Set(codes);
      if (codes.length !== uniqueCodes.size) {
        setDuplicateError("Los números de bombona deben ser únicos");
      } else {
        setDuplicateError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate quantity
    if (quantity < 0 || quantity > 10) {
      setQuantityError("La cantidad debe estar entre 0 y 10");
      return;
    }
    
    // Validate duplicate cylinder codes for gas
    if (isGas) {
      const codes = cylinders.map(c => c.cylinder_code).filter(c => c !== "");
      const uniqueCodes = new Set(codes);
      if (codes.length !== uniqueCodes.size) {
        setDuplicateError("Los números de bombona deben ser únicos");
        return;
      }
    }
    
    if (benefitType === "Gas Comunal") {
      onConfirm(quantity, cylinders);
    } else {
      onConfirm(quantity, null);
    }
    setQuantity(1);
    setCylinders([{ cylinder_code: "", weight_kg: "" }]);
    setQuantityError("");
    setDuplicateError("");
  };

  const isGas = benefitType === "Gas Comunal";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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
              onChange={handleQuantityChange}
              required
              error={!!quantityError}
              helperText={quantityError || "Máximo 10 unidades"}
              inputProps={{ min: 0, max: 10 }}
            />
            {isGas && (
              <Box className="flex flex-col gap-3">
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Detalle de Bombonas
                </Typography>
                {duplicateError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {duplicateError}
                  </Alert>
                )}
                {cylinders.map((cylinder, index) => (
                  <Box key={index} className="flex gap-2">
                    <TextField
                      label={`Número de Bombona ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={cylinder.cylinder_code}
                      onChange={(e) => handleCylinderChange(index, "cylinder_code", e.target.value)}
                      required
                      error={!!duplicateError}
                    />
                    <TextField
                      label="Peso (kg)"
                      variant="outlined"
                      select
                      fullWidth
                      value={cylinder.weight_kg}
                      onChange={(e) => handleCylinderChange(index, "weight_kg", e.target.value)}
                      required
                    >
                      <MenuItem value={10}>10 kg</MenuItem>
                      <MenuItem value={18}>18 kg</MenuItem>
                      <MenuItem value={27}>27 kg</MenuItem>
                      <MenuItem value={43}>43 kg</MenuItem>
                    </TextField>
                  </Box>
                ))}
              </Box>
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
