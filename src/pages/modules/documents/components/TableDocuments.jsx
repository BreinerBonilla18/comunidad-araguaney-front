import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

function TableDocuments({ filteredDocuments, handleOpenModal }) {
  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />;
      case "excel":
        return <FaFileExcel className="text-green-600" />;
      case "word":
        return <FaFileWord className="text-blue-600" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };
  return (
    <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Categoría</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Tamaño</TableCell>
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
                {getFileIcon(doc.type)}
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {doc.name}
                </Typography>
              </Box>
            </TableCell>
            <TableCell>{doc.category}</TableCell>
            <TableCell>{doc.type}</TableCell>
            <TableCell>{doc.uploadDate}</TableCell>
            <TableCell>{doc.size}</TableCell>
            <TableCell align="right">
              <Tooltip title="Descargar">
                <IconButton size="small" color="primary">
                  <FaDownload />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton size="small" onClick={() => handleOpenModal(doc)}>
                  <FaEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton size="small">
                  <FaRegTrashAlt />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
        {filteredDocuments.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
              No se encontraron documentos registrados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableDocuments;
