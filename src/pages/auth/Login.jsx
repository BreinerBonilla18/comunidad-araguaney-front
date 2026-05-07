/* ----------- MUI Components -----------*/
import { TextField, Button } from "@mui/material";
/* ----------------- hooks ----------------- */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
/* ----------------- icons ----------------- */
import { FaLock, FaUser } from "react-icons/fa";
/* --------------- components -------------- */
import ModalError from "../../modals/ModalError";
/* ------------------ api ------------------ */
import { loginUser } from "../../api/users";
/* ------------------ others ------------------ */
import brand from "../../assets/brand.svg";

const Login = () => {
  const [openModalError, setOpenModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isFieldsFilled = username !== "" && password !== ""

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await loginUser(username, password);
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setOpenModalError(true)
      setErrorMessage(error.message || "Credenciales incorrectas");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface-bg">
        <div className="p-8 rounded-2xl shadow-2xl w-full max-w-md border bg-surface-card border-surface-border">
          {/* Logo y título */}
          <div className="flex flex-col items-center mb-6">
            <img src={brand} alt="Brand" className="w-15 h-15 mb-2" />
            <h1 className="text-3xl font-bold tracking-wide text-text-primary">
              Araguaney
            </h1>
            <p className="mt-1 text-text-secondary">Consejo Comunal</p>
          </div>

          <h2 className="text-xl font-semibold text-center mb-6 text-text-primary">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <TextField
              fullWidth
              variant="outlined"
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <FaUser className="mr-2 text-text-secondary" size={18} />
                  ),
                },
              }}
            />

            {/* Campo de contraseña */}
            <TextField
              fullWidth
              variant="outlined"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <FaLock className="mr-2 text-text-secondary" size={18} />
                  ),
                },
              }}
            />

            {/* Botón de entrada */}
            <Button type="submit" disabled={isLoading || !isFieldsFilled} fullWidth variant="contained" size="large">
              Entrar
            </Button>
          </form>
        </div>
      </div>

      <ModalError
        title="Error al iniciar sesión"
        message={errorMessage}
        openModal={openModalError}
        setOpenModal={setOpenModalError}
      />
    </>
  );
};

export default Login;
