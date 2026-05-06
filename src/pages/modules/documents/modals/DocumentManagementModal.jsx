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

function DocumentManagementModal({ openModal, handleCloseModal, editingDoc }) {
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
            label="Nombre del Archivo"
            defaultValue={editingDoc?.name || ""}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Categoría"
            defaultValue={editingDoc?.category || ""}
            variant="outlined"
          />
          <Box className="flex flex-col gap-1">
            <Typography variant="caption" color="text.secondary">
              Seleccionar Archivo
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ borderStyle: "dashed", py: 2 }}
            >
              {editingDoc ? "Cambiar Archivo" : "Elegir Archivo"}
              <input type="file" hidden />
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleCloseModal} color="inherit">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleCloseModal} sx={{ px: 4 }}>
          {editingDoc ? "Guardar Cambios" : "Subir Archivo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentManagementModal;
