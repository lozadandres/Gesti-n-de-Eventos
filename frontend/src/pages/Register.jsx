import { useState } from 'react';
import Swal from 'sweetalert2';
import { Container, Paper, TextField, Button, Typography, Link as MuiLink, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      window.dispatchEvent(new Event('auth-change'));

      Swal.fire({
        icon: 'success',
        title: 'Registro Exitoso',
        text: data.usuario.isAdmin ? 'Administrador registrado' : 'Usuario registrado exitosamente',
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
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Paper elevation={10} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(30,30,30,0.8)', backdropFilter: 'blur(10px)' }}>
            <Box
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: '0 0 20px rgba(213, 0, 249, 0.4)'
                }}
            >
                <PersonAddIcon sx={{ fontSize: 35, color: 'white' }} />
            </Box>
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Crear Cuenta
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre Completo"
              name="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
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
              Registrarse
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink href="/login" variant="body2" color="primary">
                  {"¿Ya tienes una cuenta? Inicia sesión"}
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

export default Register;