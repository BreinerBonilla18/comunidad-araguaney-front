import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";

function ModalDelete({ title, message, openModal, setOpenModal, onConfirm }) {
  return (
    <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col items-center gap-4 py-4">
            <FaRegTrashAlt size={64} className="text-red-500" />
          <Typography variant="body1" align="center">
            {message}
          </Typography>
         </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button variant="outlined" onClick={() => setOpenModal(false)}>
            Cancelar
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
            Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalDelete  