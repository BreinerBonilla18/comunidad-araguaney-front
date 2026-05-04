import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  FaEdit,
  FaFileCsv,
  FaFilePdf,
  FaPlus,
  FaRegTrashAlt,
  FaUsers,
} from "react-icons/fa";

function normalizeText(value) {
  return (value ?? "").toString().trim();
}

const emptyHeadForm = {
  fullName: "",
  documentId: "",
  phone: "",
  address: "",
};

const emptyMemberForm = {
  fullName: "",
  documentId: "",
  phone: "",
  role: "",
  relationship: "",
};

function FamilyRegistry() {
  const families = useMemo(
    () => [
      {
        id: "family_1",
        head: {
          fullName: "María González",
          documentId: "V-12345678",
          phone: "0412-0000000",
          address: "Calle 1, Sector Centro",
        },
        members: [
          {
            id: "m_1",
            fullName: "José González",
            documentId: "V-87654321",
            phone: "0414-0000000",
            role: "Miembro",
            relationship: "Esposo",
          },
          {
            id: "m_2",
            fullName: "Ana González",
            documentId: "V-11223344",
            phone: "0416-0000000",
            role: "Estudiante",
            relationship: "Hija",
          },
        ],
      },
      {
        id: "family_2",
        head: {
          fullName: "Pedro Rojas",
          documentId: "V-22334455",
          phone: "0424-0000000",
          address: "Av. Principal, Sector Norte",
        },
        members: [
          {
            id: "m_3",
            fullName: "Luisa Rojas",
            documentId: "V-33445566",
            phone: "0412-1111111",
            role: "Adulto mayor",
            relationship: "Madre",
          },
        ],
      },
    ],
    []
  );
  const [query, setQuery] = useState("");

  const [selectedFamilyId, setSelectedFamilyId] = useState("family_1");

  const [headDialogOpen, setHeadDialogOpen] = useState(false);
  const [headDialogMode, setHeadDialogMode] = useState("create");
  const [headForm, setHeadForm] = useState(emptyHeadForm);

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);

  const selectedFamily = useMemo(() => {
    return families.find((f) => f.id === selectedFamilyId) ?? null;
  }, [families, selectedFamilyId]);

  const allMembers = useMemo(() => {
    const result = [];
    for (const family of families) {
      const headName = family?.head?.fullName ?? "";
      const members = Array.isArray(family?.members) ? family.members : [];
      for (const member of members) {
        result.push({
          ...member,
          familyId: family.id,
          familyHeadName: headName,
        });
      }
    }
    return result;
  }, [families]);

  const filteredFamilies = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return families;

    return families.filter((f) => {
      const head = f?.head ?? {};
      const members = Array.isArray(f?.members) ? f.members : [];
      const inHead = [head.fullName, head.documentId, head.phone, head.address]
        .filter(Boolean)
        .some((v) => v.toString().toLowerCase().includes(q));

      const inMembers = members.some((m) => {
        return [m.fullName, m.documentId, m.phone, m.role, m.relationship]
          .filter(Boolean)
          .some((v) => v.toString().toLowerCase().includes(q));
      });
      return inHead || inMembers;
    });
  }, [families, query]);

  function openCreateHead() {
    setHeadDialogMode("create");
    setHeadForm(emptyHeadForm);
    setHeadDialogOpen(true);
  }

  function openEditHead(family) {
    setHeadDialogMode("edit");

    setHeadForm({
      fullName: family?.head?.fullName ?? "",
      documentId: family?.head?.documentId ?? "",
      phone: family?.head?.phone ?? "",
      address: family?.head?.address ?? "",
    });
    setSelectedFamilyId(family.id);
    setHeadDialogOpen(true);
  }

  function openCreateMember() {
    if (!selectedFamily) return;
    setMemberForm(emptyMemberForm);
    setMemberDialogOpen(true);
  }

  function openEditMember(member) {
    setMemberForm({
      fullName: member.fullName ?? "",
      documentId: member.documentId ?? "",
      phone: member.phone ?? "",
      role: member.role ?? "",
      relationship: member.relationship ?? "",
    });
    setMemberDialogOpen(true);
  }

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaUsers />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Registro de familias
            </Typography>
          </Box>

          <Box className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              startIcon={<FaFileCsv />}
              onClick={() => {}}
              disabled={allMembers.length === 0}
            >
              Exportar Excel (CSV)
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaFilePdf />}
              onClick={() => {}}
              disabled={allMembers.length === 0}
            >
              Exportar PDF
            </Button>

            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={openCreateHead}
            >
              Nuevo jefe
            </Button>
          </Box>
        </Box>

        <Paper className="p-4">
          <Box className="flex flex-col gap-3">
            <TextField
              fullWidth
              label="Buscar por jefe o miembro (nombre, cédula, teléfono...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Divider />

            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Paper className="p-3" variant="outlined">
                <Box className="flex items-center justify-between gap-2 mb-2">
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Jefes de familia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {filteredFamilies.length}
                  </Typography>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Jefe</TableCell>
                      <TableCell>Cédula</TableCell>
                      <TableCell>Miembros</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFamilies.map((family) => {
                      const isSelected = family.id === selectedFamilyId;
                      const membersCount = Array.isArray(family.members) ? family.members.length : 0;
                      return (
                        <TableRow
                          key={family.id}
                          hover
                          selected={isSelected}
                          onClick={() => setSelectedFamilyId(family.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{family?.head?.fullName ?? ""}</TableCell>
                          <TableCell>{family?.head?.documentId ?? ""}</TableCell>
                          <TableCell>{membersCount}</TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <IconButton
                              size="small"
                              aria-label="Editar"
                              onClick={() => openEditHead(family)}
                            >
                              <FaEdit />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label="Eliminar"
                              onClick={() => {}}
                            >
                              <FaRegTrashAlt />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredFamilies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay registros
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </Paper>

              <Paper className="p-3" variant="outlined">
                <Box className="flex items-center justify-between gap-2 mb-2">
                  <Box className="flex flex-col">
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Miembros del grupo familiar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFamily
                        ? `Jefe: ${selectedFamily?.head?.fullName ?? ""}`
                        : "Selecciona un jefe de familia"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={openCreateMember}
                    disabled={!selectedFamily}
                  >
                    Nuevo miembro
                  </Button>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Cédula</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedFamily?.members ?? []).map((member) => (
                      <TableRow key={member.id} hover>
                        <TableCell>{member.fullName ?? ""}</TableCell>
                        <TableCell>{member.documentId ?? ""}</TableCell>
                        <TableCell>{member.role ?? ""}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => openEditMember(member)}>
                            <FaEdit />
                          </IconButton>
                          <IconButton size="small" onClick={() => {}}>
                            <FaRegTrashAlt />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedFamily && (selectedFamily.members ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Este grupo familiar no tiene miembros
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {!selectedFamily ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Selecciona un jefe para ver/gestionar miembros
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={headDialogOpen} onClose={() => setHeadDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {headDialogMode === "create" ? "Registrar jefe de familia" : "Editar jefe de familia"}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3 pt-3">
          <TextField
            label="Nombre y apellido"
            value={headForm.fullName}
            onChange={(e) => setHeadForm((p) => ({ ...p, fullName: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Cédula"
            value={headForm.documentId}
            onChange={(e) => setHeadForm((p) => ({ ...p, documentId: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Teléfono"
            value={headForm.phone}
            onChange={(e) => setHeadForm((p) => ({ ...p, phone: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Dirección"
            value={headForm.address}
            onChange={(e) => setHeadForm((p) => ({ ...p, address: e.target.value }))}
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
            disabled={!normalizeText(headForm.fullName) || !normalizeText(headForm.documentId)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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
            onChange={(e) => setMemberForm((p) => ({ ...p, fullName: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Cédula"
            value={memberForm.documentId}
            onChange={(e) => setMemberForm((p) => ({ ...p, documentId: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Teléfono"
            value={memberForm.phone}
            onChange={(e) => setMemberForm((p) => ({ ...p, phone: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Rol (ej: Miembro, Adulto mayor, Niño...)"
            value={memberForm.role}
            onChange={(e) => setMemberForm((p) => ({ ...p, role: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Parentesco (ej: Hijo, Esposa, Hermano...)"
            value={memberForm.relationship}
            onChange={(e) => setMemberForm((p) => ({ ...p, relationship: e.target.value }))}
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
            disabled={!normalizeText(memberForm.fullName) || !normalizeText(memberForm.documentId)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FamilyRegistry;