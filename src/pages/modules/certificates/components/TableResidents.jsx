import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

function TableResidents({
  filteredResidents,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  selectedResidentId,
  setSelectedResidentId,
}) {
  return (
    <>
      <TableContainer sx={{ maxHeight: 500, borderRadius: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cédula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResidents.map((resident) => (
              <TableRow
                key={resident.id}
                hover
                selected={selectedResidentId === resident.id}
                onClick={() => setSelectedResidentId(resident.id)}
                sx={{ cursor: "pointer", transition: "all 0.2s" }}
              >
                <TableCell>{resident.fullName}</TableCell>
                <TableCell>{resident.documentId}</TableCell>
              </TableRow>
            ))}
            {filteredResidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No se encontraron residentes con ese criterio
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Filas por página"
      />
    </>
  );
}

export default TableResidents;
