import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/modules/dashboard/Dashboard";
import ModulesLayout from "./layout/ModulesLayout";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import FamilyRegistry from "./pages/modules/family-registry/FamilyRegistry";
import SocialBenefits from "./pages/modules/social-benefits/SocialBenefits";
import Certificates from "./pages/modules/certificates/Certificates";
import Spokepersons from "./pages/modules/spokepersons/Spokepersons";
import Projects from "./pages/modules/community-projects/Projects";
import Documents from "./pages/modules/documents/Documents";
import Finances from "./pages/modules/finances/Finances";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/es'; 

// Componente para rutas protegidas
const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Componente para rutas públicas
const PublicRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <CssBaseline />
        <Router>
        <Routes>
          {/* Ruta raíz redirige según el estado de la sesión */}
          <Route
            path="/"
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
          />

          {/* Rutas Públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Rutas Privadas */}
          <Route element={<PrivateRoute />}>
            <Route element={<ModulesLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/family-registry" element={<FamilyRegistry />} />
              <Route path="/beneficiaries" element={<SocialBenefits />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/spokespersons" element={<Spokepersons/>} /> 
            </Route>
          </Route>

          {/* Redirección por defecto para rutas no encontradas */}
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
