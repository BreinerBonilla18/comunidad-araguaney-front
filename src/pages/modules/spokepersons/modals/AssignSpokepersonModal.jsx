import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { FaUserPlus } from "react-icons/fa";
import { useState, useMemo } from "react";
import { normalizeText } from "../../../../utils/functions";

function AssignSpokepersonModal({
  openModal,
  handleCloseModal,
  citizens,
  onAssign,
  loading,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [position, setPosition] = useState("");

  const handleClose = () => {
    setSelectedCitizen(null);
    setPosition("");
    setQuery("");
    setPage(0);
    handleCloseModal();
  };

  const filteredCitizens = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    if (!q) return citizens;

    return citizens.filter((citizen) =>
      [citizen.first_name, citizen.last_name, citizen.id_number].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [citizens, query]);

  const paginatedCitizens = useMemo(() => {
    return filteredCitizens.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredCitizens, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FaUserPlus className="text-brand-primary" />
        {selectedCitizen ? "Completar Asignación" : "Asignar Ciudadano como Vocero"}
      </DialogTitle>

      <DialogContent dividers>
        {selectedCitizen ? (
          <Box className="flex flex-col gap-4 py-4">
            <Typography variant="body1">
              Por favor, ingrese el cargo o posición que ocupará{" "}
              <strong>
                {selectedCitizen.first_name} {selectedCitizen.last_name}
              </strong>{" "}
              (C.I: {selectedCitizen.id_number}):
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Cargo / Posición"
              required
              variant="outlined"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
              error={position.trim() === ""}
              helperText={position.trim() === "" ? "El cargo es obligatorio" : ""}
            />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Buscar ciudadano por nombre o cédula..."
                variant="outlined"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              />
            </Box>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 400 }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Nombre Completo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Cédula</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCitizens.map((citizen) => (
                    <TableRow key={citizen.id} hover>
                      <TableCell>
                        {citizen.first_name + " " + citizen.last_name}
                      </TableCell>
                      <TableCell>{citizen.id_number}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Asignar">
                          <IconButton
                            color="primary"
                            onClick={() => setSelectedCitizen(citizen)}
                            disabled={loading}
                          >
                            <FaUserPlus size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCitizens.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No se encontraron ciudadanos
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
              count={filteredCitizens.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        {selectedCitizen ? (
          <>
            <Button
              onClick={() => setSelectedCitizen(null)}
              variant="outlined"
              color="primary"
              disabled={loading}
            >
              Volver
            </Button>
            <Button
              onClick={() => onAssign(selectedCitizen, position)}
              variant="contained"
              color="primary"
              disabled={loading || !position.trim()}
            >
              Confirmar
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} variant="outlined" color="primary">
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AssignSpokepersonModal;
