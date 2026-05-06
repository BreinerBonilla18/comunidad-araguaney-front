/* ------------ MUI Components --------------*/
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
} from "@mui/material";
/* ----------------- hooks ----------------- */
import { useState, useMemo } from "react";
/* ----------------- icons ----------------- */
import {
  FaWallet,
  FaFilePdf,
  FaFileCsv,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
/* ----------------- utils ----------------- */
import { normalizeText } from "../../../utils/functions";
/* --------------- components -------------- */
import FinanceStadisticCard from "./components/FinanceStadisticCard";
import FinanceManagementModal from "./modals/FinanceManagementModal";
import TableFinances from "./components/TableFinances";

function Finances() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [openModal, setOpenModal] = useState(false);

  // Mock data for finances
  const transactions = useMemo(
    () => [
      {
        id: 1,
        date: "2024-03-01",
        description: "Aporte mensual vecinos - Marzo",
        category: "Aportes",
        type: "ingreso",
        amount: 1200.5,
      },
      {
        id: 2,
        date: "2024-03-05",
        description: "Pago servicio mantenimiento áreas verdes",
        category: "Mantenimiento",
        type: "egreso",
        amount: 350.0,
      },
      {
        id: 3,
        date: "2024-03-10",
        description: "Reparación bomba de agua",
        category: "Servicios",
        type: "egreso",
        amount: 150.75,
      },
      {
        id: 4,
        date: "2024-03-15",
        description: "Donación proyecto iluminación",
        category: "Donaciones",
        type: "ingreso",
        amount: 500.0,
      },
    ],
    [],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = normalizeText(query).toLowerCase();
      const matchesQuery = [t.description, t.category].some((val) =>
        normalizeText(val || "")
          .toLowerCase()
          .includes(q),
      );
      const matchesType = filterType === "todos" || t.type === filterType;
      return matchesQuery && matchesType;
    });
  }, [transactions, query, filterType]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === "ingreso") acc.income += t.amount;
        else acc.expense += t.amount;
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 },
    );
  }, [transactions]);

  const financeSummary = [
    {
      title: "Total Ingresos",
      amount: totals.income.toFixed(2),
      borderColorClass: "border-green-500",
      textColor: "green",
    },
    {
      title: "Total Egresos",
      amount: totals.expense.toFixed(2),
      borderColorClass: "border-red-500",
      textColor: "red",
    },
    {
      title: "Balance General",
      amount: totals.balance.toFixed(2),
      borderColorClass: "border-amber-500",
      bgClass: "bg-brand-primary/5",
      textColor: "#f59e0b",
    },
  ];

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
            <Button variant="outlined" startIcon={<FaFileCsv />}>
              Exportar Excel
            </Button>
            <Button variant="outlined" startIcon={<FaFilePdf />}>
              Exportar PDF
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
        <Paper className="p-4 shadow-sm border border-brand-primary/20">
          <Box className="flex flex-col gap-4">
            <Box className="flex flex-col md:flex-row gap-3">
              <TextField
                fullWidth
                label="Buscar por descripción o categoría..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch className="text-brand-primary" />
                    </InputAdornment>
                  ),
                }}
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
            </Box>

            <Divider />
            <Paper className="p-3" variant="outlined">
              <Box className="flex items-center justify-between gap-2 mb-2">
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Movimientos Recientes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: {filteredTransactions.length} registros
                </Typography>
              </Box>
              <TableFinances filteredTransactions={filteredTransactions} />
            </Paper>
          </Box>
        </Paper>
      </Box>
      <FinanceManagementModal
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Box>
  );
}

export default Finances;
