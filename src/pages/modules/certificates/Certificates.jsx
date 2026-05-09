/* ----------- MUI Components -----------*/
import {
  Box,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo, useEffect, useCallback } from "react";
/* ----------------- icons ----------------- */
import { FaCertificate } from "react-icons/fa";
/* ----------------- API ----------------- */
import { getAllCitizens } from "../../../api/citizens";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import CertificateGenerator from "./components/CertificateGenerator";
import TableResidents from "./components/TableResidents";

function Certificates() {
  const [query, setQuery] = useState("");
  const [selectedResidentId, setSelectedResidentId] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCitizens();
      if (response.success) {
        debugger;
        const mapped = response.data.map((c) => ({
          id: c.id,
          fullName: `${c.first_name} ${c.last_name}`,
          documentId: c.id_number,
          address: c.house_number,
          phone_number: c.phone_number,
        }));
        setResidents(mapped);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredResidentsPaged = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const filtered = !q
      ? residents
      : residents.filter((r) =>
          [r.fullName, r.documentId, r.address, r.phone_number].some((val) =>
            normalizeText(val || "")
              .toLowerCase()
              .includes(q),
          ),
        );
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [residents, query, page, rowsPerPage]);

  const totalFilteredCount = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return residents.length;
    return residents.filter((r) =>
      [r.fullName, r.documentId, r.address, r.phone_number].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    ).length;
  }, [residents, query]);

  const selectedResident = useMemo(() => {
    return residents.find((r) => r.id === selectedResidentId) || null;
  }, [residents, selectedResidentId]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

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
          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Buscar residente por nombre, cédula o dirección..."
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                      {totalFilteredCount} encontrados
                    </Typography>
                  </Box>
                  <TableResidents
                    filteredResidents={filteredResidentsPaged}
                    totalCount={totalFilteredCount}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(e, p) => setPage(p)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
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
