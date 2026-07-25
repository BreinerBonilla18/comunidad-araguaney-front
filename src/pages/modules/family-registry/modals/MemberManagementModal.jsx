import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormGroup,
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
  validatePhone,
  getAgeInYears,
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
  const phoneError = validatePhone(memberForm.phone);
  const ageInYears = getAgeInYears(memberForm.birthDate);
  const isLactatingDisabled = !memberForm.birthDate || ageInYears === null || ageInYears > 2;

  const hasErrors =
    !!fullNameError ||
    !!documentIdError ||
    !!genderError ||
    !!birthDateError ||
    !!nationalityError ||
    !!phoneError;

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
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
              setMemberForm((p) => ({ ...p, phone: value }));
            }}
            error={!!phoneError}
            helperText={phoneError || ""}
            fullWidth
          />
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
          <FormControl fullWidth error={!!genderError}>
            <InputLabel id="member-gender-label">Género</InputLabel>
            <Select
              labelId="member-gender-label"
              value={memberForm.gender}
              label="Género"
              onChange={(e) => {
                const value = e.target.value;
                setMemberForm((p) => ({
                  ...p,
                  gender: value,
                  is_pregnant: value === "Femenino" ? p.is_pregnant : false,
                  is_lactating: value === "Femenino" ? p.is_lactating : false,
                }));
              }}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
            </Select>
            {!!genderError && <FormHelperText>{genderError}</FormHelperText>}
          </FormControl>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={memberForm.is_pregnant}
                  disabled={memberForm.gender !== "Femenino"}
                  onChange={(e) =>
                    setMemberForm((p) => ({ ...p, is_pregnant: e.target.checked }))
                  }
                />
              }
              label="Embarazada"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={memberForm.is_lactating}
                  disabled={isLactatingDisabled}
                  onChange={(e) =>
                    setMemberForm((p) => ({ ...p, is_lactating: e.target.checked }))
                  }
                />
              }
              label="Lactante"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={memberForm.is_disabled}
                  onChange={(e) =>
                    setMemberForm((p) => ({ ...p, is_disabled: e.target.checked }))
                  }
                />
              }
              label="Discapacitado/a"
            />
          </FormGroup>
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
