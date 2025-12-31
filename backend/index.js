// Importar las dependencias (paquetes) necesarios
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Carga las variables de entorno al inicio del archivo

// Configurar el servidor de Express
const app = express();
// Middleware para analizar los JSON que se soliciten
app.use(express.json());
// Habilitando el intercambio de información para permitir las diferentes solicitudes
app.use(cors());

// Obtener la URI de MongoDB desde las variables del entorno
const mongoUri = process.env.MONGODB_URI;

// Solo conectar si no estamos en entorno de prueba
if (process.env.NODE_ENV !== 'test') {
    mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

      // Creamos una promesa para especificar si pudimos conectarnos a la bdd de MongoDB
      .then(() => console.log("Conexión exitosa a MongoDB"))
      .catch((error) =>
        console.error("Error al conectar a la base de datos: ", error)
      );
}

// Creamos un modelo de Mongoose para nuestros datos
const Item = mongoose.model(
  "Eventos",
  new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: String,
  })
);

// Nuevo modelo de Usuario
const UsuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Middleware de autenticación
const autenticar = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acceso no autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

const esAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Acceso denegado" });
  next();
};

// Ruta de registro
app.post("/registro", async (req, res) => {
  try {
    const { name, email, password, superUserCode } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const totalUsuarios = await Usuario.countDocuments();

    const nuevoUsuario = new Usuario({
      name,
      email,
      password: hashedPassword,
      isAdmin: totalUsuarios === 0,
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { userId: nuevoUsuario._id, isAdmin: nuevoUsuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ usuario: nuevoUsuario, token });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
});

// Ruta de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: usuario._id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ usuario, token });
  } catch (error) {
    res.status(500).json({ message: "Error en el login" });
  }
});

// Ruta para refrescar token
app.post("/refresh-token", autenticar, async (req, res) => {
  try {
    // El token actual ya fue verificado por el middleware autenticar
    // Creamos un nuevo token con una nueva expiración
    const newToken = jwt.sign(
      { userId: req.user.userId, isAdmin: req.user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error al refrescar el token" });
  }
});

// Rutas Protegidas
app.get("/dashboard", autenticar, esAdmin, async (req, res) => {
  try {
    const eventos = await Item.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener eventos" });
  }
});

// Crear las rutas para el CRUD

// Ruta para obtener todos los nombres con sus descripciones
// http://localhost:5000/items
app.get("/items", autenticar, async (req, res) => {
  const items = await Item.find(); // Obtenemos la lista de los nombres en formato JSON
  res.json(items);
});

// Ruta para crear un nuevo usuario con su descripción
// http://localhost:5000/items
app.post("/items", autenticar, async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save(); // Guardamos el nombre y la descripción en la bdd
  res.status(201).json(newItem); // Enviamos el dato del usuario creado en JSON
});

// Ruta para actualizar un elemento existente
// http://localhost:5000/items/id?
app.put("/items/:id", autenticar, async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem); // Ejecutamos el elemento actualizado en formato JSON
});

// Ruta para eliminar un usuario existente
// http://localhost:5000/items/id?
app.delete("/items/:id", autenticar, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id); // Eliminamos el elemento de la base de datos
  res.status(204).send(); // Enviamos una respuesta sin contenido (elimino el dato)
});

// Configurar el puerto y ponemos el servidor en produccion
// Configurar el puerto y ponemos el servidor en produccion
const PORT = process.env.PORT || 5000; // Si no tienes un puerto asignado , el servidor correra en el puerto 5000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
  });
}

module.exports = app;
