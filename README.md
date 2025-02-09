# Proyecto de Autenticación y CRUD con React y Node.js

Este proyecto es una aplicación web que permite a los usuarios registrarse, iniciar sesión y administrar eventos a través de un CRUD. Utiliza un backend en Node.js con Express y MongoDB, y un frontend en React.

<img src="https://github.com/lozadandres/Juego-Retro-Super-Snake-con-POO-en-Python---Univalle-Tulu-/blob/3b417fc7ba1c439053cacf5c793e6332a694240c/Juego%20Retro%20Super%20Snake%20con%20POO%20en%20Python/assets/imagenes/339798857-8c91a017-07e7-4b06-80ed-949593fe2820.jpeg" width="100%" height="500" alt="App"/>

## Tecnologías Utilizadas

- **Frontend:** React, React Router, SweetAlert2, Axios
- **Backend:** Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, dotenv
- **Base de Datos:** MongoDB

## Instalación

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Instalación del Backend

```bash
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

### Configuración del Backend

Crea un archivo `.env` en la carpeta `backend` y agrega las siguientes variables de entorno:

```
MONGODB_URI=tu_conexion_a_mongodb
JWT_SECRET=una_clave_secreta_segura
PORT=5000
```

Ejecutar el backend:

```bash
node index.js
```

## Instalación del Frontend

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install sweetalert2 axios react-router-dom
```

Ejecutar el frontend:

```bash
npm run dev
```

## Uso

- Accede a http://localhost:5173/ para ver la interfaz.
- **Registro y Login:** Los usuarios pueden registrarse y autenticarse.
- **Administración de Eventos:** Se pueden agregar, modificar y eliminar eventos.
- **Roles de Usuario:** Se asigna el primer usuario como administrador.
- **Filtro:** Puedes filtrar eventos por fecha y ubicación.

## Estructura del Proyecto

```

/
backend
│── index.js
│── info backend.txt
│── package-lock.json
│── package.json
│
frontend
│── node_modules/
│── public/
│── src
│   │── assets/
│   │── components
│   │   │── Footer.jsx
│   │   │── NavBar.jsx
│   │── pages
│   │   │── Dashboard.jsx
│   │   │── Home.jsx
│   │   │── Login.jsx
│   │   │── Register.jsx
│   │── service
│   │   │── itemService.js
│   │── App.css
│   │── App.jsx
│   │── AppCopia.jsx
│   │── index.css
│   │── info frontend.txt
│   │── main.jsx
│── .gitignore
│── eslint.config.js
│── index.html

```
## Autor

Desarrollado por Andrés Felpe Lozada Manzano




