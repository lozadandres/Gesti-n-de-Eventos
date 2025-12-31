import { useState } from 'react';
import Swal from 'sweetalert2';
import { Container, Paper, TextField, Button, Typography, Link as MuiLink, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      // Dispatch event to update Navbar immediately
      window.dispatchEvent(new Event('auth-change'));

      Swal.fire({
        icon: 'success',
        title: 'Login Exitoso',
        text: `Bienvenido ${data.usuario.name}`,
        confirmButtonColor: "#b4ff46",
        background: '#1e1e1e',
        color: '#fff'
      }).then(() => {
        navigate(data.usuario.isAdmin ? '/dashboard' : '/');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: "#d500f9",
        background: '#1e1e1e',
        color: '#fff'
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Paper elevation={10} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(30,30,30,0.8)', backdropFilter: 'blur(10px)' }}>
            <Box
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: '0 0 20px rgba(180, 260, 70, 0.4)'
                }}
            >
                <LoginIcon sx={{ fontSize: 35, color: 'black' }} />
            </Box>
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Bienvenido
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.1rem' }}
            >
              Ingresar
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink href="/regster" variant="body2" color="secondary">
                  {"¿No tienes una cuenta? Regístrate"}
                </MuiLink>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <MuiLink href="/" variant="body2" color="text.secondary">
                    Volver al Inicio
                </MuiLink>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;