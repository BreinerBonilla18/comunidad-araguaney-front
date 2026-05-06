import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { normalizeText } from "../../../../utils/functions";

function MemberManagementModal({memberDialogOpen, setMemberDialogOpen, setMemberForm, memberForm}) {
  return (
    <Dialog
      open={memberDialogOpen}
      onClose={() => setMemberDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Registrar / editar miembro</DialogTitle>

      <DialogContent className="flex flex-col gap-3 pt-3">
        <TextField
          label="Nombre y apellido"
          value={memberForm.fullName}
          onChange={(e) =>
            setMemberForm((p) => ({ ...p, fullName: e.target.value }))
          }
          fullWidth
          required
        />
        <TextField
          label="Cédula"
          value={memberForm.documentId}
          onChange={(e) =>
            setMemberForm((p) => ({ ...p, documentId: e.target.value }))
          }
          fullWidth
          required
        />
        <TextField
          label="Teléfono"
          value={memberForm.phone}
          onChange={(e) =>
            setMemberForm((p) => ({ ...p, phone: e.target.value }))
          }
          fullWidth
        />
        <TextField
          label="Rol (ej: Miembro, Adulto mayor, Niño...)"
          value={memberForm.role}
          onChange={(e) =>
            setMemberForm((p) => ({ ...p, role: e.target.value }))
          }
          fullWidth
        />
        <TextField
          label="Parentesco (ej: Hijo, Esposa, Hermano...)"
          value={memberForm.relationship}
          onChange={(e) =>
            setMemberForm((p) => ({ ...p, relationship: e.target.value }))
          }
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setMemberDialogOpen(false)}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => setMemberDialogOpen(false)}
          disabled={
            !normalizeText(memberForm.fullName) ||
            !normalizeText(memberForm.documentId)
          }
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MemberManagementModal;
