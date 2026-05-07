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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  normalizeText,
  normalizeVenezuelanDocumentId,
  validateBirthDate,
  validateFullName,
  validateVenezuelanDocumentId,
} from "../../../../utils/functions";

function MemberManagementModal({
  memberDialogOpen,
  setMemberDialogOpen,
  setMemberForm,
  memberForm,
  onSave,
}) {
  const fullNameError = validateFullName(memberForm.fullName);
  const documentIdError = validateVenezuelanDocumentId(memberForm.documentId);
  const genderError = !normalizeText(memberForm.gender)
    ? "Este campo es requerido"
    : "";
  const birthDateError = validateBirthDate(memberForm.birthDate);

  const hasErrors =
    !!fullNameError ||
    !!documentIdError ||
    !!genderError ||
    !!birthDateError;

  return (
    <Dialog
      open={memberDialogOpen}
      onClose={() => setMemberDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Registrar / editar miembro</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre y apellido"
            value={memberForm.fullName}
            onChange={(e) =>
              setMemberForm((p) => ({ ...p, fullName: e.target.value }))
            }
            error={!!fullNameError}
            helperText={fullNameError || ""}
            fullWidth
            required
          />
          <TextField
            label="Cédula"
            value={memberForm.documentId}
            onChange={(e) =>
              setMemberForm((p) => ({ ...p, documentId: e.target.value }))
            }
            onBlur={() => {
              const normalized = normalizeVenezuelanDocumentId(
                memberForm.documentId,
              );
              if (normalized && normalized !== memberForm.documentId) {
                setMemberForm((p) => ({ ...p, documentId: normalized }));
              }
            }}
            error={!!documentIdError}
            helperText={documentIdError || ""}
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
          <FormControl fullWidth error={!!genderError}>
            <InputLabel id="member-gender-label">Género</InputLabel>
            <Select
              labelId="member-gender-label"
              value={memberForm.gender}
              label="Género"
              onChange={(e) =>
                setMemberForm((p) => ({ ...p, gender: e.target.value }))
              }
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
            </Select>
            {!!genderError && <FormHelperText>{genderError}</FormHelperText>}
          </FormControl>
          <DatePicker
            label="Fecha de nacimiento"
            value={memberForm.birthDate ? dayjs(memberForm.birthDate) : null}
            onChange={(newValue) =>
              setMemberForm((p) => ({
                ...p,
                birthDate: newValue ? newValue.format("YYYY-MM-DD") : "",
              }))
            }
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: !!birthDateError,
                helperText: birthDateError || "",
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setMemberDialogOpen(false)}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={hasErrors}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MemberManagementModal;
