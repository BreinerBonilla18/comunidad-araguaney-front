/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useMemo, useState } from "react";
/* ----------------- icons ----------------- */
import { FaFileCsv, FaFilePdf, FaPlus, FaUsers } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import MemberManagementModal from "./modals/MemberManagementModal";
import FamilyHeadManagement from "./modals/FamilyHeadManagement";
import TableFamilyHead from "./components/TableFamilyHead";
import TableMembers from "./components/TableMembers";

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
    [],
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
            <FaUsers size={24} className="text-brand-primary" />
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
              Exportar Excel
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
              <TableFamilyHead
                filteredFamilies={filteredFamilies}
                selectedFamilyId={selectedFamilyId}
                setSelectedFamilyId={setSelectedFamilyId}
                openEditHead={openEditHead}
              />

              <TableMembers
                openCreateMember={openCreateMember}
                selectedFamily={selectedFamily}
                openEditMember={openEditMember}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
      <FamilyHeadManagement
        headDialogOpen={headDialogOpen}
        headDialogMode={headDialogMode}
        setHeadDialogOpen={setHeadDialogOpen}
        headForm={headForm}
        setHeadForm={setHeadForm}
      />

      <MemberManagementModal
        memberDialogOpen={memberDialogOpen}
        setMemberDialogOpen={setMemberDialogOpen}
        setMemberForm={setMemberForm}
        memberForm={memberForm}
      />
    </Box>
  );
}

export default FamilyRegistry;
