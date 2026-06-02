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
  validateBirthDate,
  validateFullName,
} from "../../../../utils/functions";

function MemberManagementModal({
  memberDialogOpen,
  setMemberDialogOpen,
  setMemberForm,
  memberForm,
  onSave,
}) {
  const fullNameError = validateFullName(memberForm.fullName);
  const documentIdError = !memberForm.documentId ? "Este campo es requerido" : "";
  const genderError = !normalizeText(memberForm.gender)
    ? "Este campo es requerido"
    : "";
  const birthDateError = validateBirthDate(memberForm.birthDate);
  const nationalityError = !memberForm.nationality ? "Este campo es requerido" : "";

  const hasErrors =
    !!fullNameError ||
    !!documentIdError ||
    !!genderError ||
    !!birthDateError ||
    !!nationalityError;

  return (
    <Dialog
      open={memberDialogOpen}
      onClose={() => setMemberDialogOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Registrar / Editar miembro</DialogTitle>

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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth error={!!nationalityError}>
              <InputLabel id="member-nationality-label">Nacionalidad</InputLabel>
              <Select
                labelId="member-nationality-label"
                value={memberForm.nationality}
                label="Nacionalidad"
                onChange={(e) =>
                  setMemberForm((p) => ({ ...p, nationality: e.target.value }))
                }
              >
                <MenuItem value="V">Venezolana (V-)</MenuItem>
                <MenuItem value="E">Extranjera (E-)</MenuItem>
              </Select>
              {!!nationalityError && <FormHelperText>{nationalityError}</FormHelperText>}
            </FormControl>
            <TextField
              label="Número de Cédula"
              value={memberForm.documentId}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setMemberForm((p) => ({ ...p, documentId: value }));
              }}
              error={!!documentIdError}
              helperText={documentIdError || ""}
              fullWidth
              required
            />
          </Box>
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
