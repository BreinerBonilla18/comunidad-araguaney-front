import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import brand from "../../assets/brand.svg"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciar sesión con:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-bg">
      <div className="p-8 rounded-2xl shadow-2xl w-full max-w-md border bg-surface-card border-surface-border">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-6">
          <img src={brand} alt="Brand" className="w-15 h-15 mb-2" />
          <h1 className="text-3xl font-bold tracking-wide text-text-primary">
            Araguaney
          </h1>
          <p className="mt-1 text-text-secondary">
            Consejo Comunal
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6 text-text-primary">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <TextField
            fullWidth
            variant="outlined"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <MdEmail className="mr-2 text-text-secondary" size={20} />
              ),
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
            InputProps={{
              startAdornment: (
                <FaLock className="mr-2 text-text-secondary" size={18} />
              ),
            }}
          />

          {/* Botón de entrada */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;