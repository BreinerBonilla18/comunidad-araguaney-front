import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

function ExportationArchiveModal({
  exportModalOpen,
  setExportModalOpen,
  exportSelection,
  setExportSelection,
  handleExportAction,
}) {
  return (
    <Dialog
      open={exportModalOpen}
      onClose={() => setExportModalOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Opciones de Exportación</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Seleccione qué información desea incluir en el reporte:
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={exportSelection}
            onChange={(e) => setExportSelection(e.target.value)}
          >
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="Todos los ciudadanos"
            />
            <FormControlLabel
              value="heads"
              control={<Radio />}
              label="Sólo jefes de familia"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExportModalOpen(false)} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleExportAction}
          variant="contained"
          color="primary"
        >
          Exportar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExportationArchiveModal;
