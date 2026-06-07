import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { FaDownload, FaTimes } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function GoodConductCertificateFormModal({
  setOpenGoodConductModal,
  handleExportGoodConduct,
  openGoodConductModal,
  handleInputChange,
  formData,
}) {

  const conductError = !formData.conductDescription || formData.conductDescription.trim() === "" 
    ? "La descripción de conducta es requerida" 
    : "";

  const hasErrors = !!conductError;

  // Función para procesar la descripción de conducta
  const processConductDescription = (description) => {
    if (!description) return "";
    
    // Separar por comas y limpiar espacios
    const words = description.split(',').map(word => word.trim()).filter(word => word !== "");
    
    if (words.length === 0) return "";
    if (words.length === 1) return words[0];
    
    // Reemplazar la última coma con "y"
    const lastWord = words.pop();
    return words.join(", ") + " y " + lastWord;
  };

  return (
    <Dialog
      open={openGoodConductModal}
      onClose={() => setOpenGoodConductModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Generar Constancia de Buena Conducta
        </Typography>
        <IconButton onClick={() => setOpenGoodConductModal(false)}>
          <FaTimes size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Descripción de Conducta"
            name="conductDescription"
            value={formData.conductDescription}
            onChange={handleInputChange}
            error={!!conductError}
            helperText={conductError || "Ingrese palabras separadas por comas (ej. ejemplar, responsable, respetuosa)"}
            placeholder="ejemplar, responsable, respetuosa"
            required
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setOpenGoodConductModal(false)}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            // Procesar la descripción antes de exportar
            const processedData = {
              ...formData,
              documentId: formData.documentId,
              conductDescription: processConductDescription(formData.conductDescription)
            };
            handleExportGoodConduct(processedData);
          }}
          variant="contained"
          startIcon={<FaDownload />}
          disabled={hasErrors}
        >
          Exportar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GoodConductCertificateFormModal;
