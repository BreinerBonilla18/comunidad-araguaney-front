/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useMemo, useState, useEffect, useCallback } from "react";
/* ----------------- icons ----------------- */
import { FaFileCsv, FaFilePdf, FaPlus, FaUsers } from "react-icons/fa";
/* ----------------- API ----------------- */
import {
  getAllFamilyHeads,
  getFamilyMembersByHeadId,
  createCitizen,
  updateCitizen,
  deleteCitizen,
} from "../../../api/citizens";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import MemberManagementModal from "./modals/MemberManagementModal";
import FamilyHeadManagement from "./modals/FamilyHeadManagement";
import TableFamilyHead from "./components/TableFamilyHead";
import TableMembers from "./components/TableMembers";
import ModalDelete from "../../../modals/ModalDelete";
import ModalSuccess from "../../../modals/ModalSucces";
import ModalError from "../../../modals/ModalError";

const emptyHeadForm = {
  fullName: "",
  documentId: "",
  phone: "",
  address: "",
  gender: "",
  birthDate: "",
};

const emptyMemberForm = {
  fullName: "",
  documentId: "",
  phone: "",
  gender: "",
  birthDate: "",
};

function FamilyRegistry() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [headDialogOpen, setHeadDialogOpen] = useState(false);
  const [headDialogMode, setHeadDialogMode] = useState("create");
  const [headForm, setHeadForm] = useState(emptyHeadForm);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [query, setQuery] = useState("");

  // Modales de estatus
  const [successModal, setSuccessModal] = useState({ open: false, title: "", message: "" });
  const [errorModal, setErrorModal] = useState({ open: false, title: "", message: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, title: "", message: "", id: null, type: "" });

  const fetchMembers = useCallback(async (headId) => {
    if (!headId) return;
    try {
      const response = await getFamilyMembersByHeadId(headId);
      if (response.success) {
        const transformedMembers = response.data.map((member) => ({
          id: member.id,
          fullName: `${member.first_name} ${member.last_name}`,
          documentId: member.id_number,
          phone: member.phone_number,
          gender: member.gender === "M" ? "Masculino" : "Femenino",
          birthDate: member.birth_date,
        }));

        setFamilies((prev) =>
          prev.map((f) =>
            f.id === headId ? { ...f, members: transformedMembers } : f,
          ),
        );
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, []);

  const fetchFamilyHeads = useCallback(async () => {
    try {
      const response = await getAllFamilyHeads();
      if (response.success) {
        const transformedData = response.data.map((head) => ({
          id: head.id,
          head: {
            fullName: `${head.first_name} ${head.last_name}`,
            documentId: head.id_number,
            phone: head.phone_number,
            address: head.house_number,
            gender: head.gender === "M" ? "Masculino" : "Femenino",
            birthDate: head.birth_date,
          },
          members: [],
        }));
        setFamilies(transformedData);

        // Initial selection
        if (transformedData.length > 0) {
          const firstId = transformedData[0].id;
          setSelectedFamilyId(firstId);
          fetchMembers(firstId);
        }
      }
    } catch (error) {
      console.error("Error fetching family heads:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  useEffect(() => {
    fetchFamilyHeads();
  }, []); 

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

  const handleSaveHead = async () => {
    try {
      const { first_name, last_name } = splitName(headForm.fullName);
      const data = {
        id_number: headForm.documentId,
        first_name,
        last_name,
        phone_number: headForm.phone,
        house_number: headForm.address,
        gender: headForm.gender === "Masculino" ? "M" : "F",
        birth_date: headForm.birthDate,
      };

      if (headDialogMode === "create") {
        await createCitizen(data);
        setSuccessModal({ open: true, title: "Éxito", message: "Jefe de familia registrado correctamente" });
      } else {
        await updateCitizen(data, selectedFamilyId);
        setSuccessModal({ open: true, title: "Éxito", message: "Datos actualizados correctamente" });
      }
      setHeadDialogOpen(false);
      fetchFamilyHeads();
    } catch (error) {
      console.error("Error saving family head:", error);
      setErrorModal({ open: true, title: "Error", message: error.message || "No se pudo guardar la información" });
    }
  };

  const handleSaveMember = async () => {
    try {
      const { first_name, last_name } = splitName(memberForm.fullName);
      const data = {
        id_number: memberForm.documentId,
        first_name,
        last_name,
        phone_number: memberForm.phone,
        house_number: selectedFamily?.head?.address || "",
        gender: memberForm.gender === "Masculino" ? "M" : "F",
        birth_date: memberForm.birthDate,
        head_of_household_id: selectedFamilyId,
      };

      if (memberForm.id) {
        await updateCitizen(data, memberForm.id);
        setSuccessModal({ open: true, title: "Éxito", message: "Miembro actualizado correctamente" });
      } else {
        await createCitizen(data);
        setSuccessModal({ open: true, title: "Éxito", message: "Miembro agregado correctamente" });
      }
      setMemberDialogOpen(false);
      fetchMembers(selectedFamilyId);
    } catch (error) {
      console.error("Error saving member:", error);
      setErrorModal({ open: true, title: "Error", message: error.message || "No se pudo guardar la información" });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCitizen(deleteModal.id);
      setDeleteModal({ ...deleteModal, open: false });
      setSuccessModal({ open: true, title: "Eliminado", message: "Registro eliminado correctamente" });
      
      if (deleteModal.type === "head") {
        fetchFamilyHeads();
        if (selectedFamilyId === deleteModal.id) {
          setSelectedFamilyId(null);
        }
      } else {
        fetchMembers(selectedFamilyId);
      }
    } catch (error) {
      console.error("Error deleting citizen:", error);
      setDeleteModal({ ...deleteModal, open: false });
      setErrorModal({ open: true, title: "Error", message: error.message || "No se pudo eliminar el registro" });
    }
  };

  function openDeleteHead(family) {
    setDeleteModal({
      open: true,
      title: "¿Eliminar jefe de familia?",
      message: `¿Estás seguro de eliminar a ${family.head.fullName}?`,
      id: family.id,
      type: "head",
    });
  }

  function openDeleteMember(member) {
    setDeleteModal({
      open: true,
      title: "¿Eliminar miembro?",
      message: `¿Estás seguro de eliminar a ${member.fullName} de este grupo familiar?`,
      id: member.id,
      type: "member",
    });
  }

  function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return {
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || "",
    };
  }

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
      gender: family?.head?.gender ?? "",
      birthDate: family?.head?.birthDate ?? "",
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
      id: member.id,
      fullName: member.fullName ?? "",
      documentId: member.documentId ?? "",
      phone: member.phone ?? "",
      gender: member.gender ?? "",
      birthDate: member.birthDate ?? "",
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
          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-3">
            <TextField
              fullWidth
              label="Buscar por jefe o miembro (nombre, cédula, teléfono...)"
              disabled={loading}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Divider />

            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TableFamilyHead
                filteredFamilies={filteredFamilies}
                selectedFamilyId={selectedFamilyId}
                setSelectedFamilyId={(id) => {
                  setSelectedFamilyId(id);
                  fetchMembers(id);
                }}
                openEditHead={openEditHead}
                openDeleteHead={openDeleteHead}
              />

              <TableMembers
                openCreateMember={openCreateMember}
                selectedFamily={selectedFamily}
                openEditMember={openEditMember}
                openDeleteMember={openDeleteMember}
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
        onSave={handleSaveHead}
      />

      <MemberManagementModal
        memberDialogOpen={memberDialogOpen}
        setMemberDialogOpen={setMemberDialogOpen}
        setMemberForm={setMemberForm}
        memberForm={memberForm}
        onSave={handleSaveMember}
      />

      <ModalDelete
        openModal={deleteModal.open}
        setOpenModal={(val) => setDeleteModal(p => ({ ...p, open: val }))}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={handleDeleteConfirm}
      />

      <ModalSuccess
        openModal={successModal.open}
        setOpenModal={(val) => setSuccessModal(p => ({ ...p, open: val }))}
        title={successModal.title}
        message={successModal.message}
      />

      <ModalError
        openModal={errorModal.open}
        setOpenModal={(val) => setErrorModal(p => ({ ...p, open: val }))}
        title={errorModal.title}
        message={errorModal.message}
      />
    </Box>
  );
}

export default FamilyRegistry;
