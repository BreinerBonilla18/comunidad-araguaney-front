import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FaDownload,
  FaEdit,
  FaFileAlt,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaRegTrashAlt,
} from "react-icons/fa";
import { formatDate } from "../../../../utils/functions";

function TableDocuments({
  filteredDocuments,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  handleOpenModal,
  onDeleteDocument,
}) {
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />;
      case "excel":
      case "xlsx":
        return <FaFileExcel className="text-green-600" />;
      case "word":
      case "docx":
        return <FaFileWord className="text-blue-600" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const handleDownload = async (filePath, fileName, fileType) => {
    try {
      const response = await fetch(`http://localhost:3000/${filePath}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Asegurarse de que el nombre del archivo tenga la extensión correcta
      const extension = fileType.toLowerCase();
      const cleanFileName = fileName.replace(/[\\/:*?"<>|]/g, "_"); // Limpiar caracteres inválidos
      const fullFileName = cleanFileName.toLowerCase().endsWith(`.${extension}`)
        ? cleanFileName
        : `${cleanFileName}.${extension}`;

      link.setAttribute("download", fullFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback: abrir en nueva pestaña si falla el fetch (ej: CORS)
      window.open(`http://localhost:3000/${filePath}`, "_blank");
    }
  };

  return (
    <>
      <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDocuments.map((doc) => (
            <TableRow key={doc.id} hover>
              <TableCell>
                <Box className="flex items-center gap-2">
                  {getFileIcon(doc.file_type)}
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {doc.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{doc.file_type}</TableCell>
              <TableCell>{formatDate(doc.document_date)}</TableCell>
              <TableCell align="right">
                <Tooltip title="Descargar">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() =>
                      handleDownload(doc.file_path, doc.title, doc.file_type)
                    }
                  >
                    <FaDownload />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => handleOpenModal(doc)}>
                    <FaEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    onClick={() => onDeleteDocument(doc)}
                  >
                    <FaRegTrashAlt />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {filteredDocuments.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                No se encontraron documentos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </>
  );
}

export default TableDocuments;
