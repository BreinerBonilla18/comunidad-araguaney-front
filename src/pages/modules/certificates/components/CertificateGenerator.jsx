import {
  FaCertificate,
  FaFileAlt,
  FaHome,
  FaUserCheck
} from "react-icons/fa";
import {
  Box,
  Button,
  Divider,
  Typography
} from "@mui/material";
import { useState, useCallback } from "react";
import { getSpokepersons } from "../../../../api/spokepersons";
import { exportResidencyCertificate } from "../../../../utils/exportUtils";
import araguaneyLogo from "../../../../assets/araguaney-img.png";
import ResidenceCertificateFormModal from "../modals/ResidenceCertificateFormModal";

function CertificateGenerator({ selectedResident }) {
  const [openResidencyModal, setOpenResidencyModal] = useState(false);
  const [spokepersons, setSpokepersons] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    documentId: "",
    address: "",
    residencyYears: "0",
    residencyMonths: "0",
    issueDate: new Date().toISOString().split("T")[0],
  });

  const fetchSpokepersons = useCallback(async () => {
    try {
      const response = await getSpokepersons();
      if (response.success) {
        setSpokepersons(response.data);
      }
    } catch (error) {
      console.error("Error fetching spokespersons:", error);
    }
  }, []);

  const handleOpenResidencyModal = () => {
    if (selectedResident) {
      setFormData((prev) => ({
        ...prev,
        fullName: selectedResident.fullName,
        documentId: selectedResident.documentId,
        address: "",
      }));
      setOpenResidencyModal(true);
      fetchSpokepersons();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExportResidency = async (customData) => {
    const dataToExport = customData || formData;
    await exportResidencyCertificate(dataToExport, spokepersons, araguaneyLogo);
    setOpenResidencyModal(false);
  };

  const residentDetails = [
    {
      label: "Nombre Completo",
      value: selectedResident?.fullName,
    },
    {
      label: "Cédula",
      value: selectedResident?.documentId,
    },
    {
      label: "Dirección",
      value: selectedResident?.address,
    },
    {
      label: "Teléfono",
      value: selectedResident?.phone_number,
    },
  ];

  if (!selectedResident) {
    return (
      <Box className="text-center p-10">
        <Box className="bg-slate-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <FaCertificate size={40} className="text-slate-300" />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay selección
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Seleccione un residente de la lista para gestionar y generar sus
          documentos oficiales.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-full">
      <Box className="mb-6">
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FaUserCheck className="text-primary" /> Detalles del Residente
        </Typography>

        <Box className="p-4 rounded-lg border border-brand-primary shadow-sm">
          {residentDetails.map((details, index) => (
            <Box key={index} className="flex flex-col mb-2">
              <Typography
                variant="caption"
                className="text-brand-primary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {details.label}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {details.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box className="flex flex-col gap-4 mt-auto">
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Generar Documentos
        </Typography>

        <Button
          variant="contained"
          fullWidth
          startIcon={<FaHome />}
          size="large"
          color="primary"
          sx={{
            py: 2,
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: 2,
          }}
          onClick={handleOpenResidencyModal}
        >
          Constancia de Residencia (PDF)
        </Button>

        <Button
          variant="outlined"
          fullWidth
          color="primary"
          startIcon={<FaFileAlt />}
          size="large"
          sx={{
            py: 2,
            justifyContent: "flex-start",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: 2,
          }}
          onClick={() =>
            alert(
              `Generando Constancia de Buena Conducta para ${selectedResident.fullName}`,
            )
          }
        >
          Constancia Buena Conducta (PDF)
        </Button>
      </Box>
      <ResidenceCertificateFormModal
        setOpenResidencyModal={setOpenResidencyModal}
        handleExportResidency={handleExportResidency}
        openResidencyModal={openResidencyModal}
        handleInputChange={handleInputChange}
        formData={formData}
      />
    </Box>
  );
}

export default CertificateGenerator;
