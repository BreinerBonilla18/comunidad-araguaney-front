import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { normalizeText } from "../../../../utils/functions";

function FamilyHeadManagement({
  headDialogMode,
  headDialogOpen,
  setHeadDialogOpen,
  headForm,
  setHeadForm,
}) {
  return (
    <Dialog
      open={headDialogOpen}
      onClose={() => setHeadDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {headDialogMode === "create"
          ? "Registrar jefe de familia"
          : "Editar jefe de familia"}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-3 pt-3">
        <TextField
          label="Nombre y apellido"
          value={headForm.fullName}
          onChange={(e) =>
            setHeadForm((p) => ({ ...p, fullName: e.target.value }))
          }
          fullWidth
          required
        />
        <TextField
          label="Cédula"
          value={headForm.documentId}
          onChange={(e) =>
            setHeadForm((p) => ({ ...p, documentId: e.target.value }))
          }
          fullWidth
          required
        />
        <TextField
          label="Teléfono"
          value={headForm.phone}
          onChange={(e) =>
            setHeadForm((p) => ({ ...p, phone: e.target.value }))
          }
          fullWidth
        />
        <TextField
          label="Dirección"
          value={headForm.address}
          onChange={(e) =>
            setHeadForm((p) => ({ ...p, address: e.target.value }))
          }
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setHeadDialogOpen(false)}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => setHeadDialogOpen(false)}
          disabled={
            !normalizeText(headForm.fullName) ||
            !normalizeText(headForm.documentId)
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FamilyHeadManagement;
