/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
/* ----------------- icons ----------------- */
import { FaHandHoldingHeart, FaPlay, FaStop } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* ----------------- API ----------------- */
import { getAllFamilyHeads } from "../../../api/citizens";
import {
  startBenefitSession,
  markBenefitDelivered,
  endBenefitSession,
} from "../../../api/socialBenefits";
/* --------------- components -------------- */
import BeneficiariesExporterModal from "./modals/BeneficiariesExporterModal";
import StartBenefitDayModal from "./modals/StartBenefitDayModal";
import TableBeneficiaries from "./components/TableBeneficiaries";
import ConfirmDeliveryModal from "./modals/ConfirmDeliveryModal";
import EndBenefitDayModal from "./modals/EndBenefitDayModal";

function SocialBenefits() {
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [isJornadaActive, setIsJornadaActive] = useState(false);
  const [benefitType, setBenefitType] = useState("");
  const [openStartModal, setOpenStartModal] = useState(false);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [openExporterModal, setOpenExporterModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, name: "" });

  const filteredBeneficiaries = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    return beneficiaries.filter(
      (b) =>
        normalizeText(b.name).toLowerCase().includes(q) ||
        normalizeText(b.documentId).toLowerCase().includes(q),
    );
  }, [beneficiaries, query]);

  const stats = useMemo(() => {
    const total = beneficiaries.length;
    const delivered = beneficiaries.filter(
      (b) => b.status === "delivered",
    ).length;
    return { total, delivered, pending: total - delivered };
  }, [beneficiaries]);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      const response = await getAllFamilyHeads();
      if (response.success) {
        const mapped = response.data.map((b) => ({
          id: b.id,
          name: b.first_name + " " + b.last_name,
          documentId: b.id_number,
          status: b.delivery_status,
          quantity: b.delivery_quantity,
          cylinderNumber: b.gas_cylinder_number,
        }));
        setBeneficiaries(mapped);
      }
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
    }
  }, []);

  const handleToggleStatus = async (id, status, name) => {
    if (!isJornadaActive) return;
    if (status !== "delivered") {
      setConfirmModal({ open: true, id, name });
    } else {
      try {
        const response = await markBenefitDelivered(id, "pending", benefitType, null, 0);
        if (response.success) {
          setBeneficiaries((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "pending", quantity: null, cylinderNumber: null } : b)),
          );
        }
      } catch (error) {
        console.error("Error marking pending:", error);
      }
    }
  };

  const handleConfirmDelivery = async (quantity, cylinders) => {
    try {
      const { id } = confirmModal;
      const cylinderData = Array.isArray(cylinders) ? cylinders : null;
      const response = await markBenefitDelivered(id, "delivered", benefitType, cylinderData, quantity);
      if (response.success) {
        setBeneficiaries((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "delivered", quantity, cylinderNumber: cylinderData } : b)),
        );
      }
    } catch (error) {
      console.error("Error marking delivered:", error);
    }
    setConfirmModal({ open: false, id: null, name: "" });
  };

  const handleStartJornada = async (type) => {
    try {
      const response = await startBenefitSession(type);
      if (response.success) {
        setBenefitType(type);
        setIsJornadaActive(true);
        setOpenStartModal(false);
        fetchBeneficiaries();
      }
    } catch (error) {
      console.error("Error starting jornada:", error);
    }
  };

  const handleEndJornada = () => {
    setOpenEndModal(true);
  };

  const confirmEndJornada = async () => {
    try {
      const response = await endBenefitSession();
      if (response.success) {
        setIsJornadaActive(false);
        setOpenEndModal(false);
        setOpenExporterModal(true);
      }
    } catch (error) {
      console.error("Error ending jornada:", error);
    }
  };

  const closeExporter = () => {
    setOpenExporterModal(false);
    fetchBeneficiaries();
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        {/* Header */}
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaHandHoldingHeart size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Entrega de Beneficios {isJornadaActive && `- ${benefitType}`}
            </Typography>
          </Box>

          {isAdmin && (
            !isJornadaActive ? (
              <Button
                variant="contained"
                startIcon={<FaPlay />}
                onClick={() => setOpenStartModal(true)}
              >
                Iniciar Jornada
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<FaStop />}
                onClick={handleEndJornada}
              >
                Finalizar Jornada
              </Button>
            )
          )}
        </Box>

        {/* Stats Section */}
        {isJornadaActive && (
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Paper className="p-3 text-center border-b-4 border-blue-500">
              <Typography variant="caption" color="text.secondary">
                Total Beneficiarios
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {stats.total}
              </Typography>
            </Paper>
            <Paper className="p-3 text-center border-b-4 border-green-500">
              <Typography variant="caption" color="text.secondary">
                Entregados
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "green" }}
              >
                {stats.delivered}
              </Typography>
            </Paper>
            <Paper className="p-3 text-center border-b-4 border-amber-500">
              <Typography variant="caption" color="text.secondary">
                Pendientes
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#f59e0b" }}
              >
                {stats.pending}
              </Typography>
            </Paper>
          </Box>
        )}

        <Paper className="p-4 relative">
          <Box className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Buscar por nombre o cédula..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!isJornadaActive}
            />

            <Divider />

            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Beneficiarios (Jefes de Familia)
                </Typography>
              </Box>
              <TableBeneficiaries
                filteredBeneficiaries={filteredBeneficiaries}
                handleToggleStatus={handleToggleStatus}
                isJornadaActive={isJornadaActive}
                benefitType={benefitType}
              />
            </Paper>
          </Box>
          {!isJornadaActive && (
            <Box className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center rounded-sm backdrop-blur-[5px]">
              <Typography
                variant="h6"
                className="text-white font-bold px-4 py-2 bg-black/90 rounded-lg border border-white/10 shadow-xl"
              >
                Inicie una jornada para comenzar
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <StartBenefitDayModal
        openStartModal={openStartModal}
        setOpenStartModal={setOpenStartModal}
        handleStartJornada={handleStartJornada}
      />

      <EndBenefitDayModal
        setOpenEndModal={setOpenEndModal}
        onConfirm={confirmEndJornada}
        openEndModal={openEndModal}
      />

      <BeneficiariesExporterModal
        open={openExporterModal}
        onClose={closeExporter}
        beneficiaries={beneficiaries}
        benefitType={benefitType}
      />

      <ConfirmDeliveryModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null, name: "" })}
        onConfirm={handleConfirmDelivery}
        benefitType={benefitType}
        beneficiaryName={confirmModal.name}
      />
    </Box>
  );
}

export default SocialBenefits;
