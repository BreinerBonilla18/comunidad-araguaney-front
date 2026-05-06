import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

function ProjectManagement({ openModal, handleCloseModal, editingProject }) {
  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ fontWeight: "bold", borderBottom: 1, borderColor: "divider" }}
      >
        {editingProject ? "Editar Proyecto" : "Nuevo Proyecto Comunitario"}
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4 pt-4">
          <TextField
            fullWidth
            label="Nombre del Proyecto"
            defaultValue={editingProject?.name || ""}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            defaultValue={editingProject?.description || ""}
            variant="outlined"
          />
          <Box className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Presupuesto Estimado"
              defaultValue={editingProject?.budget || ""}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Fecha de Inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              defaultValue={editingProject?.startDate || ""}
              variant="outlined"
            />
          </Box>
          <TextField
            fullWidth
            select
            label="Estado del Proyecto"
            SelectProps={{ native: true }}
            defaultValue={editingProject?.status || "Pendiente"}
            variant="outlined"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En ejecución">En ejecución</option>
            <option value="Completado">Completado</option>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleCloseModal} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          className="bg-brand-primary"
          onClick={handleCloseModal}
          sx={{ px: 4 }}
        >
          {editingProject ? "Guardar Cambios" : "Registrar Proyecto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectManagement;
