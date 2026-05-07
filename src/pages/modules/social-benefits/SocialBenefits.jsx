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
import { useState, useMemo } from "react";
/* ----------------- icons ----------------- */
import { FaHandHoldingHeart, FaPlay, FaStop } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import StartBenefitDayModal from "./modals/StartBenefitDayModal";
import TableBeneficiaries from "./components/TableBeneficiaries";
import EndBenefitDayModal from "./modals/EndBenefitDayModal";

function SocialBenefits() {
  const [query, setQuery] = useState("");
  const [isJornadaActive, setIsJornadaActive] = useState(false);
  const [benefitType, setBenefitType] = useState("");
  const [openStartModal, setOpenStartModal] = useState(false);
  const [openEndModal, setOpenEndModal] = useState(false);

  // Mock data for beneficiaries (Family Heads)
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      name: "María González",
      documentId: "V-12345678",
      status: "pendiente",
    },
    {
      id: 2,
      name: "Pedro Rojas",
      documentId: "V-22334455",
      status: "pendiente",
    },
    {
      id: 3,
      name: "José González",
      documentId: "V-87654321",
      status: "pendiente",
    },
    {
      id: 4,
      name: "Ana González",
      documentId: "V-11223344",
      status: "pendiente",
    },
    {
      id: 5,
      name: "Luisa Rojas",
      documentId: "V-33445566",
      status: "pendiente",
    },
  ]);

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
      (b) => b.status === "entregado",
    ).length;
    return { total, delivered, pending: total - delivered };
  }, [beneficiaries]);

  const handleToggleStatus = (id) => {
    if (!isJornadaActive) return;
    setBeneficiaries((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === "entregado" ? "pendiente" : "entregado",
            }
          : b,
      ),
    );
  };

  const handleStartJornada = (type) => {
    setBenefitType(type);
    setIsJornadaActive(true);
    setOpenStartModal(false);
  };

  const handleEndJornada = () => {
    setOpenEndModal(true);
  };

  const resetJornada = () => {
    setIsJornadaActive(false);
    setBeneficiaries((prev) =>
      prev.map((b) => ({ ...b, status: "pendiente" })),
    );
    setOpenEndModal(false);
  };

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

          {!isJornadaActive ? (
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
        resetJornada={resetJornada}
        openEndModal={openEndModal}
        stats={stats}
      />
    </Box>
  );
}

export default SocialBenefits;
