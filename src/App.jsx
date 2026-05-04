import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/modules/dashboard/Dashboard";
import ModulesLayout from "./layout/ModulesLayout";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import FamilyRegistry from "./pages/modules/family-registry/FamilyRegistry";

const Beneficios = () => <div>Beneficios sociales</div>;
const Proyectos = () => <div>Proyectos comunitarios</div>;
const Constancias = () => <div>Constancias</div>;
const Documentos = () => <div>Documentos</div>;
const Finanzas = () => <div>Finanzas</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ModulesLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/family-registry" element={<FamilyRegistry />} />
            <Route path="/beneficios" element={<Beneficios />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/constancias" element={<Constancias />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/finanzas" element={<Finanzas />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
