/* ----------- MUI Components -----------*/
import {
  Box,
  Divider,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo } from "react";
/* ----------------- icons ----------------- */
import { FaCertificate, FaSearch } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import CertificateGenerator from "./components/CertificateGenerator";
import TableResidents from "./components/TableResidents";

function Certificates() {
  const [query, setQuery] = useState("");
  const [selectedResidentId, setSelectedResidentId] = useState(null);

  const residents = useMemo(
    () => [
      {
        id: "res_1",
        fullName: "María González",
        documentId: "V-12345678",
        address: "Calle 1, Sector Centro, Casa #15",
        phone: "0412-0000000",
      },
      {
        id: "res_2",
        fullName: "Pedro Rojas",
        documentId: "V-22334455",
        address: "Av. Principal, Sector Norte, Bloque 3",
        phone: "0424-0000000",
      },
      {
        id: "res_3",
        fullName: "José González",
        documentId: "V-87654321",
        address: "Calle 1, Sector Centro, Casa #15",
        phone: "0414-0000000",
      },
      {
        id: "res_4",
        fullName: "Ana González",
        documentId: "V-11223344",
        address: "Calle 1, Sector Centro, Casa #15",
        phone: "0416-0000000",
      },
      {
        id: "res_5",
        fullName: "Luisa Rojas",
        documentId: "V-33445566",
        address: "Av. Principal, Sector Norte, Bloque 3",
        phone: "0412-1111111",
      },
    ],
    [],
  );

  const filteredResidents = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return residents;
    return residents.filter((r) =>
      [r.fullName, r.documentId, r.address].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [residents, query]);

  const selectedResident = useMemo(() => {
    return residents.find((r) => r.id === selectedResidentId) || null;
  }, [residents, selectedResidentId]);

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        {/* Header */}
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaCertificate size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Generación de Certificados
            </Typography>
          </Box>
        </Box>

        <Paper className="p-4 shadow-md">
          <Box className="flex flex-col gap-4">
            {/* Search Bar */}
            <TextField
              fullWidth
              label="Buscar residente por nombre, cédula o dirección..."
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch />
                    </InputAdornment>
                  ),
              }}
            />

            <Divider />

            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tabla de residentes registrados */}
              <Box>
                <Paper variant="outlined" className="p-3 bg-slate-50/30">
                  <Box className="flex items-center justify-between gap-2 mb-3">
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Residentes Registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filteredResidents.length} encontrados
                    </Typography>
                  </Box>
                  <TableResidents
                    filteredResidents={filteredResidents}
                    selectedResidentId={selectedResidentId}
                    setSelectedResidentId={setSelectedResidentId}
                  />
                </Paper>
              </Box>

              {/* Generación de certificados */}
              <Box>
                <Paper
                  variant="outlined"
                  className={`p-5 flex flex-col h-full border-dashed border-2 ${
                    selectedResident
                      ? "border-primary/20 bg-primary/5"
                      : "border-slate-200 bg-slate-50 items-center justify-center"
                  }`}
                  sx={{ transition: "all 0.3s ease" }}
                >
                  <CertificateGenerator selectedResident={selectedResident} />
                </Paper>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Certificates;
