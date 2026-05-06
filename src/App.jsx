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
import SocialBenefits from "./pages/modules/social-benefits/SocialBenefits";

import Certificates from "./pages/modules/certificates/Certificates";
import Projects from "./pages/modules/community-projects/Projects";
import Documents from "./pages/modules/documents/Documents";
import Finances from "./pages/modules/finances/Finances";





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
            <Route path="/beneficios" element={<SocialBenefits />} />
            <Route path="/proyectos" element={<Projects />} />
            <Route path="/constancias" element={<Certificates />} />
            <Route path="/documentos" element={<Documents />} />
            <Route path="/finanzas" element={<Finances />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
