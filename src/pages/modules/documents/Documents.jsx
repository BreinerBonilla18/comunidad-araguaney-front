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
import { useState, useMemo, useEffect, useCallback } from "react";
import { LinearProgress } from "@mui/material";
/* ----------------- icons ----------------- */
import { FaFileAlt, FaPlus } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* ----------------- API ----------------- */
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../../../api/documents";
/* --------------- components -------------- */
import DocumentManagementModal from "./modals/DocumentManagementModal";
import TableDocuments from "./components/TableDocuments";
import ModalSuccess from "../../../modals/ModalSucces";
import ModalDelete from "../../../modals/ModalDelete";
import ModalError from "../../../modals/ModalError";

const emptyDocumentForm = {
  title: "",
  document_date: "",
  file: null,
};

function Documents() {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [documentForm, setDocumentForm] = useState(emptyDocumentForm);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDocuments();
      if (response.success) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredDocuments = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const filtered = !q
      ? documents
      : documents.filter((doc) =>
          [doc.title, doc.file_type].some((val) =>
            normalizeText(val || "")
              .toLowerCase()
              .includes(q),
          ),
        );

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [documents, query, page, rowsPerPage]);

  const totalFilteredDocuments = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return documents.length;
    return documents.filter((doc) =>
      [doc.title, doc.file_type].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    ).length;
  }, [documents, query]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (doc = null) => {
    setEditingDoc(doc);
    setDocumentForm(
      doc
        ? {
            title: doc.title || "",
            document_date: doc.document_date || "",
            file: null,
          }
        : emptyDocumentForm,
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDoc(null);
    setDocumentForm(emptyDocumentForm);
  };

  const handleSaveDocument = async () => {
    try {
      const formData = new FormData();
      formData.append("title", documentForm.title);
      formData.append("document_date", documentForm.document_date);
      if (documentForm.file) {
        formData.append("file", documentForm.file);
      }

      if (editingDoc) {
        await updateDocument(formData, editingDoc.id);
        setSuccessModal({
          open: true,
          title: "¡Actualizado!",
          message: "Documento actualizado correctamente.",
        });
      } else {
        await createDocument(formData);
        setSuccessModal({
          open: true,
          title: "¡Creado!",
          message: "Documento subido correctamente.",
        });
      }
      handleCloseModal();
      fetchDocuments();
    } catch (error) {
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo guardar el documento",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument(deleteModal.id);
      setDeleteModal({ ...deleteModal, open: false });
      setSuccessModal({
        open: true,
        title: "Eliminado",
        message: "Documento eliminado correctamente.",
      });
      fetchDocuments();
    } catch (error) {
      setDeleteModal({ ...deleteModal, open: false });
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo eliminar el documento.",
      });
    }
  };

  const openDeleteDocument = (doc) => {
    setDeleteModal({
      open: true,
      title: "¿Eliminar Documento?",
      message: `¿Estás seguro de eliminar el documento "${doc.title}"?`,
      id: doc.id,
    });
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    setPage(0);
  }, [query]);
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

        <Paper className="p-4">
          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-4">
            {/* Search */}
            <TextField
              fullWidth
              label="Buscar documentos por nombre o tipo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />

            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Archivos Almacenados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {totalFilteredDocuments}
                </Typography>
              </Box>
              <TableDocuments
                filteredDocuments={filteredDocuments}
                totalCount={totalFilteredDocuments}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                handleOpenModal={handleOpenModal}
                onDeleteDocument={openDeleteDocument}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>

      <DocumentManagementModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        editingDoc={editingDoc}
        documentForm={documentForm}
        setDocumentForm={setDocumentForm}
        onSave={handleSaveDocument}
      />

      <ModalDelete
        openModal={deleteModal.open}
        setOpenModal={(val) => setDeleteModal((p) => ({ ...p, open: val }))}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={handleDeleteConfirm}
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

export default Documents;
