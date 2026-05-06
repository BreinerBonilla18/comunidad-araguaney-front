/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo } from "react";
/* ----------------- icons ----------------- */
import { FaFileAlt, FaSearch, FaPlus } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import DocumentManagementModal from "./modals/DocumentManagementModal";
import TableDocuments from "./components/TableDocuments";

function Documents() {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Mock data for documents
  const documents = useMemo(
    () => [
      {
        id: 1,
        name: "Acta de Asamblea 2024-01-15",
        type: "PDF",
        category: "Actas",
        uploadDate: "2024-01-16",
        size: "1.2 MB",
      },
      {
        id: 2,
        name: "Presupuesto Reparación Tuberías",
        type: "Excel",
        category: "Finanzas",
        uploadDate: "2024-02-10",
        size: "450 KB",
      },
      {
        id: 3,
        name: "Carta de Residencia Modelo",
        type: "Word",
        category: "Formatos",
        uploadDate: "2023-11-20",
        size: "85 KB",
      },
      {
        id: 4,
        name: "Listado de Residentes Bloque 1",
        type: "PDF",
        category: "Censos",
        uploadDate: "2024-03-01",
        size: "2.5 MB",
      },
    ],
    [],
  );

  const filteredDocuments = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return documents;
    return documents.filter((doc) =>
      [doc.name, doc.category, doc.type].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [documents, query]);

  const handleOpenModal = (doc = null) => {
    setEditingDoc(doc);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDoc(null);
  };

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-4">
        {/* Header Action Bar */}
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaFileAlt size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Gestión de Documentos
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<FaPlus />}
            onClick={() => handleOpenModal()}
          >
            Nuevo Documento
          </Button>
        </Box>

        <Paper className="p-4 shadow-sm border border-brand-primary/20">
          <Box className="flex flex-col gap-4">
            {/* Search */}
            <TextField
              fullWidth
              label="Buscar documentos por nombre, categoría o tipo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch className="text-brand-primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Archivos Almacenados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {filteredDocuments.length}
                </Typography>
              </Box>
              <TableDocuments
                filteredDocuments={filteredDocuments}
                handleOpenModal={handleOpenModal}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>

      <DocumentManagementModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        editingDoc={editingDoc}
      />
    </Box>
  );
}

export default Documents;
