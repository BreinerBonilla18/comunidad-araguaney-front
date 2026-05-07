import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FaCircleXmark } from "react-icons/fa6";

function ModalError({ title, message, openModal, setOpenModal }) {
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
            <FaCircleXmark size={64} className="text-red-500" />
          <Typography variant="body1" align="center">
            {message}
          </Typography>
         </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button variant="contained" onClick={() => setOpenModal(false)}>
            OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalError;
