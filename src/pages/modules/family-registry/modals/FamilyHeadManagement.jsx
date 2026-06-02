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
  validateAddress,
} from "../../../../utils/functions";

function FamilyHeadManagement({
  headDialogMode,
  headDialogOpen,
  setHeadDialogOpen,
  headForm,
  setHeadForm,
  onSave,
}) {
  const fullNameError = validateFullName(headForm.fullName);
  const documentIdError = !headForm.documentId ? "Este campo es requerido" : "";
  const genderError = !normalizeText(headForm.gender)
    ? "Este campo es requerido"
    : "";
  const birthDateError = validateBirthDate(headForm.birthDate);
  const addressError = validateAddress(headForm.address);
  const nationalityError = !headForm.nationality ? "Este campo es requerido" : "";

  const hasErrors =
    !!fullNameError ||
    !!documentIdError ||
    !!genderError ||
    !!birthDateError ||
    !!addressError ||
    !!nationalityError;

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
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre y apellido"
            value={headForm.fullName}
            onChange={(e) =>
              setHeadForm((p) => ({ ...p, fullName: e.target.value }))
            }
            error={!!fullNameError}
            helperText={fullNameError || ""}
            fullWidth
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth error={!!nationalityError}>
              <InputLabel id="head-nationality-label">Nacionalidad</InputLabel>
              <Select
                labelId="head-nationality-label"
                value={headForm.nationality}
                label="Nacionalidad"
                onChange={(e) =>
                  setHeadForm((p) => ({ ...p, nationality: e.target.value }))
                }
              >
                <MenuItem value="V">Venezolana (V-)</MenuItem>
                <MenuItem value="E">Extranjera (E-)</MenuItem>
              </Select>
              {!!nationalityError && <FormHelperText>{nationalityError}</FormHelperText>}
            </FormControl>
            <TextField
              label="Número de Cédula"
              value={headForm.documentId}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setHeadForm((p) => ({ ...p, documentId: value }));
              }}
              error={!!documentIdError}
              helperText={documentIdError || ""}
              fullWidth
              required
            />
          </Box>
          <TextField
            label="Teléfono"
            value={headForm.phone}
            onChange={(e) =>
              setHeadForm((p) => ({ ...p, phone: e.target.value }))
            }
            
            fullWidth
          />
          <TextField
            label="Número de Casa"
            value={headForm.address}
            onChange={(e) =>
              setHeadForm((p) => ({ ...p, address: e.target.value }))
            }
            error={!!addressError}
            helperText={addressError || ""}
            fullWidth
            required
          />
          <FormControl fullWidth error={!!genderError}>
            <InputLabel id="head-gender-label">Género</InputLabel>
            <Select
              labelId="head-gender-label"
              value={headForm.gender}
              label="Género"
              onChange={(e) =>
                setHeadForm((p) => ({ ...p, gender: e.target.value }))
              }
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
            </Select>
            {!!genderError && <FormHelperText>{genderError}</FormHelperText>}
          </FormControl>
          <DatePicker
            label="Fecha de nacimiento"
            value={headForm.birthDate ? dayjs(headForm.birthDate) : null}
            onChange={(newValue) =>
              setHeadForm((p) => ({
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
        <Button variant="outlined" onClick={() => setHeadDialogOpen(false)}>
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

export default FamilyHeadManagement;
