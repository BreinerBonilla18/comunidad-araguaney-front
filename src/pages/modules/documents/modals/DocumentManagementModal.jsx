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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FaCloudUploadAlt } from "react-icons/fa";

function DocumentManagementModal({
  openModal,
  handleCloseModal,
  editingDoc,
  documentForm,
  setDocumentForm,
  onSave,
}) {
  const titleError = !documentForm.title.trim() ? "El título es requerido" : "";
  const dateError = !documentForm.document_date ? "La fecha es requerida" : "";
  const fileError =
    !editingDoc && !documentForm.file ? "El archivo es requerido" : "";

  const hasErrors = !!titleError || !!dateError || !!fileError;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentForm((p) => ({ ...p, file: file }));
    }
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ fontWeight: "bold", borderBottom: 1, borderColor: "divider" }}
      >
        {editingDoc ? "Editar Documento" : "Subir Nuevo Documento"}
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4 pt-4">
          <TextField
            fullWidth
            label="Título"
            variant="outlined"
            value={documentForm.title}
            onChange={(e) =>
              setDocumentForm((p) => ({ ...p, title: e.target.value }))
            }
            error={!!titleError}
            helperText={titleError}
            required
          />
          <DatePicker
            label="Fecha del Documento"
            value={
              documentForm.document_date
                ? dayjs(documentForm.document_date)
                : null
            }
            onChange={(newValue) =>
              setDocumentForm((p) => ({
                ...p,
                document_date: newValue ? newValue.format("YYYY-MM-DD") : "",
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
          <Box className="flex flex-col gap-1">
            <Typography variant="caption" color="text.secondary">
              Seleccionar Archivo {editingDoc && "(Opcional)"}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<FaCloudUploadAlt />}
              sx={{
                borderStyle: "dashed",
                py: 2,
                color: fileError ? "error.main" : "primary.main",
                borderColor: fileError ? "error.main" : "primary.main",
              }}
            >
              {documentForm.file ? documentForm.file.name : "Elegir Archivo"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {fileError && (
              <Typography variant="caption" color="error">
                {fileError}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleCloseModal} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={hasErrors}
          sx={{ px: 4 }}
        >
          {editingDoc ? "Guardar Cambios" : "Subir Archivo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentManagementModal;
