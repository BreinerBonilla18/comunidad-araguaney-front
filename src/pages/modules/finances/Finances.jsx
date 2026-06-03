/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo, useEffect, useCallback } from "react";
import { LinearProgress } from "@mui/material";
/* ----------------- icons ----------------- */
import { FaWallet, FaFileCsv, FaPlus } from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
import {
  exportToExcelFinances,
  exportToPDFFinances,
} from "../../../utils/exportUtils";
/* ----------------- API ----------------- */
import {
  getFinances,
  getFinanceStats,
  createFinance,
} from "../../../api/finances";
/* --------------- components -------------- */
import FinanceStadisticCard from "./components/FinanceStadisticCard";
import FinanceManagementModal from "./modals/FinanceManagementModal";
import TableFinances from "./components/TableFinances";
import ModalSuccess from "../../../modals/ModalSucces";
import ModalError from "../../../modals/ModalError";
import ExportFinancesModal from "./modals/ExportFinancesModal";

const emptyFinanceForm = {
  description: "",
  transaction_type: "",
  amount: "",
  transaction_date: "",
};

function Finances() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [timePeriod, setTimePeriod] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [financeForm, setFinanceForm] = useState(emptyFinanceForm);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [financesRes, statsRes] = await Promise.all([
        getFinances(),
        getFinanceStats(),
      ]);

      if (financesRes.success) {
        setTransactions(financesRes.data);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredTransactions = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const now = new Date();
    
    let startDate;
    if (timePeriod === "3months") {
      startDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (timePeriod === "6months") {
      startDate = new Date(now.setMonth(now.getMonth() - 6));
    } else if (timePeriod === "1year") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    const filtered = transactions.filter((t) => {
      const matchesQuery = [t.description].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      );
      const matchesType =
        filterType === "todos" ||
        (filterType === "ingreso" && t.transaction_type === "income") ||
        (filterType === "egreso" && t.transaction_type === "expense");
      
      const matchesTimePeriod = timePeriod === "all" || 
        (startDate && new Date(t.transaction_date) >= startDate);
      
      return matchesQuery && matchesType && matchesTimePeriod;
    });

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [transactions, query, filterType, timePeriod, page, rowsPerPage]);

  const totalFilteredTransactions = useMemo(() => {
    const q = normalizeText(query).toLowerCase();
    const now = new Date();
    
    let startDate;
    if (timePeriod === "3months") {
      startDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (timePeriod === "6months") {
      startDate = new Date(now.setMonth(now.getMonth() - 6));
    } else if (timePeriod === "1year") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    return transactions.filter((t) => {
      const matchesQuery = [t.description].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      );
      const matchesType =
        filterType === "todos" ||
        (filterType === "ingreso" && t.transaction_type === "income") ||
        (filterType === "egreso" && t.transaction_type === "expense");
      
      const matchesTimePeriod = timePeriod === "all" || 
        (startDate && new Date(t.transaction_date) >= startDate);
      
      return matchesQuery && matchesType && matchesTimePeriod;
    }).length;
  }, [transactions, query, filterType, timePeriod]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFinanceForm(emptyFinanceForm);
  };

  const handleSaveFinance = async () => {
    try {
      const response = await createFinance(financeForm);
      if (response.success) {
        setSuccessModal({
          open: true,
          title: "¡Registro Exitoso!",
          message: "El movimiento ha sido guardado correctamente.",
        });
        handleCloseModal();
        fetchData();
      }
    } catch (error) {
      console.error("Error saving finance:", error);
      setErrorModal({
        open: true,
        title: "Error",
        message: error.message || "No se pudo registrar el movimiento.",
      });
    }
  };

  const handleExportPDF = (exportTimePeriod, exportTransactionType) => {
    const now = new Date();
    let startDate;
    if (exportTimePeriod === "3months") {
      startDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (exportTimePeriod === "6months") {
      startDate = new Date(now.setMonth(now.getMonth() - 6));
    } else if (exportTimePeriod === "1year") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    const filteredData = transactions.filter((t) => {
      const matchesType = exportTransactionType === "all" ||
        (exportTransactionType === "income" && t.transaction_type === "income") ||
        (exportTransactionType === "expense" && t.transaction_type === "expense");
      
      const matchesTimePeriod = exportTimePeriod === "all" || 
        (startDate && new Date(t.transaction_date) >= startDate);
      
      return matchesType && matchesTimePeriod;
    });
    
    exportToPDFFinances(filteredData);
    setExportModalOpen(false);
  };

  const handleExportExcel = (exportTimePeriod, exportTransactionType) => {
    const now = new Date();
    let startDate;
    if (exportTimePeriod === "3months") {
      startDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (exportTimePeriod === "6months") {
      startDate = new Date(now.setMonth(now.getMonth() - 6));
    } else if (exportTimePeriod === "1year") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    const filteredData = transactions.filter((t) => {
      const matchesType = exportTransactionType === "all" ||
        (exportTransactionType === "income" && t.transaction_type === "income") ||
        (exportTransactionType === "expense" && t.transaction_type === "expense");
      
      const matchesTimePeriod = exportTimePeriod === "all" || 
        (startDate && new Date(t.transaction_date) >= startDate);
      
      return matchesType && matchesTimePeriod;
    });
    
    exportToExcelFinances(filteredData);
    setExportModalOpen(false);
  };

  const financeSummary = [
    {
      title: "Total Ingresos",
      amount: stats.total_income?.toFixed(2) || "0.00",
      borderColorClass: "border-green-500",
      textColor: "green",
    },
    {
      title: "Total Egresos",
      amount: stats.total_expenses?.toFixed(2) || "0.00",
      borderColorClass: "border-red-500",
      textColor: "red",
    },
    {
      title: "Balance General",
      amount: stats.balance?.toFixed(2) || "0.00",
      borderColorClass: "border-amber-500",
      bgClass: "bg-brand-primary/5",
      textColor: "#f59e0b",
    },
  ];

  useEffect(() => {
    setPage(0);
  }, [query, filterType, timePeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-5">
        <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Box className="flex items-center gap-2">
            <FaWallet size={24} className="text-brand-primary" />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Finanzas Comunitarias
            </Typography>
          </Box>

          <Box className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              startIcon={<FaFileCsv />}
              onClick={() => setExportModalOpen(true)}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              startIcon={<FaPlus />}
              onClick={() => setOpenModal(true)}
            >
              Nuevo Registro
            </Button>
          </Box>
        </Box>
        <Box className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {financeSummary.map((summary, index) => (
            <FinanceStadisticCard
              key={index}
              title={summary.title}
              amount={summary.amount}
              borderColorClass={summary.borderColorClass}
              textColor={summary.textColor}
              bgClass={summary.bgClass}
            />
          ))}
        </Box>
        <Paper className="p-4">
          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress color="primary" />
            </Box>
          )}
          <Box className="flex flex-col gap-4">
            <Box className="flex flex-col md:flex-row gap-3">
              <TextField
                fullWidth
                label="Buscar por descripción o categoría..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <TextField
                select
                sx={{ minWidth: 200 }}
                label="Tipo"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="ingreso">Ingresos</MenuItem>
                <MenuItem value="egreso">Egresos</MenuItem>
              </TextField>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={timePeriod}
                  label="Período"
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <MenuItem value="all">Todo el historial</MenuItem>
                  <MenuItem value="3months">Últimos 3 meses</MenuItem>
                  <MenuItem value="6months">Últimos 6 meses</MenuItem>
                  <MenuItem value="1year">Último año</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Movimientos Recientes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {totalFilteredTransactions} registros
                </Typography>
              </Box>
              <TableFinances
                filteredTransactions={filteredTransactions}
                totalCount={totalFilteredTransactions}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>
      <FinanceManagementModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        financeForm={financeForm}
        setFinanceForm={setFinanceForm}
        onSave={handleSaveFinance}
      />

      <ExportFinancesModal
        openModal={exportModalOpen}
        handleCloseModal={() => setExportModalOpen(false)}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        loading={loading}
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

export default Finances;
