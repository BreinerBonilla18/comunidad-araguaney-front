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
import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { FaChalkboardTeacher, FaPlus } from "react-icons/fa";
/* ----------------- API ----------------- */
import {
  getSpokepersons,
  assignSpokeperson,
  removeSpokeperson,
} from "../../../api/spokepersons";
import { getAllCitizens } from "../../../api/citizens";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import AssignSpokepersonModal from "./modals/AssignSpokepersonModal";
import TableSpokepersons from "./components/TableSpokepersons";
import ModalDelete from "../../../modals/ModalDelete";
import ModalSuccess from "../../../modals/ModalSucces";
import ModalError from "../../../modals/ModalError";

function Spokepersons() {
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [spokepersons, setSpokepersons] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    title: "",
    message: "",
    id: null,
  });

  const filteredSpokepersons = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return spokepersons;

    return spokepersons.filter((s) =>
      [s.fullName, s.documentId].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [spokepersons, query]);

  const isThereMainSpokesPerson = spokepersons.some((s) => s.rank == "main")

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [spokepersonsRes, citizensRes] = await Promise.all([
        getSpokepersons(),
        getAllCitizens(),
      ]);
      if (spokepersonsRes.success) {
        setSpokepersons(spokepersonsRes.data);
      }
      if (citizensRes.success) {
        // Filtramos ciudadanos que ya son voceros para que no aparezcan en la lista de asignación
        const existingSpokepersonIds = new Set(
          spokepersonsRes.data.map((s) => s.citizen_id),
        );
        const availableCitizens = citizensRes.data.filter(
          (c) => !existingSpokepersonIds.has(c.id),
        );
        setCitizens(availableCitizens);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAssignSpokeperson = async (citizen, position, rank, setSelectedCitizen) => {
    try {
      setLoading(true);
      const response = await assignSpokeperson(citizen.id, position, rank);
      if (response.success) {
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Vocero asignado correctamente",
        });
        handleCloseModal();
        fetchData();
        setSelectedCitizen(null)
      }
    } catch (error) {
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo asignar el vocero",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (spokeperson) => {
    setDeleteModal({
      open: true,
      title: "¿Desasignar Vocero?",
      message: `¿Estás seguro de quitar a "${spokeperson.first_name + " " + spokeperson.last_name}" como vocero?`,
      id: spokeperson.id,
    });
  };

  const handleRemoveConfirm = async () => {
    try {
      setLoading(true);
      const response = await removeSpokeperson(deleteModal.id);
      if (response.success) {
        setDeleteModal({ ...deleteModal, open: false });
        setSuccessModal({
          open: true,
          title: "Éxito",
          message: "Vocero desasignado correctamente",
        });
        fetchData();
      }
    } catch (error) {
      setDeleteModal({ ...deleteModal, open: false });
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo desasignar el vocero",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaChalkboardTeacher size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Voceros de la Comunidad
            </Typography>
          </Box>

          <Box className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                onClick={handleOpenModal}
              >
                Asignar Nuevo Vocero
              </Button>
            )}
          </Box>
        </Box>

        <Paper className="p-4">
          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Buscar voceros por nombre o cédula..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Voceros Registrados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {filteredSpokepersons.length}
                </Typography>
              </Box>
              <TableSpokepersons
                spokepersons={filteredSpokepersons}
                onRemove={openDeleteModal}
                loading={loading}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>

      <AssignSpokepersonModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        citizens={citizens}
        onAssign={handleAssignSpokeperson}
        loading={loading}
        isThereMainSpokesPerson={isThereMainSpokesPerson}
      />

      <ModalDelete
        openModal={deleteModal.open}
        setOpenModal={(val) => setDeleteModal((p) => ({ ...p, open: val }))}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={handleRemoveConfirm}
      />

      <ModalSuccess
        openModal={successModal.open}
        setOpenModal={(val) => setSuccessModal((p) => ({ ...p, open: val }))}
        title={successModal.title}
        message={successModal.message}
      />

      <ModalError
        openModal={errorModal.open}
        setOpenModal={(val) => setErrorModal((p) => ({ ...p, open: val }))}
        title={errorModal.title}
        message={errorModal.message}
      />
    </Box>
  );
}

export default Spokepersons;
