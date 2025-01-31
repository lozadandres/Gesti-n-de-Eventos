import { useState } from 'react';
import Swal from 'sweetalert2';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

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

      Swal.fire({
        icon: 'success',
        title: 'Registro Exitoso',
        text: data.usuario.isAdmin ? 
          'Administrador registrado' : 
          'Usuario registrado exitosamente',
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
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        
        <input type="submit" value="Registro" />
      </form>
      <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
      <a href="/">Volver al Inicio</a>
    </section>
  );
};

export default Register;