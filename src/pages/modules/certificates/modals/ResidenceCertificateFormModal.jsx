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
import { validateAddress } from "../../../../utils/functions";

function ResidenceCertificateFormModal({
  setOpenResidencyModal,
  handleExportResidency,
  openResidencyModal,
  handleInputChange,
  formData,
}) {
  // Limpiar la cédula: si tiene "V-", se elimina (se añade en el exportador)
  const cleanDocumentId = (formData.documentId || "").replace(/^V-/i, "");

  const addressError = validateAddress(formData.address);
  const yearsError =
    parseInt(formData.residencyYears) < 0 ? "No puede ser negativo" : "";
  const monthsError =
    parseInt(formData.residencyMonths) < 0 ||
    parseInt(formData.residencyMonths) > 11
      ? "Meses inválidos (0-11)"
      : "";

  const hasErrors = !!addressError || !!yearsError || !!monthsError;

  return (
    <Dialog
      open={openResidencyModal}
      onClose={() => setOpenResidencyModal(false)}
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
          Generar Constancia de Residencia
        </Typography>
        <IconButton onClick={() => setOpenResidencyModal(false)}>
          <FaTimes size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Nombres y Apellidos Completos"
            name="fullName"
            value={formData.fullName}
            InputProps={{ readOnly: true }}
            variant="filled"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Cédula de Identidad"
              name="documentId"
              value={cleanDocumentId}
              InputProps={{ readOnly: true }}
              variant="filled"
            />
            <DatePicker
              label="Fecha de Emisión"
              value={formData.issueDate ? dayjs(formData.issueDate) : null}
              onChange={(newValue) =>
                handleInputChange({
                  target: {
                    name: "issueDate",
                    value: newValue ? newValue.format("YYYY-MM-DD") : "",
                  },
                })
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Dirección de Habitación"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={!!addressError}
            helperText={addressError || ""}
            placeholder="Ej. Calle Principal, Casa #123"
            required
            multiline
            rows={2}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tiempo de Residencia (Años)"
              name="residencyYears"
              type="number"
              value={formData.residencyYears}
              onChange={handleInputChange}
              error={!!yearsError}
              helperText={yearsError}
              required
            />
            <TextField
              fullWidth
              label="Tiempo de Residencia (Meses)"
              name="residencyMonths"
              type="number"
              value={formData.residencyMonths}
              onChange={handleInputChange}
              error={!!monthsError}
              helperText={monthsError}
              required
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setOpenResidencyModal(false)}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            // Aseguramos que pasamos la cédula limpia al exportador
            handleExportResidency({ ...formData, documentId: cleanDocumentId });
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

export default ResidenceCertificateFormModal;
