import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { validateProjectName, validateEstimatedCost } from "../../../../utils/functions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function ProjectManagement({
  openModal,
  handleCloseModal,
  editingProject,
  projectForm,
  setProjectForm,
  onSave,
}) {

  const nameError = validateProjectName(projectForm.name);
  const descriptionError = !projectForm.description.trim() ? "Este campo es requerido" : "";
  const costError = validateEstimatedCost(projectForm.estimated_cost);
  const startDateError = !projectForm.start_date ? "Este campo es requerido" : "";
  const statusError = !projectForm.status ? "Este campo es requerido" : "";

  const hasErrors =
    !!nameError ||
    !!descriptionError ||
    !!costError ||
    !!startDateError ||
    !!statusError;
  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ fontWeight: "bold", borderBottom: 1, borderColor: "divider" }}
      >
        {editingProject ? "Editar Proyecto" : "Nuevo Proyecto Comunitario"}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre del Proyecto"
            value={projectForm.name}
            onChange={(e) =>
              setProjectForm((p) => ({ ...p, name: e.target.value }))
            }
            error={!!nameError}
            helperText={nameError || ""}
            fullWidth
            required
          />
          <TextField
            label="Descripción"
            multiline
            rows={3}
            value={projectForm.description}
            onChange={(e) =>
              setProjectForm((p) => ({ ...p, description: e.target.value }))
            }
            error={!!descriptionError}
            helperText={descriptionError || ""}
            fullWidth
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Costo Estimado"
              value={projectForm.estimated_cost}
              onChange={(e) =>
                setProjectForm((p) => ({ ...p, estimated_cost: e.target.value }))
              }
              error={!!costError}
              helperText={costError || ""}
              fullWidth
              required
            />
            <DatePicker
              label="Fecha de Inicio"
              value={projectForm.start_date ? dayjs(projectForm.start_date) : null}
              onChange={(newValue) =>
                setProjectForm((p) => ({
                  ...p,
                  start_date: newValue ? newValue.format("YYYY-MM-DD") : "",
                }))
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!startDateError,
                  helperText: startDateError || "",
                },
              }}
            />
          </Box>
          <FormControl fullWidth error={!!statusError}>
            <InputLabel id="project-status-label">Estado del Proyecto</InputLabel>
            <Select
              labelId="project-status-label"
              value={projectForm.status}
              label="Estado del Proyecto"
              onChange={(e) =>
                setProjectForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="in_progress">En Proceso</MenuItem>
              <MenuItem value="completed">Completado</MenuItem>
            </Select>
            {!!statusError && <FormHelperText>{statusError}</FormHelperText>}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={hasErrors}
        >
          {editingProject ? "Guardar Cambios" : "Registrar Proyecto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectManagement;
