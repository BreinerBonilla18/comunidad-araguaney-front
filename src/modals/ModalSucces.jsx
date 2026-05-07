import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";

function ModalSuccess({ title, message, openModal, setOpenModal }) {
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
            <FaCheckCircle size={64} className="text-green-500" />
          <Typography variant="body1" align="center">
            {message}
          </Typography>
         </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={() => setOpenModal(false)} color="inherit" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalSuccess;
