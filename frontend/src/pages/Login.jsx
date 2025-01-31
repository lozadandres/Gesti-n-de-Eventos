import { useState } from 'react';
import Swal from 'sweetalert2';
import '../assets/loginCSS/styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

      Swal.fire({
        icon: 'success',
        title: 'Login Exitoso',
        text: `Bienvenido ${data.usuario.name}`,
        confirmButtonColor: "#3a043a",
      }).then(() => {
        window.location.href = data.usuario.isAdmin ? '/Dashboard' : '/';
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: "#3a043a",
      });
    }
  };

  return (
    <section className='logingSection'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Ingresar" />
      </form>
      <p>¿No tienes una cuenta? <a href="/regster">Regístrate</a></p>
      <a href="/">Volver al Inicio</a>
    </section>
  );
};

export default Login;