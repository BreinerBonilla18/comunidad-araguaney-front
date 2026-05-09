import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FaFileExcel, FaFilePdf, FaCheckCircle } from "react-icons/fa";
import { exportToExcelBeneficiaries, exportToPDFBeneficiaries } from "../../../../utils/exportUtils";

function BeneficiariesExporterModal({
  open,
  onClose,
  beneficiaries,
  benefitType,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        ¡Jornada Finalizada!
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col items-center gap-4 py-4">
          <FaCheckCircle size={60} className="text-green-500" />
          <Typography
            variant="body1"
            align="center"
            sx={{ fontWeight: "medium" }}
          >
            Los datos han sido guardados correctamente.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Puede descargar el reporte de beneficiarios en cualquiera de los
            siguientes formatos:
          </Typography>

          <Box className="flex flex-col w-full gap-2 mt-2">
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<FaFilePdf />}
              onClick={() =>
                exportToPDFBeneficiaries(beneficiaries, benefitType)
              }
              sx={{ py: 1.5 }}
            >
              Descargar PDF
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="success"
              startIcon={<FaFileExcel />}
              onClick={() =>
                exportToExcelBeneficiaries(beneficiaries, benefitType)
              }
              sx={{ py: 1.5 }}
            >
              Descargar Excel
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 3 }}>
        <Button variant="contained" onClick={onClose} sx={{ px: 4 }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BeneficiariesExporterModal;
